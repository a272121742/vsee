import $ from '@http';

export default {

  // 列表
  getTableList: (params) => $.get('oqs/sqlquery/queryData', params),
  getVFaultTableList: (params) => $.get('oqs/v1/faulttemp/querybyparam', params),
  // 导出
  getExportData: (params) => $.get('/oqs/sqlquery/queryData/export', params, { responseType: 'blob' }),

  // 拧紧趋势图
  getEcharts: (data) => $.get(`/oqs/sqlquery/getDataListList`, data),

  // 1.2.0新添加
  // 车辆电池实时状态
  // 列表
  getBatteryStatusTableList: (params) => $.get('/oqs/webservice/queryCarState', params),
  postStatusNew: (params) => $.post('/oqs/vehiclestatus', params),
  // 车辆电池状态历史
  getBatteryRecordTableList: (params) => $.get('/oqs/vehiclestatus/page', params),

  // 车辆快慢充数据
  // 列表
  getChargingTableList: (params) => $.get('/oqs/webservice/queryChargeDetailed', params),

  // 车辆故障记录
  getFaultTableList: (params) => $.get('/oqs/v1/faulttemp/querybyparam', params),

};
