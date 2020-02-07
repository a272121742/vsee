export default {
  state: {
    menus: [],
    serverMenus: [],
    routers: [],
    isMenuLoaded: false,
  },
  getters: {
    getMenus: (state) => () => state.menus,
    hasMenu: (state) => (_) => !!~state.menus.indexOf(_),
    isMenuLoaded: (state) => () => state.isMenuLoaded,
  },
  mutations: {
    setMenus (state, menus = []) {
      state.menus = menus;
      state.isMenuLoaded = true;
    },
    setServerMenus (state, serverMenus = []) {
      state.serverMenus = serverMenus;
    },
    setRouters (state, routers) {
      state.routers = routers;
    },
  },
};
