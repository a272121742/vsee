
// vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 200,
  align: 'center',
  fixed: 'left',
};
// 车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  width: 100,
  align: 'center',
  fixed: 'left',
};
// 工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  align: 'center',
};

// 检测时间
const insptTime = {
  dataIndex: 'inspt_time',
  scopedSlots: {
    customRender: 'inspt_time',
  },
  width: 180,
  align: 'center',
};
// 故障编号
const faultCd = {
  dataIndex: 'fault_cd',
  scopedSlots: {
    customRender: 'fault_cd',
  },
  align: 'center',
};
// 检查问题
const insptProblem = {
  dataIndex: 'inspt_problem',
  scopedSlots: {
    customRender: 'inspt_problem',
  },
  align: 'center',
};
// 问题描述
const problemDesc = {
  dataIndex: 'problem_desc',
  scopedSlots: {
    customRender: 'problem_desc',
  },
  align: 'center',
};
// 故障系统
const faultSystem = {
  dataIndex: 'fault_system',
  scopedSlots: {
    customRender: 'fault_system',
  },
  align: 'center',
};
// 问题类别
const problemType = {
  dataIndex: 'problem_type',
  scopedSlots: {
    customRender: 'problem_type',
  },
  align: 'center',
};

// 返修信息
const reRepairInfo = {
  dataIndex: 're_repair_info',
  scopedSlots: {
    customRender: 're_repair_info',
  },
  align: 'center',
};

// 返修人
const reRepairUserNm = {
  dataIndex: 're_repair_user_nm',
  scopedSlots: {
    customRender: 're_repair_user_nm',
  },
  align: 'center',
};
// 入库日期
const inStockDate = {
  dataIndex: 'in_stock_date',
  scopedSlots: {
    customRender: 'in_stock_date',
  },
  width: 200,
  align: 'center',
};
// 检查人
const insptUserNm = {
  dataIndex: 'inspt_user_nm',
  scopedSlots: {
    customRender: 'inspt_user_nm',
  },
  align: 'center',
};

export default {};

// 过点信息
export const pditraColumns = [
  vin,
  vhclModel,
  plantNm,
  insptTime,
  faultCd,
  insptProblem,
  problemDesc,
  problemType,
  faultSystem,
  reRepairInfo,
  reRepairUserNm,
  inStockDate,
  insptUserNm,
];
