export default {
  state: {
    systemInfo: {},
  },
  getters: {
    getSystemInfo: (state) => () => state.systemInfo,
  },
  mutations: {
    setSystem (state, systemInfo = {}) {
      state.systemInfo = systemInfo;
    },
  },
};
