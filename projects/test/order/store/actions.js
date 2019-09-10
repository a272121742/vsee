import api from '../api.js';

export default {
  getOrderList (store, args) {
    return api.getOrderList(args);
  }
};
