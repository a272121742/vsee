import { mergeDeepLeft } from 'ramda';
import config from '~/config.js';

const nothing = () => {};
const SCROLL = mergeDeepLeft(config.SCROLL || {}, {
  rail: {
    size: '15px',
    gutterOfSide: '0px',
  },
  bar: {
    size: '8px',
  },
});

const { THEME = {} } = config;
const {
  DARK = false,
  LAYOUT_TYPE = 'menu',
  MENU_TYPE = void 0,
  MENU_COLLAPSIBLE = true,
  MENU_COLLAPSED = false,
  CONTENT_HEAD = 'bread',
  KEEP_ALIVE = true,
} = THEME;

// function getThemeName (useDark) {
//   if (useDark === false) {
//     return 'light';
//   } if (useDark === true) {
//     return 'dark';
//   } if (typeof useDark === 'string') {
//     return useDark;
//   }
//   return 'light';
// }

export default {
  state: {
    config: {
      dark: !!DARK,
      layout_type: LAYOUT_TYPE,
      menu_type: MENU_TYPE,
      menu_collapsible: !!MENU_COLLAPSIBLE,
      menu_collapsed: !!MENU_COLLAPSED,
      content_head: CONTENT_HEAD,
      scroll_config: SCROLL,
      keep_alive: !!KEEP_ALIVE,
    },
  },
  getters: {
    getConfig: (state) => () => state.config,
  },
  mutations: {
    updateConfig (state, fn = nothing) {
      fn.call(void 0, state.config);
    },
    setConfig (state, conf = {}) {
      Object.assign(state.config, conf);
    },
  },
};
