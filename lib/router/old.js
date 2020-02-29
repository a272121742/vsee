/**
 * @TODO: 过时，准备删除
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import { clone } from 'ramda';
import store from '@store';
import { excludeModules, layoutComp, contentComp } from '~/config.js';

Vue.use(VueRouter);
const base = process.env.BASE_URL;

// const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_]*)+\/router\/[A-z0-9- ./]+\.vue$/);
const req = require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_]*)+\/router\/[~A-z0-9- ./]+\.vue$/);
const clientFiles = req.keys().filter((path) => !~excludeModules.indexOf(path.split('/')[1]));

function convertPath (path) {
  // './demo/view/foo.id.vue' => ['.', 'demo', 'view', 'foo.id', ''] => ['demo', 'view', 'foo.id']
  const splitPathArray = path.split(/\/|.vue$/).slice(1, -1);
  // ['demo', 'view', 'foo.id'] => ['foo.id'] => ['foo/:id'] => 'foo/:id' => 'foo/:id?'
  // @TODO: 和上面的`systemRouterConfigs`的方法相似，应该合并
  const routerPath = splitPathArray.slice(2).map((pathChunk) => pathChunk.split('.').join('/:')).join('/').split('/')
    .map((pathChunk) => (~pathChunk.indexOf(':') ? (`${pathChunk}?`) : pathChunk))
    .join('/');
  const len = splitPathArray.length;
  const moduleName = splitPathArray[0];
  const componentName = splitPathArray[len - 1].split('.')[0];
  // 端横杆路径
  const p1 = convert2KebabCase(routerPath) || '';
  // 判断是index
  const p2 = ~p1.indexOf('index') ? '' : p1;
  const flagIndex = p2.indexOf('~');
  const isHidde = !!~flagIndex;
  const result = {
    componentFullPath: path,
    componentPath: `${splitPathArray.join('/')}.vue`,
    path: isHidde ? p2.split('~').join('') : p2,
    hide: isHidde,
    moduleName,
  };
  result.fullPath = `/${moduleName}${result.path ? `/${result.path}` : ''}`;
  if (componentName !== 'Index') {
    result.componentName = componentName;
  }
  result.props = !!~routerPath.indexOf('/:');
  result.paramsPath = p1.replace('index', result.fullPath);
  return result;
}
const componentMap = clientFiles.map((item) => {
  const obj = convertPath(item);
  return obj;
});

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
      path: `/${convert2KebabCase(obj.componentName)}`,
      meta: null,
      component: () => import(`~/${obj.componentPath}`),
    });
  }
});

const router = new VueRouter({
  mode: 'history',
  base,
  routes: systemRouters,
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

function convert2KebabCase (str) {
  if (typeof str !== 'string') throw new TypeError('expected a string');
  return str.trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // .replace(/\W/g, m => /[A-z]/.test(m) ? m : '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, () => '-')
    .toLowerCase();
}
store.watch((state) => state.serverMenus, (serverMenus) => {
  const clientRouter = clone(serverMenus);
  treeEach((item, index, parent, tree) => {
    if (item.hide !== true) {
      delete item.createDate;
      delete item.permissions;
      delete item.pid;
      delete item.resourceList;
      delete item.type;
      if (!/^\//.test(item.url)) {
        item.url = `/${item.url}`;
      }
      item.fullPath = [parent.url || '', item.url === '/' ? '' : item.url].join('');
      item.meta = {
        title: item.name,
        link: false,
      };
      const clientConfig = componentMap.find((p) => ~p.fullPath.indexOf(item.fullPath));
      if (clientConfig) {
        Object.assign(item, clientConfig);
        item.component = () => import(`~/${item.componentPath}`);
        item.parentName = parent.name || '';
        item.path = item.parentName ? (/^\//.test(item.url) ? item.url.slice(1) : item.url) : item.url;
      } else if (parent.props) {
        const iframe = componentMap.find((p) => item.fullPath.indexOf(p.fullPath) === 0);
        item.component = parent.component;
        item.props = true;
        item.path = item.fullPath.replace(`${parent.url}/`, '');
        parent.path = iframe.paramsPath;
      } else {
        tree.splice(index, 1);
      }
    }
  }, clientRouter);
  treeEach((item) => {
    if (item.children && item.children.every((cld) => cld.hide === true)) {
      const useLink = item.children.every((cld) => cld.hide === true);
      item.children.push({
        path: '',
        hide: true,
        name: item.name,
        icon: item.icon,
        sort: item.sort,
        meta: {
          link: useLink,
          title: item.name,
        },
        component: () => import(`~/${item.componentPath}`),
      });
    }
    if (item.children) {
      item.component = contentComp;
    }
  }, clientRouter);
  store.commit('setRouters', clientRouter);
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
