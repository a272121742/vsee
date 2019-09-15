
import api from '../api.js';

export default {
  actions: {
    login (store, loginInfo) {
      return api.login(loginInfo);
    },
    logout ({ dispatch }) {
      dispatch('logout', void 0, { root: true })
      return api.logout();
    }
  }
};
