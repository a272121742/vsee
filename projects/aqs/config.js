export default {
  /**
   * 菜单过滤逻辑
   * 如果你希望服务端传过来的菜单要做一点业务上的处理，使用配置；
   * 过滤函数中的参数表示菜单项，采用的是树遍历机制。
   */
  MENU_FILTER: (item) => item.appCode === 'AQS' && !!item.url,
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
    user: ['/sys/user/info', { appCode: 'AQS' }],
    menus: ['/sys/menu/nav', { appCode: 'AQS' }],
    permissions: ['/sys/menu/permissions', { appCode: 'AQS' }],
  },
  EXCLUDE_MODULES: [], // 排除不加载的模块
  /**
   * 主页组件
   * 主页组件参与路由注册，但不参与菜单配置
   * 如果主页组件生效，则根路径会自动引导到主页；
   * 如果主页组件不生效，则按照权限配置获取第一个菜单；
   */
  // HOME_COMP: () => import('~/s1/router/index.vue'),
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
   * 菜单是否可搜索
   * truely - 可缩缩时，会启用默认收缩模式
   * falsely - 不可收缩时，会启用手动收缩模式，如果不设置手动收缩，即为不收缩
   * 该值直接影响`this.$store.state.config.menu_collapsible`
   */
  MENU_COLLAPSIBLE: true,
  /**
   * 菜单收缩状态
   * falsely - 非收缩状态，默认值；
   * truely - 收缩状态；
   * 该值直接影响`this.$store.state.config.menu_collapsed`
   */
  MENU_COLLAPSED: false,
  /**
   * 内容区域顶部模式，可设置为`falsely`、`breadcrumb`、`tab`
   * falsely - 默认值，包括[false, 0, undefined, null, '', NaN]
   * bread - 面包屑模式
   * tab - 页签模式
   * cust - 自定义模式
   */
  CONTENT_HEAD: 'bread',
  /**
   * 动态标题配置，可设置为`falsely`、`String`、`Function`
   * falsely - 自动标题模式，默认值，包括[false, 0, undefined, null, '', NaN]
   * String - 固定标题文字
   * Function - 动态标题函数，函数参数按顺序为：route、i18n
   */
  DYNAMIC_TITLE: (route, i18n) => {
    const titleList = [];
    if (i18n && i18n.te('project.title')) {
      titleList.push(i18n.t('project.title'));
    }
    if (route && route.meta && route.meta.title) {
      titleList.push(route.meta.title);
    }
    return titleList.join(' - ');
  },
  /**
   * 跳过登录
   * 跳过登录时，也不会进行`TOKEN`认证了
   */
  SKIP_LOGIN: false,
  /**
   * 请求超时时间，请求超时后将自动返回超时消息
   */
  HTTP_TIMEOUT: 60000,
  /**
   * `axios`额外附加头部信息
   * 封装的`axios`允许覆盖原有的头部信息，但仅限于除去`token`、`Authorization`、`Accept-Language`以外的信息。
   */
  HTTP_HEADER: {},
  /**
   * 关闭模拟模块的日志
   */
  AXIOS_CLOSE_MOCK_LOG: false,
  /**
   * 重连目录，可为`falsely`或`String[]`
   * falsely - 不启用重连；
   * String[] - 按照重连地址进行重新连接
   */
  // AXIOS_RETRY_LIST: ['https://easy-mock.com/mock/5b03c10305e00e7fd3cb3d68/example', 'http://rap2api.taobao.org/app/mock/116'],
  /**
   * 项目的根目录，登出时需要
   */
  ROOT_PATH: '/',
  /**
   * 代理，支持多重代理
   * $api - 核心代理，必须存在
   * $xxx - 可以根据需要建立其他的代理
   */
  PROXY: {
    $api: 'http://106.75.63.69:8091/mojo-gateway',
  },
};
