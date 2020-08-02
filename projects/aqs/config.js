export default {
  MENU_FILTER: (item) => item.appCode === 'FT' && !!item.url,
  LANGUAGE_DEFAULT: 'zh-CN',
  LANGUAGE_KEY: 'language',
  TOKEN_KEY: 'login_token',
  LOGIN_CACHE_KEY: 'cache_login_info',
  AUTH_LOGIN_API: {
    URL: '/auth/login', // 接口地址
    PARAMS: { appCode: 'ADMIN' }, // 接口参数
  },
  AUTH_LOGOUT_API: {
    URL: '/auth/logout', // 接口地址
    PARAMS: {}, // 接口参数
  },
  GLOBAL_API_LIST: {
    user: ['/sys/user/info', { appCode: 'ADMIN' }, {}],
    menus: ['/sys/menu/nav', { appCode: 'ADMIN' }, []],
    permissions: ['/sys/menu/permissions', { appCode: 'TF' }, []],
  },
  THEME: {
    MENU_COLLAPSIBLE: true,
    CONTENT_HEAD: 'tab',
    // 0 - inner
    // 1 - outer
    // 2 - repeat
    TAB_TYPE: 2,
  },
  HTTP_TIMEOUT: 60000,
  PORTAL_APTH: '/',
  DEV_PROXY: 'http://tqis-dev.autodev.aas/mojo-gateway/',
  DATE_FORMAT: 'YYYY-MM-DD',
  TEIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: void 0,
  EMPTY_DATETIME: '-',
  PAGESIZE_OPTIONS: ['10', '20', '50'],
  SERVER_PAGINATION: void 0,
  SCROLL: {
    bar: {
      keepShow: true,
    },
  },
  DYNAMIC_TITLE: 'BJEV-TQIS',
  WATER_MARK: {
    enable: true,
  },
  ICON: {
    prefix: 'icon-',
    url: ['/static/icon/iconfont.js'],
  },
  ROUTER: {
    HOME_COMP: () => import('~~/home.vue'),
    MODE: 'history',
    CUSTOM: false,
    INJECT: {
      '/aaa': function (store, i18n, router, info) {
        console.log('hello word', store, i18n, router, info);
      },
    },
  },
};
