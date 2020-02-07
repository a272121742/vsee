
import api from '../api.js';
import announcementApi from '~/announcement/api.js';

export default {
  state: {
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    getAnnouncementPage (store, params) {
      return announcementApi.getAnnouncementPage(params);
    },
    getTodoPage (store, params = {}) {
      return api.getTodoPage(params);
    },
  },
};
