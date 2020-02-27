export default {
  state: {
    config: {
      useTab: false,
    },
  },
  getters: {
    getConfig: (state) => () => state.config,
  },
  mutations: {
    setConfig (state, config = {}) {
      state.config = config;
    },
    useTab (state, flag = false) {
      state.config.useTab = flag;
    },
  },
};
