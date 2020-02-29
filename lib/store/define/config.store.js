import config from '~/config.js';

export default {
  state: {
    config: {
      useTab: false,

      menu_type: config.MENU_TYPE,
      content_head: config.CONTENT_HEAD,
      keey_alive: false,
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
