export const TOKEN_KEY = 'login_token';
export const LANGUAGE_KEY = 'language';
export const LANGUAGE_DEFAULT = 'zh_CN';
export const LOGIN_CACHE_KEY = 'cache_login_info';
export const OTHER_GET_PARAMS = {};
export const TOKEN_AUTOSET = true;

// 授权API
export const AUTH_API = {
  login: ['/auth/login', { appCode: 'ADMIN' }],
  logout: ['/auth/logout', {}],
};
export const GLOBAL_API = {
  user: ['/sys/user/info', { appCode: 'ISSUE' }],
  menus: ['/sys/menu/nav', { appCode: 'ISSUE' }],
  permissions: ['/sys/menu/permissions', { appCode: 'ISSUE' }],
};

/**
 * 排除不运行的模块
 */
export const excludeModules = [

];

/**
 * 内容组件
 */
export const contentComp = () => import('~/layout/view/AbstractContent.vue');

/**
 * 布局组件
 */
export const layoutComp = () => import('~/layout/view/DefaultLayout.vue');
/**
 * 主页组件
 */
export const homeComp = () => import('~/home/router/Home.vue');

/**
 * 自动引入的模块
 */
export const autoRequires = {
  // 路由模块
  router: require.context('~', true, /^\.(\/[A-Za-z][A-Za-z0-9_]*)+\/router\/[A-z0-9- ./]+\.vue$/),
  // 数据缓存模块
  store: require.context('~', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\/store\/index\.js$/),
  // 国际化模块
  i18n: require.context('~', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\/locales\/[A-Za-z]+\.json$/),
  // directives: require.context('@dir', true, /^\.\/v-[A-Za-z-]*\.js$/)
};
