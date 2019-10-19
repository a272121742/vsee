import api from '../api.js';
export default {
  actions: {
    getOrderList () {
      return api.getOrderList();
    },
    getOrder (store, id) {
      return api.getOrder(id);
    },
    orderAdd (store, data) {
      return api.orderAdd(data);
    },
    orderDel (store, id) {
      return api.orderDel(id);
    },
    orderEdit (store, data) {
      return api.orderEdit(data);
    }
  }
};
