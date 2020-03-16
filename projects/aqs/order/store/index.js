import api from '../api.js';

export default {
  state: {
    claimOrderFormSearch: {},
  },
  actions: {
    getClaimOrderaPage (store, payload) {
      return api.getClaimOrderaPage(payload);
    },
    getClaimOrderaAllPage (store, payload) {
      return api.getClaimOrderaAllPage(payload);
    },
    getOrderExportData (store, payload) {
      return api.getOrderExportData(payload);
    },
    getPartCodeData (store, payload) {
      return api.getPartCodeData(payload);
    },
    getPartNameData (store, payload) {
      return api.getPartNameData(payload);
    },
    getSupplierCodeData (store, payload) {
      return api.getSupplierCodeData(payload);
    },
    getSupplierNameData (store, payload) {
      return api.getSupplierNameData(payload);
    },
  },
};
