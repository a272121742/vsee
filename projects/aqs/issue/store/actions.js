import api from '../api.js';

export default {
  // 查询已创建的问题报告
  getProblemReport (store, param) {
    return api.getProblemReport(param);
  },
  // 删除报告
  deleteProblemReport (store, param) {
    return api.deleteProblemReport(param);
  },
  // 创建报告-车辆信息表格
  getVehicleSearchDialogPage (store, param) {
    return api.getVehicleSearchDialogPage(param);
  },
  // 保存，更新报告
  // 非全选
  saveVehicleReport (store, param) {
    return api.saveVehicleReport(param);
  },
  // 全量 +创建
  saveAllVehicleReport (store, param) {
    return api.saveAllVehicleReport(param);
  },
  // 全量 +编辑
  saveAllEdit (store, param) {
    return api.saveAllEdit(param);
  },
  // 手工 /工单 + 全量 + 编辑
  getEditAllOrderList (store, param) {
    return api.getEditAllOrderList(param);
  },

  // 保存并IRS立项
  saveAndIrsR (store, param) {
    return api.saveAndIrsR(param);
  },
  // reportCentre
  getAsqissuedefn (store, id) {
    return api.getAsqissuedefn(id);
  },


  getSingleDownloadData (store, payload) {
    return api.getSingleDownloadData(payload);
  },
  getBatchDownloadData (store, payload) {
    return api.getBatchDownloadData(payload);
  },

  // 编辑报告详情
  getDetailProblemReport (store, param) {
    return api.getDetailProblemReport(param);
  },
  /**
   * 工单
   */
  // 工单非全选 + 创建
  getReporterData (store, payload) {
    return api.getReporterData(payload);
  },
  // 分页：工单 全量 +创建
  getAllReporterData (store, payload) {
    return api.getAllReporterData(payload);
  },
  // 删除：工单 全量 +编辑
  deleteAllEditData (store, payload) {
    return api.deleteAllEditData(payload);
  },

  /**
   * 手工创建
   */
  // 全量 +手工
  getAllHandsPage (store, payload) {
    return api.getAllHandsPage(payload);
  },
  // 保存 +手工
  saveAllhandReport (store, payload) {
    return api.saveAllhandReport(payload);
  },
  // 删除
  deleteHandAll (store, payload) {
    return api.deleteHandAll(payload);
  },


  creatorCount (store, payload) {
    return api.creatorCount(payload);
  },
  championCount (store, payload) {
    return api.championCount(payload);
  },
  getIssueOverDaysList (store, payload) {
    return api.getIssueOverDaysList(payload);
  },
};
