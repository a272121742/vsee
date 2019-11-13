export default {
  state: {
    menus: [],
    isMenuLoaded: false
  },
  getters: {
    getMenus: state => () => state.menus,
    hasMenu: state => _ => !!~state.menus.indexOf(_),
    isMenuLoaded: state => () => state.isMenuLoaded
  },
  mutations: {
    setMenus (state, menus = []) {
      state.menus = menus;
      state.isMenuLoaded = true;
    }
  }
};