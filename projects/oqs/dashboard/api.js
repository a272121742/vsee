import $ from '@http';

export default {
  // 表格
  getBoardList: (params) => $.get('/oqs/sqlquery/kanBanData?code=kanban_sqlcode', params),
  // 数据更新时间
  getTime: (params) => $.get('/oqs/sqlquery/queryData?code=oqs_dashboard_data_time', params),

};
