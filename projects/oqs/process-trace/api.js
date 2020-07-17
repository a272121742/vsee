import $ from '@http';

export default {

  // 列表
  getTableList: (params) => $.get('oqs/sqlquery/queryData', params),
  // 导出
  getExportData: (params) => $.get('/oqs/sqlquery/queryData/export', params, { responseType: 'blob' }),

  // 拧紧趋势图
  getEcharts: (data) => $.get(`/oqs/sqlquery/getDataListList`, data),

};
