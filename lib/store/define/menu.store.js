export default {
  state: {
    serverMenus: [],
    routers: [],
  },
  getters: {
    getMenus: (state) => () => state.menus,
    hasMenu: (state) => (_) => !!~state.menus.indexOf(_),
  },
  mutations: {
    setServerMenus (state, serverMenus = []) {
      state.serverMenus = serverMenus;
    },
    setRouters (state, routers) {
      state.routers = routers;
    },
  },
};
