import Vue from 'vue';
import VueRouter from 'vue-router';
import { clone, identity } from 'ramda';
import store from '@store';
import i18n from '@i18n';
import { treeFilter } from '@util/datahelper.js';
import NProgress from 'nprogress';
import config from '~/config.js';
import 'nprogress/nprogress.css';

const { EXCLUDE_MODULES } = config;

const layoutList = {
  menu: () => import('@layout/MenuLayout.vue'),
  nav: () => import('@layout/NavLayout.vue'),
  anchor: () => import('@layout/AnchorLayout.vue'),
};
const layoutType = config.LAYOUT_TYPE || 'menu';
const layoutComp = layoutList[layoutType] || layoutList.menu;
const appView = () => import('@layout/AppView.vue');
const iframeComp = () => import('@layout/Iframe.vue');
const homeComp = config.HOME_COMP;

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const base = process.env.BASE_URL;

// const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_]*)+\/router\/[A-z0-9- ./]+\.vue$/);
const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_-]*)+\/router\/[~A-z0-9- ./]+\.vue$/);
const clientFiles = req.keys().filter((path) => !EXCLUDE_MODULES.includes(path.split('/')[1]));

// "./s1/router/m1.vue", "./s2/router/m1.vue"
function convertPath (path) {
  // 是否包含`~`
  const hide = path.includes('~');
  const splitPath = path.split(/\/~?|.vue$/).slice(1, -1);
  splitPath.splice(1, 1);
  // 组件名称
  const vueName = splitPath.slice(-1)[0] || 'index';
  const routerPath = vueName.split('.').map((item, index) => (index ? `:${item}?` : item));
  const url = ['', ...splitPath.slice(0, -1), ...routerPath].join('/');
  // 是否包含路由参数
  const props = vueName.includes('.');
  // 模块名称
  const module = splitPath[0];
  const componentPath = path.slice(2);

  return {
    module,
    hide,
    props,
    componentPath,
    componentFullPath: path,
    url,
    vueName,
    splitPath,
  };
}

const componentMap = clientFiles.map(convertPath);


const systemPaths = [
  './result/view/403.vue',
  './result/view/404.vue',
  './result/view/500.vue',
  './login/view/Login.vue',
];

const systemRouterConfigs = systemPaths.map(convertPath);
const systemRouters = [];
systemRouterConfigs.forEach((obj) => {
  if (obj.moduleName !== 'layout') {
    systemRouters.push({
      name: obj.vueName,
      path: `/${obj.vueName}`.toLowerCase(),
      meta: {
        title: obj.vueName,
      },
      component: () => import(`~/${obj.componentPath}`),
    });
  }
});

const mode = config.LAYOUT_TYPE === 'anchor' ? 'hash' : config.ROUTER_MODE || 'history';

const defaultRoutes = [...systemRouters, {
  path: '/',
  component: layoutComp,
}];

if (homeComp && homeComp instanceof Function) {
  defaultRoutes[defaultRoutes.length - 1].children = [{
    path: '',
    component: homeComp,
  }];
}

const router = new VueRouter({
  mode,
  base,
  routes: defaultRoutes,
});
VueRouter.prototype.test = function testFn (path) {
  const toPathName = this.match(path).name;
  return !!toPathName && (toPathName !== '404');
};

const treeEach = (fn, tree, parent = {}) => {
  tree.forEach((item, index) => {
    fn(item, index, parent, tree);
    if (item.children && item.children.length) {
      treeEach(fn, item.children, item);
    }
  });
};


store.watch((state) => state.serverMenus, (serverMenus) => {
  const clientRouter = clone(serverMenus);
  treeEach((menu, index, parent) => {
    const path = menu.url;
    menu.root = !parent.id;
    const parentPath = parent.fullPath || '';
    const pathArray = menu.url ? [parentPath, menu.url] : [parentPath];
    menu.fullPath = pathArray.join('/');
    menu.meta = {
      title: menu.name,
      link: false,
    };
    if (menu.name && parent.meta && parent.meta.title !== menu.name) {
      parent.leaf = true;
    }
    if (menu.url) {
      // 查找本地配置是否存在
      const clientConfig = config.ENABLE_ROOT_MENUS ? componentMap.find((p) => (menu.root && ~p.url.indexOf(`${menu.fullPath}/index`)) || (!menu.root && ~p.url.indexOf(menu.fullPath))) : componentMap.find((p) => ~p.url.indexOf(menu.fullPath));
      if (clientConfig) {
        Object.assign(menu, clientConfig);
        menu.component = menu.root ? appView : () => import(`~/${menu.componentPath}`);
        menu.path = path || '';
      }
      if (menu.hide) {
        // const beforeComp = parent.component;
        const sameNameRouter = parent.children.find((item) => item.name === parent.meta.title || (item.meta && item.meta.title === parent.meta.title));
        if (!parent.children.find((item) => !item.path) && (sameNameRouter || /index\.vue$/.test(parent.componentFullPath))) {
          parent.children.push({
            component: () => import(`~/${parent.componentPath}`),
            path: '',
            meta: { title: parent.meta.title, link: true },
          });
        }
        parent.leaf = !/index\.vue$/.test(parent.componentFullPath);
        parent.component = appView;
      }
    }
    if (!menu.children || !menu.children.length) {
      menu.component = () => import(`~/${menu.componentPath}`);
    }
    // 以`http`开头的都是报表
    if (/^http/.test(menu.url)) {
      menu.report = true;
      const urls = menu.url.split('/');
      const urlsLen = urls.length;
      const props = urlsLen > 1 ? { url: urls[urlsLen - 1], auth: urls[0] } : { url: urls[0] };
      if (!parent.path) {
        parent.component = appView;
        parent.path = parent.url;
      }
      menu.path = menu.fullPath;
      menu.props = props;
      menu.component = iframeComp;
      if (!parent.leaf) {
        parent.fullPath = menu.fullPath;
        parent.component = iframeComp;
        parent.props = props;
      } else if (parent.children && parent.children.length) {
        parent.component = appView;
      }
    }
    menu.path = menu.path || '';
    delete menu.name;
  }, clientRouter);
  // treeEach((menu) => {
  //   if (!menu.children || !menu.children.length) {
  //     menu.component = () => import(`~/${menu.componentPath}`);
  //   }
  //   console.log(menu);
  // }, clientRouter);
  store.commit('setRouters', treeFilter((item) => !item.hide, clientRouter));

  const addedRoutes = [...clientRouter, {
    path: '*',
    redirect: '/404',
  }];
  // if (homeComp && homeComp instanceof Function) {
  //   addedRoutes.unshift({
  //     path: ' ',
  //     component: homeComp,
  //   });
  // }
  router.addRoutes([{
    path: '/',
    component: layoutComp,
    children: addedRoutes,
  }]);
});

export default router;

if (!config.CUST_ROUTER) {
  const menuFilter = config.MENU_FILTER || identity;
  const checkRouter = (to, from, next) => {
    function findNext (menus = []) {
      const home = (mode === 'hash' || (homeComp && homeComp instanceof Function)) ? true : menus.reduce(function rd (p, item, index) {
        if (index === 0) {
          let path = '';
          if (item.url) {
            path += `/${item.url}`;
          }
          if (item.children && item.children.length) {
            path += `${item.children.reduce(rd, '')}`;
          }
          return path;
        }
        return p;
      }, '');
      if (~['/403', '/404', '/500'].indexOf(to.path)) {
        return true;
      }
      if (to.path === '/') {
        return menus.length ? home : '404';
      }
      return true;
    }
    // 判断登陆状态 TODO: 服务端上线后解开注释
    if (store.state.isLogin) {
      // 如果加载过菜单
      if (store.state.isMenuLoaded) {
        next(findNext(treeFilter(menuFilter, store.state.menus)));
      } else {
        store.dispatch('fetchMenus').then((res) => {
          const issueMenus = treeFilter(menuFilter, res);
          store.commit('setServerMenus', issueMenus);
          Vue.nextTick(() => {
            next(findNext(issueMenus));
          });
        });
      }
    } else if (store.state.isDev) {
      next();
    } else {
      store.dispatch('logout');
    }
    const { DYNAMIC_TITLE } = config;
    if (!DYNAMIC_TITLE && to.meta && to.meta.title) {
      document.title = to.meta.title;
    } else if (typeof DYNAMIC_TITLE === 'string') {
      document.title = DYNAMIC_TITLE;
    } else if (typeof DYNAMIC_TITLE === 'function') {
      document.title = DYNAMIC_TITLE(to, i18n);
    }
    next();
  };

  if (store.state.allowLogin) {
    router.beforeEach((to, from, next) => {
      NProgress.start(); // 开始进度条
      // 是否跳转到登陆界面
      const toLogin = to.matched.some((r) => r.path.toLowerCase() === '/login');
      // 是否已经登陆
      const { isLogin } = store.state;
      // 已经通过登陆时，如果进入的不是登陆，直接放行
      if (isLogin && !toLogin) {
        checkRouter(to, from, next);
      }
      // 已经通过登陆时，如果进入的是登陆，跳转到主页
      if (isLogin && toLogin) {
        next({
          path: '/',
        });
      }
      // 如果进入的不是登陆界面，且未登陆过
      if (!toLogin && !isLogin) {
        document.title = i18n.t('action.login');
        next({
          name: 'Login',
          query: {
            redirect: to.fullPath,
          },
        });
      }
      // 登陆过但不是登陆界面就直接放行，或者没登陆但进入的是登陆界面直接放行
      // if (to.path === '/') {
      //   next({ path: '/home/home' });
      // }
      next(true);
    });
  } else {
    router.beforeEach((to, from, next) => {
      NProgress.start(); // 完成进度条
      checkRouter(to, from, next);
    });
  }


  router.afterEach(() => {
    NProgress.done(); // 完成进度条
  });
}
