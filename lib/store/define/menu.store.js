export default {
  state: {
    menus: []
  },
  getters: {
    getMenus: state => () => state.menus,
    hasMenu: state => _ => !!~state.menus.indexOf(_)
  },
  mutations: {
    setMenus (state, menus = []) {
      state.menus = menus;
    }
  }
};