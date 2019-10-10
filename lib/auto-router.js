/**
 * 本模块提供所有路由的加载
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  autoRequires, homeComp, excludeModules, contentComp, layoutComp
} from '~/config.js';

/**
 * 以下为解决`vue-router`调用push时出现的`NavigationDuplicated`错误。
 * 因为3.0之后的版本push为promise返回，因为没有捕获错误而导致。
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function _ (location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

const { systemRouters, appRouters } = routeRequest(autoRequires, excludeModules, contentComp);

// 获取基础地址
const base = process.env.BASE_URL;


export const router = new VueRouter({
  mode: 'history',
  base,
  routes: systemRouters
});

/**
 * 路由的加载规则
 * 1. 默认只加载非应用功能，例如/login、/404、/403、/500等
 * 2. 用户登陆后，根据路由权限动态加载模块中的路由
 */
router.addRoutes([{
  path: '/',
  meta: {
    title: '首页'
  },
  component: layoutComp,
  // children: [{
  //   path: '',
  //   name: 'Home',
  //   component: homeComp
  // }, ...appRouters]
  children: [...appRouters]
}, {
  path: '*',
  redirect: '/404'
}]);


/**
 * 自动加载所有的路由
 * 1. 系统路由和应用路由分离
 * 2. 应用view目录下加载规则
 *    a: foo.vue 渲染成 /foo
 *    b: foo.bar.vue 渲染成动态路由 /foo/:bar
 *    c: 禁用嵌套路由（嵌套路由特别麻烦）
 */
function convertPath (path) {
  // './demo/view/foo.id.vue' => ['.', 'demo', 'view', 'foo.id', ''] => ['demo', 'view', 'foo.id']
  const splitPathArray = path.split(/\/|.vue$/).slice(1, -1);
  // ['demo', 'view', 'foo.id'] => ['foo.id'] => ['foo/:id'] => 'foo/:id' => 'foo/:id?'
  // @TODO: 和上面的`systemRouterConfigs`的方法相似，应该合并
  const routerPath = splitPathArray.slice(2).map(pathChunk => pathChunk.split('.').join('/:')).join('').split('/')
    .map(pathChunk => ~pathChunk.indexOf(':') ? (pathChunk + '?') : pathChunk)
    .join('/');
  const len = splitPathArray.length;
  const moduleName = splitPathArray[0];
  const componentName = splitPathArray[len - 1].split('.')[0];
  return {
    moduleName,
    routerPath,
    componentName,
    path: splitPathArray.join('/') + '.vue'
  };
}

function convert2KebabCase (str) {
  if (typeof str !== 'string') throw new TypeError('expected a string');
  return str.trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // .replace(/\W/g, m => /[A-z]/.test(m) ? m : '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, () => '-')
    .toLowerCase();
}

function routeRequest (autoRequires, excludeModules, contentComp) {
  const localRouters = (function viewExport () {
  /**
   * 阶段一： 加载本地的所有视图文件路径，分离系统路由和应用路由
   * 1. 匹配模块下的所有视图 `./module-name/router/{name}.vue`
   * 2. `module-name`规则为：必须以字母开头，包含字母或数字的单词
   * 3. 如果不按照此命名规则命名，则自动排除在外不加载6
   * 4. 想要不被加载，也可以通过`filterRouters`进行过滤
   */
    const req = autoRequires.router;

    /** 系统级文件路径 */
    const systemPaths = [
      './result/view/403.vue',
      './result/view/404.vue',
      './result/view/500.vue',
      './login/view/Login.vue'
    ];
    /** 应用级文件路径 */
    const appPath = req.keys().filter(path => !~excludeModules.indexOf(path.split('/')[1]));

    /**
   * 阶段二： 将文件路径转换成对象
   */
    /** 系统级路由对象 */
    const systemRouterConfigs = systemPaths.map(convertPath);
    /** 应用级路由对象 */
    const appRouterConfigs = appPath.map(convertPath);
    /**
   * 阶段三： 拼凑成路由数组
   * 预期数据：
   * {
   *   component: null // 自动继承
   *   meta: null      // @TODO: 后期思考怎么注入另外的配置
   *   name: 'test'    // 从模块文件夹名获取
   *   path: 'test'    // 同上
   *   children: [{    // 遍历test模块下view的children
   *     component: () => import('...')  // 取路径名称,
   *     name: ''     // 取文件名称
   *     path: ''      // 取文件名称
   *     meta: ''      // @TODO: 后期思考怎么注入
   *   }, {
   *    // ...
   *   }]
   * }
   */
    /** 系统级路由 */
    const systemRouters = [];
    /** 应用级路由 */
    const appRouters = [];
    /** 应用级别菜单 */
    const appMenus = [];
    // 已经加载过的模块
    const addedModuleMap = {};
    appRouterConfigs.forEach(obj => {
    // 如果没有添加过模块，则构建模块
      if (!Object.prototype.hasOwnProperty.call(addedModuleMap, obj.moduleName)) {
        addedModuleMap[obj.moduleName] = {
          name: obj.moduleName,
          path: convert2KebabCase(obj.moduleName),
          component: contentComp,
          meta: null,
          children: []
        };
        appRouters.push(addedModuleMap[obj.moduleName]);
        appMenus.push({
          name: obj.moduleName
        });
      }
      const router = addedModuleMap[obj.moduleName];
      // 动态添加路由
      router.children.push({
        name: obj.componentName,
        path: convert2KebabCase(obj.routerPath),
        meta: null,
        props: !!~obj.routerPath.indexOf('/:'),
        component: () => import(`~/${obj.path}`)
      });


      appMenus.push({
        name: obj.componentName
      });
    });
    systemRouterConfigs.forEach(obj => {
      if (obj.moduleName !== 'layout') {
        systemRouters.push({
          name: obj.componentName,
          path: '/' + convert2KebabCase(obj.componentName),
          meta: null,
          component: () => import(`~/${obj.path}`)
        });
      }
    });
    return {
      appRouters,
      systemRouters,
      appMenus
    };
  }());
  return localRouters;
}
