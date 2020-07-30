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
    getVFaultTableList (store, payload) {
      return api.getVFaultTableList(payload);
    },
    // 导出
    getExportData (store, payload) {
      return api.getExportData(payload);
    },

    // echarts
    getEcharts (store, payload) {
      return api.getEcharts(payload);
    },

    // 车辆电池实时状态
    // 列表
    getBatteryStatusTableList (store, payload) {
      return api.getBatteryStatusTableList(payload);
    },
    // 新增 确定
    postStatusNew (store, payload) {
      return api.postStatusNew(payload);
    },

    // 车辆电池状态历史
    getBatteryRecordTableList (store, payload) {
      return api.getBatteryRecordTableList(payload);
    },

    // 导出

    // 车辆快慢充数据
    // 列表
    getChargingTableList (store, payload) {
      return api.getChargingTableList(payload);
    },

    // 车辆故障记录
    getFaultTableList (store, payload) {
      return api.getFaultTableList(payload);
    },
  },
};
