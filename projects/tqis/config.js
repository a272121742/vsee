export default {
  MENU_FILTER: (item) => !!item.url,
  AUTH_LOGIN_API: {
    URL: '/auth/login', // 接口地址
    PARAMS: { appCode: 'ADMIN' }, // 接口参数
  },
  AUTH_LOGOUT_API: {
    URL: '/auth/logout', // 接口地址
    PARAMS: {}, // 接口参数
  },
  GLOBAL_API_LIST: {
    userInfo: ['/sys/user/info', { appCode: 'ADMIN' }, {}],
    menus: ['/sys/menu/nav1', { }, []],
    permissions: ['/sys/menu/permissions', { appCode: 'ADMIN' }, []],
  },
  DEV_PROXY: 'http://tqis-dev.autodev.aas/mojo-gateway/',
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
  THEME: {
    DARK: false,
    LAYOUT_TYPE: 'menu',
    MENU_TYPE: void 0,
    MENU_COLLAPSIBLE: true,
    MENU_COLLAPSED: false,
    CONTENT_HEAD: 'bread',
    KEEP_ALIVE: true,
  },
  // 水印配置
  WATER_MARK: {
    enable: true,
    width: 240,
    height: 135,
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.24)',
    rotate: -15,
    zIndex: 5,
    content: '请勿外传',
  },
  LOCATION_MENU: [{
    id: 10000,
    name: '表单案例',
    url: 'form',
  }, {
    id: 20000,
    name: '表格案例',
    url: 'table',
  }, {
    id: 30000,
    name: '高级组件',
    url: 'adcomp',
    children: [{
      id: 30001,
      name: 'Echart',
      url: 'echart',
    }, {
      id: 30002,
      name: 'WaterMark',
      url: 'water-mark',
    }],
  }],
};
