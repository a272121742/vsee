import api from '../api.js';

export default {
  state: {
    vehicleSearchList: {},
  },
  actions: {
    getVehiclePage (store, payload) {
      return api.getVehiclePage(payload);
    },
    getVehicleExportData (store, payload) {
      return api.getVehicleExportData(payload);
    },
    // 全量
    getVehicleAllPage (store, payload) {
      return api.getVehicleAllPage(payload);
    },
  },
};
