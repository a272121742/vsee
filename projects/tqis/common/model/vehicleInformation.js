/**
 * 问题定义（车辆信息）
 */

import timeFormatMix from '@mix/time-format.js';

const dateFormat = timeFormatMix.filters.GLOBAL_SELECT_DATE_FORMAT;

// 1. VIN
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 160,
};
// 2. 里程(km)
const latestMileage = {
  dataIndex: 'latestMileage',
  scopedSlots: {
    customRender: 'latestMileage',
  },
  width: 140,
};
// 3. 电池
const batteryCode = {
  dataIndex: 'batteryCode',
  scopedSlots: {
    customRender: 'batteryCode',
  },
};
// 4. 下线工厂
const factoryName = {
  dataIndex: 'factoryName',
  scopedSlots: {
    customRender: 'factoryName',
  },
};
// 5. 电机号
const eleMotorCode = {
  dataIndex: 'eleMotorCode',
  scopedSlots: {
    customRender: 'eleMotorCode',
  },
};
// 6. 生产日期
const prodDate = {
  dataIndex: 'prodDate',
  scopedSlots: {
    customRender: 'prodDate',
  },
};
// 7. 销售日期
const salesDate = {
  dataIndex: 'salesDate',
  scopedSlots: {
    customRender: 'salesDate',
  },
};
// // 8. 物品代码
// const materialCode = {
//   dataIndex: 'materialCode',
//   scopedSlots: {
//     customRender: 'materialCode',
//   },
// };
// 9.城市
const dealerCityId = {
  dataIndex: 'dealerCityId',
  scopedSlots: {
    customRender: 'dealerCityId',
  },
  width: 170,
};
// 10.服务站
const serviceStationId = {
  dataIndex: 'serviceStationId',
  scopedSlots: {
    customRender: 'serviceStationId',
  },
  width: 180,
};

export default {};

export const vehicleInformationColumns = [
  vin,
  latestMileage,
  batteryCode,
  factoryName,
  eleMotorCode,
  { ...prodDate, customRender: dateFormat },
  { ...salesDate, customRender: dateFormat },
  dealerCityId,
  serviceStationId,
];
