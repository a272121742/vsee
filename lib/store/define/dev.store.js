const mocked = !process.env.proxy;

export default {
  state: {
    // isMock: false,
    isMock: mocked,
    isProd: process.env.NODE_ENV === 'production',
    isDev: process.env.NODE_ENV === 'development',
    // 调试模式下，可以使用开发者专属工具界面
    isDebug: false,
    isBuildTest: process.env.VUE_APP_BUILD_TYPE !== 'prod',
  },
  getters: {
    // 是否是模拟的数据（默认false）
    isMock: (state) => () => state.isMock,
    // 是否线上环境（不可更改）
    isProd: () => () => process.env.NODE_ENV === 'production',
    // 是否开发环境（不可更改）
    isDev: () => () => process.env.NODE_ENV === 'development',
    // 根据环境获取真实地址
    getUrl: (state) => (url = '') => (state.isProd ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI) + url,
    buldType: () => () => process.env.VUE_APP_BUILD_TYPE || 'dev',
  },
  mutations: {
    update (state, fn) {
      fn.call(void 0, state);
    },
    debug (state) {
      state.isDebug = !state.isDebug;
    },
    mock (state, flag = false) {
      state.isMock = flag;
    },
  },
};
