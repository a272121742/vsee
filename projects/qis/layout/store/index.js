
import api from '../api.js';

export default {
  state: {
  },
  getters: {
    
  },
  mutations: {
   
  },
  actions: {
    getUserInfo ({commit}) {
      api.getUserInfo().then(user => {
        commit('setUser', user, {root: true});
      });
    },
    getPermission ({commit}) {
      api.getPermission().then(permissions => {
        commit('setPermission', permissions, {root: true});
      });
    }
  }
};
