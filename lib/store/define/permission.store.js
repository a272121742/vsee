export default {
  state: {
    permissions: [],
  },
  getters: {
    getPermissions: (state) => () => state.permissions,
    hasPermission: (state) => (_) => !!~state.permissions.indexOf(_),
  },
  mutations: {
    setPermissions (state, permissions = []) {
      state.permissions = permissions;
    },
  },
};
