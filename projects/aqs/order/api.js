import $ from '@http';

export default {
  // 非全量
  getClaimOrderaPage: (params) => $.get('/field-q/v1/claimorder/page', params),
  // 全量
  getClaimOrderaAllPage: (params) => $.get('/field-q/v1/claimorder/info', params),

  getOrderExportData: (params) => $.get('/field-q/v1/claimorder/export', params, { responseType: 'blob' }),
  getPartCodeData: (params) => $.get('/masterdata/v1/part/partList?orderField=name', params),
  getPartNameData: (params) => $.get('/masterdata/v1/part/partNameList?orderField=name', params),

  getSupplierCodeData: (params) => $.get('/masterdata/v1/supplier/supplierList', params),
  getSupplierNameData: (params) => $.get('/masterdata/v1/supplier/supplierNameList', params),
};
