export default {
  state: {
    appMenus: [],
    appMenuMap: {},
    routers: [],
  },
  getters: {
    // getMenus: (state) => () => state.menus,
    // hasMenu: (state) => (_) => !!~state.menus.indexOf(_),
  },
  mutations: {
    setAppMenus (state, appMenus = []) {
      state.appMenus = appMenus;
    },
    setAppMenuMap (state, appMenuMap = {}) {
      state.appMenuMap = appMenuMap;
    },
    setRouters (state, routers) {
      state.routers = routers;
    },
  },
};
