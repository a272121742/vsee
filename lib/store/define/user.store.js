export default {
  state: {
    userInfo: {}
  },
  getters: {
    getUser: state => () => state.userInfo
  },
  mutations: {
    setUser (state, userInfo = {}) {
      state.userInfo = userInfo;
    }
  }
};