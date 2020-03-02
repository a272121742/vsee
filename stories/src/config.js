export default {
  LANGUAGE_DEFAULT: 'zh-CN', // 语言默认值
  LANGUAGE_KEY: 'language', // 语言存储cookie的key
  LANGUAGE_RESET: false, // 语言是否每次启动都重置
  TOKEN_KEY: 'login_token', // 令牌存储cookie的key
  TOKEN_CUSTSET: false, // 令牌是否由开发者自行处理
  LOGIN_CACHE_KEY: 'cache_login_info', // 登录缓存信息的key
  OTHER_GET_PARAMS: {}, // get 请求附带的其他参数
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
  },
  EXCLUDE_MODULES: [], // 排除不加载的模块
  /**
   * 布局类型，可设置为`menu`、`nav`、`anchor`
   * menu - (默认)包括header（上）、sider（左）、content（右）
   * nav - 包括header（上）、content（下）
   * anchor - 同`menu`，但content是连续屏幕的
   */
  LAYOUT_TYPE: 'menu',
  /**
   * 自定义菜单，可设置为`undefined`、`false`、`sider`、`anchor`、`nav`、`cust`
   * undefined - 默认值继承`LAYOUT_TYPE`，除非手动设置为`false`
   * false - 不启用菜单
   * sider - 边栏菜单
   * anchor - 悬靠菜单
   * nav - 导航菜单
   * cust - 自定义菜单
   */
  MENU_TYPE: void 0,
  /**
   * 内容区域顶部模式，可设置为`falsely`、`breadcrumb`、`tab`
   * falsely - 默认值，包括[false, 0, undefined, null, '', NaN]
   * bread - 面包屑模式
   * tab - 页签模式
   * cust - 自定义模式
   */
  CONTENT_HEAD: void 0,
};
