import Vue from 'vue';
import VueRouter from 'vue-router';
import { clone } from 'ramda';
import store from '@store';
import { treeFilter } from '@util/datahelper.js';
import {
  excludeModules, layoutComp, contentComp, iframeComp,
} from '~/config.js';

Vue.use(VueRouter);
const base = process.env.BASE_URL;

// const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_]*)+\/router\/[A-z0-9- ./]+\.vue$/);
const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_-]*)+\/router\/[~A-z0-9- ./]+\.vue$/);
const clientFiles = req.keys().filter((path) => !excludeModules.includes(path.split('/')[1]));

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
      name: obj.componentName,
      path: obj.url,
      meta: null,
      component: () => import(`~/${obj.path}`),
    });
  }
});

const router = new VueRouter({
  mode: 'history',
  base,
  routes: [...systemRouters, {
    path: '/',
    component: layoutComp,
  }],
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
      const clientConfig = componentMap.find((p) => ~p.url.indexOf(menu.fullPath));
      if (clientConfig) {
        Object.assign(menu, clientConfig);
        menu.component = menu.root ? contentComp : () => import(`~/${menu.componentPath}`);
        menu.path = path;
      }
      if (menu.hide) {
        // const beforeComp = parent.component;
        if (!parent.children.find((item) => !item.path)) {
          parent.children.push({
            component: () => import(`~/${parent.componentPath}`),
            path: '',
            meta: { title: parent.meta.title, link: true },
          });
        }
        parent.leaf = false;
        parent.component = contentComp;
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
        parent.component = contentComp;
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
        parent.component = contentComp;
      }
    }
    delete menu.name;
  }, clientRouter);
  // treeEach((menu) => {
  //   if (!menu.children || !menu.children.length) {
  //     menu.component = () => import(`~/${menu.componentPath}`);
  //   }
  //   console.log(menu);
  // }, clientRouter);
  store.commit('setRouters', treeFilter((item) => !item.hide, clientRouter));
  router.addRoutes([{
    path: '/',
    component: layoutComp,
    children: [...clientRouter],
  },
  {
    path: '*',
    redirect: '/404',
  },
  ]);
});

export default router;
