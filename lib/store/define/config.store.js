import { mergeDeepLeft } from 'ramda';
import { THEME, SCROLL } from '@lib/config.js';

const nothing = () => {};
const scroll = mergeDeepLeft(SCROLL || {}, {
  rail: {
    size: '15px',
    gutterOfSide: '0px',
  },
  bar: {
    size: '8px',
  },
});

const {
  DARK,
  LAYOUT_TYPE,
  MENU_TYPE,
  MENU_COLLAPSIBLE,
  MENU_COLLAPSED,
  MENU_CURRENT,
  CONTENT_HEAD,
  KEEP_ALIVE,
  BACK_TOP,
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
      menu_current: !!MENU_CURRENT,
      content_head: CONTENT_HEAD,
      scroll_config: scroll,
      keep_alive: !!KEEP_ALIVE,
      back_top: !!BACK_TOP,
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
