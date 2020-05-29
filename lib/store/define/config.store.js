import { mergeDeepLeft } from 'ramda';
import config from '~/config.js';

const SCROLL = mergeDeepLeft(config.SCROLL, {
  rail: {
    size: '15px',
    gutterOfSide: '0px',
  },
  bar: {
    size: '8px',
  },
});

export default {
  state: {
    config: {
      menu_type: config.MENU_TYPE,
      menu_collapsible: !!config.MENU_COLLAPSIBLE,
      menu_collapsed: !!config.MENU_COLLAPSED,
      content_head: config.CONTENT_HEAD,
      scroll_config: SCROLL,
      keep_alive: !!config.CONTENT_KEEP_ALIVE,
    },
  },
  getters: {
    getConfig: (state) => () => state.config,
  },
  mutations: {
    setConfig (state, conf = {}) {
      Object.assign(state.config, conf);
    },
  },
};
