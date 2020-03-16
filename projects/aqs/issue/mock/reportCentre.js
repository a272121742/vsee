import mock from '@mock';
// eslint-disable-next-line no-unused-vars
import cdb from '@lib/cdb.js';


const result = {
  asqIssueRptCode: '报告编号', // 报告编号
  vhclSeriesCode: '车型', // 车型
  asqIssueSource: '问题来源', // 问题来源
  asqIssueCategory: '问题类别', // 问题类别
  firstCausePart: '祸首件', // 祸首件
  零件号: '零件号',
  供应商: '供应商',
  createDate: '创建时间', // 发布日期
  falutDate: '故障时间', // 故障时间
  问题级别: '问题级别', // 问题级别
  faultSymptom: '故障现象', // 故障现象
  faultFeature: '故障特征', // 故障特征
  故障台次: '故障台次', // 故障台次
  faultCondition: '故障工况', // 故障工况
  fileName: '附件', // 附件
  vin: 'vin', // vin
  dealerCityId: 'dealerCityId', // 城市
  env: 'env', // 环境
  latestMileage: 'latestMileage', // 行驶里程
  电池包: '电池包', // 电池包
  plantCode: 'plantCode', // 生产基地
  prodDate: 'prodDate', // 生产日期
  salesDate: 'salesDate', // 销售日期
  carUsage: 'carUsage', // 车辆用途
  serviceStationName: 'serviceStationName', // 服务站
  数据信息: '数据信息', // 数据信息
  originalAnalysis: '初步分析', // 初步分析
  tempSolution: '临时措施', // 临时措施
};
// eslint-disable-next-line no-unused-vars
mock.get('/field-q/v1/asqissuedefn/:id', (id) => mock.result({
  data: result,
}), { timeout: 0 });
