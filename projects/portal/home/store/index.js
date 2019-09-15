
import api from '../api.js';

export default {
  state: {
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    getTodoPage (store, params = {}) {
      return api.getTodoPage(params);
    }
  }
};
