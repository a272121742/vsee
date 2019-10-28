export default {
  state: {
    configInfo: {}
  },
  getters: {
    getConfig: state => () => state.configInfo
  },
  mutations: {
    setConfig (state, configInfo = {}) {
      state.configInfo = configInfo;
    }
  }
};