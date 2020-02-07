/**
 * 数据模型
 */

import timeFormatMix from '@mix/time-format.js';

const dateFormat = timeFormatMix.filters.GLOBAL_SELECT_DATE_FORMAT;

// 3. 索赔单号
const claimNo = {
  dataIndex: 'claimNo',
  scopedSlots: {
    customRender: 'claimNo',
  },
  width: 120,
};
// 4. 索赔类型
const claimTypeL1Name = {
  dataIndex: 'claimTypeL1Name',
  scopedSlots: {
    customRender: 'claimTypeL1Name',
  },
  width: 110,
};
// 5. 索赔二级
const claimTypeL2Name = {
  dataIndex: 'claimTypeL2Name',
  scopedSlots: {
    customRender: 'claimTypeL2Name',
  },
  width: 160,
};
// 31. 服务站名称
const serviceStationName = {
  dataIndex: 'serviceStationName',
  scopedSlots: {
    customRender: 'serviceStationName',
  },
  width: 160,
};
// 41. VIN码
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 170,
};
// 42.下线工厂
const factoryName = {
  dataIndex: 'factoryName',
  scopedSlots: {
    customRender: 'factoryName',
  },
  width: 120,
};
// 45.出厂日期
const prodDate = {
  dataIndex: 'prodDate',
  scopedSlots: {
    customRender: 'prodDate',
  },
  width: 110,
};
// 46.销售日期
const salesDate = {
  dataIndex: 'salesDate',
  scopedSlots: {
    customRender: 'salesDate',
  },
  width: 110,
};
// 2. 现行公里数
const faultMileage = {
  dataIndex: 'faultMileage',
  scopedSlots: {
    customRender: 'faultMileage',
  },
  width: 110,
};
// 3. 电机号
const eleMotorCode = {
  dataIndex: 'eleMotorCode',
  scopedSlots: {
    customRender: 'eleMotorCode',
  },
  width: 120,
};
// 祸首件代码
const partCode = {
  dataIndex: 'partCode',
  scopedSlots: {
    customRender: 'partCode',
  },
  width: 110,
};
// 故障代码
const faultSignCode = {
  dataIndex: 'faultSignCode',
  scopedSlots: {
    customRender: 'faultSignCode',
  },
  width: 110,
};
// 故障现象备注
const faultRemarks = {
  dataIndex: 'faultRemarks',
  scopedSlots: {
    customRender: 'faultRemarks',
  },
  width: 200,
};
// 车型名称
const vhclModelName = {
  dataIndex: 'vhclModelName',
  scopedSlots: {
    customRender: 'vhclModelName',
  },
  width: 160,
};
// 车型代码
const vhclModelCode = {
  dataIndex: 'vhclModelCode',
  scopedSlots: {
    customRender: 'vhclModelCode',
  },
  width: 130,
};
// 车型
const vhclModelSaleCode = {
  dataIndex: 'vhclModelSaleCode',
  scopedSlots: {
    customRender: 'vhclModelSaleCode',
  },
  width: 70,
};
// 故障原因手工详细描述
const faultReasonDetailDesc = {
  dataIndex: 'faultReasonDetailDesc',
  scopedSlots: {
    customRender: 'faultReasonDetailDesc',
  },
  width: 200,
};
// 检测及维修说明备注
const testRepairRemarks = {
  dataIndex: 'testRepairRemarks',
  scopedSlots: {
    customRender: 'testRepairRemarks',
  },
  width: 200,
};
// 故障原因分析
const faultReasonAnalysis = {
  dataIndex: 'faultReasonAnalysis',
  scopedSlots: {
    customRender: 'faultReasonAnalysis',
  },
  width: 160,
};
// 祸首件名称
const partName = {
  dataIndex: 'partName',
  scopedSlots: {
    customRender: 'partName',
  },
  width: 150,
};
// 供应商名称
const supplierName = {
  dataIndex: 'supplierName',
  scopedSlots: {
    customRender: 'supplierName',
  },
  width: 120,
};
// 维修内容
const repairContent = {
  dataIndex: 'repairContent',
  scopedSlots: {
    customRender: 'repairContent',
  },
  width: 120,
};
// 车牌号
const licenseNo = {
  dataIndex: 'licenseNo',
  scopedSlots: {
    customRender: 'licenseNo',
  },
  width: 100,
};
// 维修开始日期
const repairBeginDate = {
  dataIndex: 'repairBeginDate',
  scopedSlots: {
    customRender: 'repairBeginDate',
  },
  width: 140,
};
// 提交日期
const applyDate = {
  dataIndex: 'applyDate',
  scopedSlots: {
    customRender: 'applyDate',
  },
  width: 110,
};
// 审批日期
const approveDate = {
  dataIndex: 'approveDate',
  scopedSlots: {
    customRender: 'approveDate',
  },
  width: 110,
};
// 服务站代码
const serviceStationCode = {
  dataIndex: 'serviceStationCode',
  scopedSlots: {
    customRender: 'serviceStationCode',
  },
  width: 160,
};
// 零部件单件费用
const pricePPart = {
  dataIndex: 'pricePPart',
  scopedSlots: {
    customRender: 'pricePPart',
  },
  width: 130,
};
// 配件总费用
const partApproveFee = {
  dataIndex: 'partApproveFee',
  scopedSlots: {
    customRender: 'partApproveFee',
  },
  width: 130,
};
// 工时费用
const laborClaimFee = {
  dataIndex: 'laborClaimFee',
  scopedSlots: {
    customRender: 'laborClaimFee',
  },
  width: 130,
};
// 索赔总费用
const totalClaimFee = {
  dataIndex: 'totalClaimFee',
  scopedSlots: {
    customRender: 'totalClaimFee',
  },
  width: 130,
};
// 供应商代码
const supplierCode = {
  dataIndex: 'supplierCode',
  scopedSlots: {
    customRender: 'supplierCode',
  },
  width: 140,
};
export default {};

export const orderListColumns = [
  claimNo,
  vin,
  vhclModelSaleCode,
  vhclModelCode,
  vhclModelName,
  faultRemarks,
  faultReasonDetailDesc,
  testRepairRemarks,
  serviceStationName,
  faultMileage,
  faultReasonAnalysis,
  partCode,
  partName,
  supplierName,
  repairContent,
  claimTypeL1Name,
  claimTypeL2Name,
  licenseNo,
  { ...prodDate, customRender: dateFormat },
  { ...salesDate, customRender: dateFormat },
  { ...repairBeginDate, customRender: dateFormat },
  { ...applyDate, customRender: dateFormat },
  { ...approveDate, customRender: dateFormat },
  eleMotorCode,
  serviceStationCode,
  faultSignCode,
  factoryName,
  pricePPart,
  partApproveFee,
  laborClaimFee,
  totalClaimFee,
  supplierCode,

  // areaNameZh,
  // claimOrderStatus,
  // batteryCode,
  // carUsageCode,
];
