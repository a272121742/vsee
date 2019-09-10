
import api from '../api.js';

export default {
  state: {
  },
  getters: {
    
  },
  mutations: {
   
  },
  actions: {
    getPermission ({commit}) {
      api.getPermission().then(permissions => {
        commit('setPermission', permissions, {root: true})
      });
    }
  }
};
