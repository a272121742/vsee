import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@store';
import i18n from '@i18n';
import { identity } from 'ramda';
import { treeFilter } from '@util/datahelper.js';
import NProgress from 'nprogress';
import { ROUTER, THEME } from '@lib/config.js';
import config from '~/config.js';
import 'nprogress/nprogress.css';

// 这是一个补丁，不知道用来干嘛的
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function pushFn (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
VueRouter.prototype.test = function testFn (path) {
  const toPathName = this.match(path).name;
  return !!toPathName && (toPathName !== '404');
};
VueRouter.prototype.close = function closeFn (path) {
  if (this.tabs) {
    this.tabs.destory(path);
  }
};
VueRouter.prototype.open = function closeFn (path, jump = false) {
  if (this.tabs) {
    this.tabs.open(path, !!jump);
  }
};
Vue.use(VueRouter);

const {
  EXCLUDE_MODULES = [],
  MENU_FILTER = identity,
  DYNAMIC_TITLE = true,
} = config;

const {
  LAYOUT_TYPE = 'menu',
} = THEME;

const {
  HOME_COMP,
  PORTAL_COMP,
  MODE = 'history',
  CUSTOM = false,
  INJECT = {},
} = ROUTER;

const iframeComp = () => import('@layout/Iframe.vue');

const resultPathList = [
  './login/view/Login.vue',
  './result/view/403.vue',
  './result/view/404.vue',
  './result/view/500.vue',
];

const systemRouters = resultPathList.map(convertPath).map((item, index) => ({
  name: item.fileName,
  path: item.urlPath.toLowerCase(),
  meta: {
    title: item.fileName,
  },
  ...(index || store.state.allowLogin ? {
    component: () => import(`~/${item.componentPath}`),
  } : {
    beforeEnter: (to, from, next) => {
      window.location.replace('/');
      next(false);
    },
  }),
}));

const layoutList = {
  menu: () => import('@layout/MenuLayout.vue'),
  nav: () => import('@layout/NavLayout.vue'),
  anchor: () => import('@layout/AnchorLayout.vue'),
};

const layoutComp = layoutList[LAYOUT_TYPE] || layoutList.menu;

const base = process.env.BASE_URL;
const mode = LAYOUT_TYPE === 'anchor' ? 'hash' : MODE;

const defaultRoutes = [...systemRouters, {
  path: '*',
  component: layoutComp,
  // children: [{
  //   path: '*',
  //   name: 'undefined',
  //   component: () => import('~/result/view/404.vue'),
  // }],
}, {
  path: '/logout',
  beforeEnter () {
    store.dispatch('logout');
  },
}, ...(PORTAL_COMP ? [{
  path: '/',
  component: PORTAL_COMP,
}] : [])];

const loadingComp = () => import('@layout/Loading.vue');
const router = new VueRouter({
  mode,
  base,
  routes: [
    ...Object.keys(INJECT).map((path) => ({
      path,
      component: loadingComp,
      beforeEnter (to, from, next) {
        const fn = INJECT[path];
        next(fn({
          store, i18n, router, to, from, next, env: process.env,
        }));
      },
    }), INJECT),
    ...defaultRoutes,
  ],
});

const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_-]*)+\/router\/[~A-z0-9- ./]+\.vue$/);

const clientFiles = req.keys().filter((path) => !EXCLUDE_MODULES.includes(path.split('/')[1]));

function convertPath (path) {
  const hide = path.includes('~');
  const splitPath = path.split(/\/~?|.vue$/).slice(1, -1);
  splitPath.splice(1, 1);
  const [module, ...filePath] = splitPath;
  const fileNameWithProps = filePath.slice(-1)[0] || 'index';
  const props = fileNameWithProps.includes('.');
  const fileName = props ? fileNameWithProps.split('.')[0] : fileNameWithProps;
  const lastUrlList = fileNameWithProps.split('.').map((item, index) => (index ? `:${item}?` : item));
  const lastUrl = lastUrlList.join('/');
  const urlPath = ['', ...filePath.slice(0, -1), lastUrl].join('/');
  const urlFullPath = `/${module}${urlPath}`;
  splitPath.splice(splitPath.length - 1, 1, ...lastUrlList);
  const matchPath = [];
  const dirPath = [];
  splitPath.forEach((item, index, arr) => {
    if (!item.includes('?')) {
      matchPath.push(arr.slice(index).join('/'));
      dirPath.push(arr.slice(0, index + 1).join('/'));
    }
  });
  return {
    module, // 所在模块
    hide, // 是否为隐藏模块，包含`~`即为隐藏模块
    props, // 所附带的额外属性props
    componentPath: path.slice(2), // 组件所在路径
    componentFullPath: path, // 组件所在项目完整路径
    fileName,
    urlPath, // 请求的url
    urlFullPath, // 请求的完整地址
    splitPath, // 切割后的文件路径
    matchPath, // 可匹配的路径
    dirPath, // 文件夹路径
    componentName: [module, ...(fileName === 'index' ? [] : [fileName])].join('-'),
  };
}

const clientMenuList = clientFiles.map(convertPath);
const clientMenuMap = clientMenuList.reduce((result, item) => {
  if (item.urlPath === '/index') {
    result[item.urlFullPath.slice(0, -6)] = item;
  }
  result[item.urlFullPath] = item;
  return result;
}, {});

function hasOwnProperty (obj, property = '') { return Object.prototype.hasOwnProperty.call(obj, property); }

function tree2list (tree = [], children = 'children') {
  return tree.reduce((list, item) => {
    const current = { ...item };
    delete current.children;
    list.push({ ...current });
    if (item[children] && item[children].length) {
      list.push(...tree2list(item.children));
    }
    return list;
  }, []);
}

function tree2map (tree = [], children = 'children') {
  const menuMap = {};
  function menuEach (list = []) {
    list.forEach((menu) => {
      const current = { ...menu };
      if (menu.url) {
        menuMap[menu.fullPath] = current;
      }
      if (menu[children] && menu[children].length) {
        menuEach(menu.children, current);
      }
    });
  }
  menuEach(tree);
  return menuMap;
}

// eslint-disable-next-line no-unused-vars
// function list2tree (list, id = 'id', pid = 'pid', children = 'children') {
//   function exists (arr, parentId) {
//     return !!~arr.findIndex((item) => item[id] === parentId);
//   }
//   const nodes = [];
//   for (let i = 0; i < list.length; i += 1) {
//     const row = list[i];
//     if (!exists(list, row[pid])) {
//       nodes.push(row);
//     }
//   }
//   const toDo = [];
//   for (let i = 0; i < nodes.length; i += 1) {
//     toDo.push(nodes[i]);
//   }
//   while (toDo.length) {
//     const node = toDo.shift();
//     for (let i = 0; i < list.length; i += 1) {
//       const row = list[i];
//       if (row[pid] === node[id]) {
//         if (hasOwnProperty(node, children)) {
//           node[children].push(row);
//         } else {
//           node[children] = [row];
//         }
//         toDo.push(row);
//       }
//     }
//   }
//   return nodes;
// }

const treeEach = (fn, tree, parent = {}) => {
  tree.forEach((item, index) => {
    fn(item, index, parent, tree);
    if (item.children && item.children.length) {
      treeEach(fn, item.children, item);
    }
  });
};

// 监听菜单，动态注册
store.watch((state) => state.menus, (unfilterMenus) => {
  const filteredMenu = treeFilter(MENU_FILTER, unfilterMenus);
  treeEach((menu, index, parent = {}) => {
    if (!parent || !parent.id) {
      menu.root = true;
    }
    if (menu.children && menu.children.length) {
      menu.del = true;
    }
    if (/\/:[A-Za-z][A-Za-z0-9]*\?/.test(menu.url)) {
      menu.hide = true;
    }
    if (/\/?https?%3A%2F%2F/.test(menu.url)) {
      menu.link = true;
    }
    menu.fullPath = `${parent.fullPath || ''}${menu.url ? `/${menu.url}` : ''}`;
    if (!hasOwnProperty(menu, 'splitPath')) {
      const parentSplitPath = parent.splitPath ? parent.splitPath : [];
      menu.splitPath = [...parentSplitPath];
    }
    if (menu.url) {
      menu.splitPath.push(`${menu.fullPath}`);
    }
    // const clientMenuInServer = clientMenuList.find((clientMenu) => [menu.fullPath, `${menu.fullPath}/index`].includes(clientMenu.urlFullPath));
    const clientMenuInServer = clientMenuMap[menu.fullPath];
    if (clientMenuInServer && clientMenuInServer.hide) {
      menu.hide = clientMenuInServer.hide;
    }
  }, filteredMenu);
  treeEach((menu) => {
    if (menu.del && menu.children && menu.children.length) {
      const tag = !menu.children.every((item) => item.hide || item.url === '');
      menu.del = tag;
      menu.dir = tag;
    }
  }, filteredMenu);
  store.commit('setAppMenus', filteredMenu);
  const serverMenuList = tree2list(filteredMenu);
  store.commit('setAppMenuMap', tree2map(filteredMenu));
  const commonMenuList = serverMenuList.reduce((list, serverMenu) => {
    if (!serverMenu.del) {
      if (serverMenu.link) {
        const urls = serverMenu.url.split('/');
        const urlsLen = urls.length;
        const props = urlsLen > 1 ? { url: urls[urlsLen - 1], auth: urls[0] } : { url: urls[0] };
        list.push({
          // ...serverMenu,
          props,
          path: serverMenu.fullPath,
          component: iframeComp,
          meta: {
            title: serverMenu.name,
          },
        });
      } else {
        // const clientMenuInServer = clientMenuList.find((clientMenu) => [serverMenu.fullPath, `${serverMenu.fullPath}/index`].includes(clientMenu.urlFullPath));
        const clientMenuInServer = clientMenuMap[serverMenu.fullPath];
        if (clientMenuInServer) {
          list.push({
            // ...serverMenu,
            // ...clientMenuInServer,
            props: true,
            name: clientMenuInServer.componentName,
            path: serverMenu.fullPath,
            component: () => import(`~/${clientMenuInServer.componentPath}`),
            meta: {
              title: serverMenu.name,
            },
          });
        }
      }
    }
    return list;
  }, []);

  const allowRouter = commonMenuList;

  setTimeout(() => {
    router.addRoutes([{
      path: '/',
      component: layoutComp,
      children: [...allowRouter,
        {
          path: '',
          name: 'home',
          // component: HOME_COMP,
          ...(HOME_COMP ? { component: HOME_COMP } : {}),
          ...(!HOME_COMP && allowRouter[0] ? { redirect: allowRouter[0].path } : {}),
        },
        {
          path: '*',
          name: 'undefined',
          component: () => import('~/result/view/404.vue'),
        },
      ],
    }], 200);
  });
  store.commit('setRouters', allowRouter);
});

if (!CUSTOM) {
  if (store.state.allowLogin) {
    router.beforeEach((to, from, next) => {
      NProgress.start();
      const toLogin = to.matched.some((r) => r.path.toLowerCase() === '/login');
      const { isLogin } = store.state;
      if (isLogin && !toLogin) {
        next(true);
      }
      if (isLogin && toLogin) {
        next({
          path: '/',
        });
      }
      if (!toLogin && !isLogin) {
        if (DYNAMIC_TITLE) {
          document.title = i18n.t('action.login');
        }
        next({
          name: 'Login',
          query: {
            redirect: to.fullPath,
          },
        });
      }
      next(true);
    });
  } else {
    router.beforeEach((to, from, next) => {
      NProgress.start();
      if (to.params.pathMatch && to.params.pathMatch === to.fullPath && !to.name) {
        setTimeout(() => {
          next(to.fullPath);
        }, 200);
      }
      next();
    });
  }

  router.afterEach((to) => {
    if (DYNAMIC_TITLE !== false && !DYNAMIC_TITLE && to.meta && to.meta.title) {
      document.title = to.meta.title;
    } else if (typeof DYNAMIC_TITLE === 'string') {
      document.title = DYNAMIC_TITLE;
    } else if (typeof DYNAMIC_TITLE === 'function') {
      document.title = DYNAMIC_TITLE(to, i18n);
    }
    NProgress.done();
  });
}

export default router;
