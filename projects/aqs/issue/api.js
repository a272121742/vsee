import $ from '@http';

export default {
  // 查询已创建的问题报告
  getProblemReport: (param) => $.get('/field-q/v1/asqissuedefn/page', param),
  // 删除报告
  deleteProblemReport: (param) => $.delete('/field-q/v1/asqissuedefn', param),
  // 车辆信息查询
  getVehicleSearchDialogPage: (param) => $.get('/masterdata/v1/vehicle/page', param),

  // 保存，更新报告
  saveVehicleReport: (param) => $.post('/field-q/v1/asqissuedefn', param),
  // 保存并IRS立项
  saveAndIrsR: (param) => $.post('/field-q/v1/asqissuedefn/push', param),
  // report
  getAsqissuedefn: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),

  // 删除创建报告-车辆信息
  deleteVehicleInformation: (param) => $.delete('/field-q/v1/asqissuedefn', param),

  // 编辑报告详情
  getDetailProblemReport: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),

  // 从工单进来请求车辆信息
  getReporterData: (param) => $.get('/field-q/v1/claimorder/list', param),
  getClaimorderOrderList: (param) => $.get('/masterdata/v1/vehicle/page', param),

  // echarts报表API
  creatorCount: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),
  championCount: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),
  getIssueOverDaysList: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),

  // 批量导出
  getBatchDownloadData: (param) => $.get('/field-q/v1/asqissuedefn/exportBatchTemplate', param, { responseType: 'blob' }),
  // 单车导出
  getSingleDownloadData: (param) => $.get('/field-q/v1/asqissuedefn/exportTemplate', param, { responseType: 'blob' }),
};
