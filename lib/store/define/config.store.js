import config from '~/config.js';

export default {
  state: {
    config: {
      // @TODO: 准备废弃
      useTab: false,

      menu_type: config.MENU_TYPE,
      menu_collapsible: !!config.MENU_COLLAPSIBLE,
      menu_collapsed: !!config.MENU_COLLAPSED,
      content_head: config.CONTENT_HEAD,
      keey_alive: false,
    },
  },
  getters: {
    getConfig: (state) => () => state.config,
  },
  mutations: {
    setConfig (state, conf = {}) {
      state.config = conf;
    },
    useTab (state, flag = false) {
      state.config.useTab = flag;
    },
  },
};
