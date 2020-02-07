import api from '../api.js';

export default {
  state: {

  },
  actions: {
    creatorCount (store, payload) {
      return api.creatorCount(payload);
    },
    championCount (store, payload) {
      return api.championCount(payload);
    },
    getIssueOverDaysList (store, payload) {
      return api.getIssueOverDaysList(payload);
    },
  },
};
