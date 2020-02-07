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
  saveVehicleReport (store, param) {
    return api.saveVehicleReport(param);
  },
  // 保存并IRS立项
  saveAndIrsR (store, param) {
    return api.saveAndIrsR(param);
  },
  // reportCentre
  getAsqissuedefn (store, id) {
    return api.getAsqissuedefn(id);
  },

  getClaimorderOrderList (store, id) {
    return api.getClaimorderOrderList(id);
  },
  getReporterData (store, payload) {
    return api.getReporterData(payload);
  },

  getSingleDownloadData (store, payload) {
    return api.getSingleDownloadData(payload);
  },
  getBatchDownloadData (store, payload) {
    return api.getBatchDownloadData(payload);
  },

  // 9.零件号
  getPart (store, param) {
    return api.getPart(param);
  },
  // 10.供应商
  getSupplier (store, param) {
    return api.getSupplier(param);
  },
  // 11.故障特征 ?
  getFaultCharacteristics (store, param) {
    return api.getFaultCharacteristics(param);
  },
  // 编辑报告详情
  getDetailProblemReport (store, param) {
    return api.getDetailProblemReport(param);
  },
  // 车辆信息
  deleteVehicleInformation (store, param) {
    return api.deleteVehicleInformation(param);
  },

  // 车辆查询弹框
  vehicleSearchDialogPage (store, param) {
    return api.vehicleSearchDialogPage(param);
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
