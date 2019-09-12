
import api from '../api.js';

export default {
  state: {
  },
  getters: {
    
  },
  mutations: {
   
  },
  actions: {
    getPermissions ({commit}) {
      api.getPermissions().then(permissions => {
        commit('setPermissions', permissions, {root: true})
      });
    }
  }
};
