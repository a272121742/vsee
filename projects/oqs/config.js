export default {
  MENU_FILTER: (item) => item.appCode === 'OQS' && !!item.url,
  LANGUAGE_DEFAULT: 'zh-CN', // 语言默认值
  LANGUAGE_KEY: 'language', // 语言存储cookie的key
  LANGUAGE_RESET: false, // 语言是否每次启动都重置
  TOKEN_KEY: 'login_token', // 令牌存储cookie的key
  TOKEN_CUSTSET: false, // 令牌是否由开发者自行处理
  LOGIN_CACHE_KEY: 'cache_login_info', // 登录缓存信息的key
  OTHER_GET_PARAMS: {}, // get 请求附带的其他参数
  // 用于授权使用的接口
  AUTH_LOGIN_API: {
    URL: '/auth/login', // 接口地址
    PARAMS: { appCode: 'ADMIN' }, // 接口参数
  },
  AUTH_LOGOUT_API: {
    URL: '/auth/logout', // 接口地址
    PARAMS: {}, // 接口参数
  },
  // 其他顶层API集合
  GLOBAL_API_LIST: {
    user: ['/sys/user/info', { appCode: 'OQS' }],
    menus: ['/sys/menu/list', { appCode: 'ADMIN', type: 0 }],
    permissions: ['/sys/menu/permissions', { appCode: 'OQS' }],
  },
  EXCLUDE_MODULES: [], // 排除不加载的模块
  THEME: {
    LAYOUT_TYPE: 'menu',
    MENU_TYPE: void 0,
    MENU_COLLAPSIBLE: true,
    MENU_COLLAPSED: false,
    CONTENT_HEAD: 'bread',
    KEEP_ALIVE: true,
  },
  PORTAL_APTH: '/',
  DEV_PROXY: 'http://tqis-dev.autodev.aas/mojo-gateway',
  // DYNAMIC_TITLE: () => {
  //   const titleList = [];
  //   titleList.push('BJEV');
  //   return titleList.join(' - ');
  // },
  ROUTER_DEEP: true,
  SCROLL: {
    bar: {
      keepShow: true,
    },
  },
  DYNAMIC_TITLE: 'BJEV-TQIS',
  VALIDATION: {
    vin: /^[A-Z0-9]{8,17}$/,
    milageVer: /^\+?[1-9][0-9]*$/,
  },
  ICON: {
    prefix: 'icon-',
    url: ['/static/icon/iconfont.js'],
  },
};
