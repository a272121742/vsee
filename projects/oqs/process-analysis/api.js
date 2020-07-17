import $ from '@http';

export default {

  /**
   * 表格渲染
   */
  getTablePage: (data) => $.get(`/oqs/sqlquery/queryData`, data),

  getEcharts: (data) => $.get(`/oqs/sqlquery/getDataListList`, data),
  // 跳转页面时 获取源质量门
  getSrcGateList: (params) => $.get('/oqs/sqlquery/queryDisplayData?code=filter_src_gate', params),
};
