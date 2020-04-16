export default {
  /**
   * 菜单过滤逻辑
   * 如果你希望服务端传过来的菜单要做一点业务上的处理，使用配置；
   * 过滤函数中的参数表示菜单项，采用的是树遍历机制。
   */
  MENU_FILTER: (item) => item.appCode === 'AQS' && !!item.url,
  /**
   * 语言环境默认值
   * 语言设置会进行校验的，如果不满足设定要求，或者未设置，则按照`zh-CN`来定义。
   */
  LANGUAGE_DEFAULT: 'zh-CN',
  /**
   * 语言存储在cookie的键名
   * 默认值`language`，当然为了应用安全性也可以自行进行加密
   */
  LANGUAGE_KEY: 'language',
  /**
   * 语言环境重置开关
   * 如果设置为`true`，则应用打开时，每次都会设置语言为`LANGUAGE_DEFAULT`
   * 否则，会通过cookie已经存在的值进行语言环境的设置
   */
  LANGUAGE_RESET: false,
  /**
   * 登录令牌储存在cookie的键名
   * 默认值`login_token`，当然为了应用安全性也可以自行进行加密
   */
  TOKEN_KEY: 'login_token',
  /**
   * 登录令牌自动下发开关
   * 默认值`false`，登录成功后，会自动拦截服务端令牌并进行全局应用的设置；
   * 设置为`true`后，登录请求会将服务端数据返回给开发者自行处理令牌信息。
   */
  TOKEN_CUSTSET: false,
  /**
   * 用户登录缓存储存在cookie的键名
   * 默认值`cache_login_info`，当然为了应用安全性也可以自行进行加密；
   * 用户登录信息在存储时，已经做了加密处理。
   */
  LOGIN_CACHE_KEY: 'cache_login_info',
  /**
   * GET请求附带参数
   * 可追加额外的附带参数，例如`_t: Date.now()`，亦或者是你需要的
   */
  OTHER_GET_PARAMS: {},
  /**
   * 用于登录授权使用的接口
   */
  AUTH_LOGIN_API: {
    URL: '/auth/login', // 接口地址
    PARAMS: { appCode: 'ADMIN' }, // 接口参数
  },
  /**
   * 用于登出授权使用的接口
   */
  AUTH_LOGOUT_API: {
    URL: '/auth/logout', // 接口地址
    PARAMS: {}, // 接口参数
  },
  /**
   * 顶层API集合，顶层API会加载到顶层`store`中心。
   * 参数类型：
   *  0 - 接口地址
   *  1 - 接口参数
   *  2 - 返回默认值
   */
  GLOBAL_API_LIST: {
    user: ['/sys/user/info', { appCode: 'AQS' }, {}],
    menus: ['/sys/menu/nav', { appCode: 'AQS' }, []],
    permissions: ['/sys/menu/permissions', { appCode: 'AQS' }, []],
  },
  /**
   * 排除不加载的模块
   * 如果有些模块你不希望应用加载到，可以使用此参数。
   */
  EXCLUDE_MODULES: [],
  /**
   * 主页组件
   * 主页组件参与路由注册，但不参与菜单配置
   * 如果主页组件生效，则根路径会自动引导到主页；
   * 如果主页组件不生效，则按照权限配置获取第一个菜单；
   * 设置为`falsely`时不启用主页引导。
   */
  // HOME_COMP: () => import('~/order/router/index.vue'),
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
   * 内容区域顶部模式，可设置为`falsely`、`bread`、`tab`
   * falsely - 默认值，包括[false, 0, undefined, null, '', NaN]
   * bread - 面包屑模式
   * tab - 页签模式
   * cust - 自定义模式
   */
  CONTENT_HEAD: 'tab',
  /**
   * 路由模式，默认history
   */
  ROUTER_MODE: 'history',
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
   * @TODO:
   * 重连目录，可为`falsely`或`String[]`
   * falsely - 不启用重连；
   * String[] - 按照重连地址进行重新连接
   */
  // AXIOS_RETRY_LIST: ['https://easy-mock.com/mock/5b03c10305e00e7fd3cb3d68/example', 'http://rap2api.taobao.org/app/mock/116'],
  /**
   * 项目的根目录，即门户的地址，登出时需要
   */
  PORTAL_APTH: '/',
  /**
   * 代理，支持多重代理
   * $api - 核心代理，必须存在
   * $xxx - 可以根据需要建立其他的代理
   */
  DEV_PROXY: 'http://tqis-dev.autodev.aas/mojo-gateway/',
  /**
   * 日期格式化
   */
  DATE_FORMAT: 'YYYY-MM-DD',
  /**
   * 时间格式化
   */
  TEIME_FORMAT: 'HH:mm:ss',
  /**
   * 时间日期格式化
   * 如果不给定，将会自动处理为`${DATE_FORMAT} ${TEIME_FORMAT}`的格式
   */
  DATETIME_FORMAT: void 0,
  /**
   * 空时间展示
   * 如果时间为空，或者转换失败，或者转换后不是合法时间，则显示此项，默认值为空字符串`''`
   */
  EMPTY_DATETIME: '-',
  /**
   * 分页组件配置
   */
  PAGESIZE_OPTIONS: ['10', '20', '50'],
  /**
   * 服务端分页对象
   * 如果为函数，则通过函数进行构建，函数参数为`current`、`pageSize`，该场景可是适配更多的服务端或数据库；
   * 如果不设置，则采用默认方式
   */
  SERVER_PAGINATION: void 0,
  /**
   * 路由是否深度递归，如果为`true`，则进行深度递归以获取首页，否则只做第一级的菜单获取
   */
  ROUTER_DEEP: true,
  SCROLL: {
    bar: {
      keepShow: true,
    },
  },
  // VALIDATION: {
  //   // idcard: /^\S$/,
  //   // phone: /^\S$/,
  //   // mobile: /^\S$/,
  //   // username: /^\S$/,
  //   // password: /^\S$/,
  // },
  /**
   * `content`区域是否缓存，默认`false`，设置为`true`则缓存
   */
  CONTENT_KEEP_ALIVE: true,
};
