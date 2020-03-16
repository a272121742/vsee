import timeFormatMix from '@mix/time-format.js';

const dateFormat = timeFormatMix.filters.GLOBAL_SELECT_DATE_FORMAT;

/**
 * 问题定义（车辆信息）
 */
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
};
// 3. 电池
const batteryCode = {
  dataIndex: 'batteryCode',
  scopedSlots: {
    customRender: 'batteryCode',
  },
  width: 100,
};
// 4. 生产基地
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
// 8. 物品代码
const materialCode = {
  dataIndex: 'materialCode',
  scopedSlots: {
    customRender: 'materialCode',
  },
};


export default {};

export const dialogColumns = [
  vin,
  latestMileage,
  batteryCode,
  factoryName,
  eleMotorCode,
  { ...prodDate, customRender: dateFormat },
  { ...salesDate, customRender: dateFormat },
  materialCode,
];
