import api from '../api.js';

export default {
  state: {
    torqueParams: {},
  },
  actions: {
    // 列表
    getTableList (store, payload) {
      return api.getTableList(payload);
    },
    // 导出
    getExportData (store, payload) {
      return api.getExportData(payload);
    },

    // echarts
    getEcharts (store, payload) {
      return api.getEcharts(payload);
    },

  },
};
