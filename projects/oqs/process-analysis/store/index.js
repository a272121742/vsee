import api from '../api.js';

export default {
  state: {

    // 柱状图
    drParams: {},
    drParamsFTQ: {},
    ftqParams: {},
    drlParams: {},
    auditParams: {},
    pdiDdrParams: {},
    pdiFdrParams: {},
    paretoParams: {},
    rightDefectData: {},


    // 折线图
    lineParams: {},
    ftqLineParams: {},
  },
  actions: {
    /**
     * 表格渲染
     */
    getTablePage (store, payload) {
      return api.getTablePage(payload);
    },
    // echarts
    getEcharts (store, payload) {
      return api.getEcharts(payload);
    },
    // 源质量门
    getSrcGateList (store, payload) {
      return api.getSrcGateList(payload);
    },
  },
};
