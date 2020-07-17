import $ from '@http';

export default {

  // 列表
  getTableList: (params) => $.get('oqs/oqsissuedefn/page', params),
  // 导出
  getExportData: (params) => $.get('/oqs/sqlquery/queryData/export', params, { responseType: 'blob' }),

  // 编辑
  eidtShowData: (id) => $.get(`/oqs/oqsissuedefn/${id}`),
  // 删除
  deleteList: (param) => $.delete('/oqs/oqsissuedefn', param),

  /**
   * 创建
   */
  // 保存
  postSaveReport: (params) => $.post('oqs/oqsissuedefn', params),

  // 保存并立项
  postSaveAndIrsR: (params) => $.post('oqs/oqsissuedefn/push', params),

  /**
   * 修改
   */
  // 保存
  putSaveReport: (params) => $.put('oqs/oqsissuedefn', params),

};
