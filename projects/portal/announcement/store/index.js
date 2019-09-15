
import api from '../api.js';

export default {
  state: {
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    getAnnouncementPage (store, params = {}) {
      return api.getAnnouncementPage(params);
    },
    getAnnouncement (store, id) {
      return api.getAnnouncement(id);
    }
  }
};
