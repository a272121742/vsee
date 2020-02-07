import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  VIN: 'RE@string("number", 3)', // VIN
  latestMileage: '@ctitle', // 里程(km
  batteryCode: '@ctitle', // 电池
  plantCode: '@ctitle', // 生产基地
  eleMotorCode: '@ctitle', // 电视机
  prodDate: '@ctitle', // 生产日期
  salesDate: '@date', // 销售日期
  carUsage: '@ctitle', // carUsage
  city: '@ctitle', // 城市
  serviceStationId: '@ctitle', // 服务站
}, 20);
