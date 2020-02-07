
import api from '../api.js';

export default {
  state: {
    a: 1,
    b: 2,
    filter: {
      c: 3,
      d: 4,
    },
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
    },
  },
};
