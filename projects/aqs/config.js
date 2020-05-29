export default {
  MENU_FILTER: (item) => item.appCode === 'AQS' && !!item.url,
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
    user: ['/sys/user/info', { appCode: 'AQS' }, {}],
    menus: ['/sys/menu/nav', { appCode: 'AQS' }, []],
    permissions: ['/sys/menu/permissions', { appCode: 'AQS' }, []],
  },
  MENU_COLLAPSIBLE: true,
  CONTENT_HEAD: 'tab',
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
  DATETIME: {
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm:ss',
    DATETIME_FORMAT: (DATE_FORMAT, TIME_FORMAT) => `${DATE_FORMAT} ${TIME_FORMAT}`,
    EMPTY_DATETIME_FORMAT: '-',
    EMPTY_DATETIME_VALUE: null,
    START_FIELDNAME: (fieldname) => `${fieldname}Start`,
    END_FIELDNAME: (fieldname) => `${fieldname}End`,
  },
};
