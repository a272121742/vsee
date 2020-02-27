export const TOKEN_KEY = 'login_token';
export const TOKEN_AUTOSET = true;
export const LANGUAGE_KEY = 'language';
export const LANGUAGE_DEFAULT = 'zh-CN';
export const LOGIN_CACHE_KEY = 'cache_login_info';
export const OTHER_GET_PARAMS = {};

// 授权API
export const AUTH_API = {
  login: ['/auth/login', { appCode: 'ADMIN' }],
  logout: ['/auth/logout', {}],
};
export const GLOBAL_API = {
  user: ['/sys/user/info', { appCode: 'AQS' }],
  menus: ['/sys/menu/nav', { appCode: 'AQS' }],
  permissions: ['/sys/menu/permissions', { appCode: 'AQS' }],
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
export const homeComp = void 0;
/**
 * iframe组件
 */
export const iframeComp = () => import('~/layout/view/iframe.vue');

export default {
  MENU_FILTER: (item) => item.appCode === 'AQS' && !!item.url,
  // TODO: 准备要加的配置
  LANGUAGE_DEFAULT: 'zh-CN', // 语言默认值
  LANGUAGE_KEY: 'language', // 语言存储cookie的key
  LANGUAGE_RESET: false, // 语言是否每次启动都重置
  TOKEN_KEY: 'login_token', // 令牌存储cookie的key
  TOKEN_CUSTSET: false, // 令牌是否由开发者自行处理
  LOGIN_CACHE_KEY: 'cache_login_info', // 登录缓存信息的key
  OTHER_GET_PARAMS: {}, // get 请求附带的其他参数
  // 用于授权使用的接口
  AUTH_LOGIN_API: {
    URL: '/auth/login',
    PARAMS: {},
  },
  AUTH_LOGOUT_API: {
    URL: '/auth/logout',
    PARAMS: {},
  },
  // 其他顶层API集合
  GLOBAL_API_LIST: {},
  EXCLUDE_MODULES: [], // 排除不加载的模块

  CONTENT: void 0, // 内容组件
  LAYOUT: void 0, // 布局组件
  HOME: void 0, // 首页组件
  IFRAME: void 0, // IFRAME组件
  // 全局配置文件地址
  GLOBAL_CONFIG: '/static/config.js',
};
