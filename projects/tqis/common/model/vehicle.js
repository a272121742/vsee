/**
 * 问题定义（车辆信息）
 */
import { GET_DATE_FORMAT } from '@util/datetime-helper.js';

// 1. 库存地点代码
const dealerCode = {
  dataIndex: 'dealerCode',
  scopedSlots: {
    customRender: 'dealerCode',
  },
  width: 210,
};
// 2. 零售客户代码
const custCode = {
  dataIndex: 'custCode',
  scopedSlots: {
    customRender: 'custCode',
  },
  width: 140,
};
// 3. 车辆状态
const vhclStatus = {
  dataIndex: 'vhclStatus',
  scopedSlots: {
    customRender: 'vhclStatus',
  },
  width: 120,
  align: 'center',
};
// 4. 车型
const vhclModelSaleName = {
  dataIndex: 'vhclModelSaleName',
  scopedSlots: {
    customRender: 'vhclModelSaleName',
  },
  width: 110,
};
// 4. 车型代码
const vhclModelCode = {
  dataIndex: 'vhclModelCode',
  scopedSlots: {
    customRender: 'vhclModelCode',
  },
  width: 140,
};
// 4. 车型名称
const vhclModelName = {
  dataIndex: 'vhclModelName',
  scopedSlots: {
    customRender: 'vhclModelName',
  },
  width: 210,
};
// 5.电机号
const eleMotorCode = {
  dataIndex: 'eleMotorCode',
  scopedSlots: {
    customRender: 'eleMotorCode',
  },
  width: 140,

};
// 6.品牌编码
const brandCode = {
  dataIndex: 'brandCode',
  scopedSlots: {
    customRender: 'brandCode',
  },
  width: 120,
  align: 'center',
};
// 6. 品牌名称中文
const brandName = {
  dataIndex: 'brandName',
  scopedSlots: {
    customRender: 'brandName',
  },
  width: 120,
};
// 7. 入库日期
const inStockDate = {
  dataIndex: 'inStockDate',
  scopedSlots: {
    customRender: 'inStockDate',
  },
  width: 210,

};
// 8. 物品代码
const materialCode = {
  dataIndex: 'materialCode',
  scopedSlots: {
    customRender: 'materialCode',
  },
  width: 200,

};
// 9.物品名称
const materialName = {
  dataIndex: 'materialName',
  scopedSlots: {
    customRender: 'materialName',
  },
  width: 330,
};
// 9.颜色代码
const colorCode = {
  dataIndex: 'colorCode',
  scopedSlots: {
    customRender: 'colorCode',
  },
  width: 120,
};
// 9.颜色名称
const colorName = {
  dataIndex: 'colorName',
  scopedSlots: {
    customRender: 'colorName',
  },
  width: 120,
};

// 11.vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 160,
};
  // 16.销售日期
const salesDate = {
  dataIndex: 'salesDate',
  scopedSlots: {
    customRender: 'salesDate',
  },
  width: 130,
};
// 16.出厂日期
const prodDate = {
  dataIndex: 'prodDate',
  scopedSlots: {
    customRender: 'prodDate',
  },
  width: 130,
};
  // 17.车辆用途
const factoryName = {
  dataIndex: 'factoryName',
  scopedSlots: {
    customRender: 'factoryName',
  },
  width: 130,
};
  // 18.钥匙码
const carKeyCode = {
  dataIndex: 'carKeyCode',
  scopedSlots: {
    customRender: 'carKeyCode',
  },
  width: 130,
};
const salesOrderNo = {
  dataIndex: 'salesOrderNo',
  scopedSlots: {
    customRender: 'salesOrderNo',
  },
  width: 130,
};
  // 17.总部库存锁定标志（Y/N）
const isLocked = {
  dataIndex: 'isLocked',
  scopedSlots: {
    customRender: 'isLocked',
  },
  width: 170,
  align: 'center',
};

// 17.区域代码
const regionCode = {
  dataIndex: 'regionCode',
  scopedSlots: {
    customRender: 'regionCode',
  },
  width: 120,
};
// 17.区域名称
const regionName = {
  dataIndex: 'regionName',
  scopedSlots: {
    customRender: 'regionName',
  },
  width: 130,
};
// 17.省份代码
const provinceCode = {
  dataIndex: 'provinceCode',
  scopedSlots: {
    customRender: 'provinceCode',
  },
  width: 130,
};
// 17.省份名称
const provinceName = {
  dataIndex: 'provinceName',
  scopedSlots: {
    customRender: 'provinceName',
  },
  width: 130,
};

export default {};

export const vehicleListColumns = [
  dealerCode,
  custCode,
  vhclStatus,
  vhclModelSaleName,
  vhclModelCode,
  vhclModelName,
  eleMotorCode,
  brandCode,
  brandName,
  { ...inStockDate, customRender: GET_DATE_FORMAT },
  materialCode,
  materialName,
  carKeyCode,
  colorCode,
  colorName,
  salesOrderNo,
  isLocked,
  vin,
  factoryName,
  { ...prodDate, customRender: GET_DATE_FORMAT },
  regionCode,
  regionName,
  provinceCode,
  provinceName,
  { ...salesDate, customRender: GET_DATE_FORMAT },
];
