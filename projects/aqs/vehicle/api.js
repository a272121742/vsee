import $ from '@http';

export default {
  getVehiclePage: (params) => $.get('/masterdata/v1/vehicle/page', params),
  getVehicleExportData: (params) => $.get('/masterdata/v1/vehicle/export', params, { responseType: 'blob' }),
  // 全量
  getVehicleAllPage: (params) => $.get('/masterdata/v1/vehicle/info', params),
};
