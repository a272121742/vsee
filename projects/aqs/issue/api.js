import $ from '@http';

export default {
  // 查询已创建的问题报告
  getProblemReport: (param) => $.get('/field-q/v1/asqissuedefn/page', param),
  // 删除报告
  deleteProblemReport: (param) => $.delete('/field-q/v1/asqissuedefn', param),
  // 车辆信息查询
  getVehicleSearchDialogPage: (param) => $.get('/masterdata/v1/vehicle/page', param),

  // 保存，更新报告
  // 非全量
  saveVehicleReport: (param) => $.post('/field-q/v1/asqissuedefn', param),
  // 全量 + 创建
  saveAllVehicleReport: (param) => $.post('/field-q/v1/asqissuedefn/batch', param),
  // 全量 + 编辑
  saveAllEdit: (param) => $.put('/field-q/v1/asqissuedefn/batchUpdate', param),

  // 保存并IRS立项
  saveAndIrsR: (param) => $.post('/field-q/v1/asqissuedefn/push', param),
  // 非全量 report
  getAsqissuedefn: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),

  // 编辑报告详情
  getDetailProblemReport: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),


  // 手工 /工单 + 全量 + 编辑
  getEditAllOrderList: (param) => $.get('field-q/v1/asqissuedefnvhcl/page', param),

  /**
   * 工单
   */
  // 非全选
  getReporterData: (param) => $.get('/field-q/v1/claimorder/list', param),
  // 工单 + 创建 + 全量
  getAllReporterData: (param) => $.get('/field-q/v1/claimorder/batchlist', param),

  deleteAllEditData: (param) => $.delete('/field-q/v1/asqissuedefnvhcl', param),

  /**
   * 手工
   */
  // 查询手工批量
  getAllHandsPage: (param) => $.get('masterdata/v1/vehicle/batchlist', param),
  // 保存 +全量
  saveAllhandReport: (param) => $.post('field-q/v1/asqissuedefn/batch', param),
  // 删除 +创建
  deleteHandAll: (param) => $.get('masterdata/v1/vehicle/batchlist', param),


  // echarts报表API
  creatorCount: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),
  championCount: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),
  getIssueOverDaysList: (id) => $.get(`/field-q/v1/asqissuedefn/${id}`),

  // 批量导出
  getBatchDownloadData: (param) => $.get('/field-q/v1/asqissuedefn/exportBatchTemplate', param, { responseType: 'blob' }),
  // 单车导出
  getSingleDownloadData: (param) => $.get('/field-q/v1/asqissuedefn/exportTemplate', param, { responseType: 'blob' }),
};
