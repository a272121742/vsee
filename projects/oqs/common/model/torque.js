
// VIN
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  align: 'center',
  width: 200,
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

// 车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  align: 'center',
  width: 100,
  fixed: 'left',
};

// 设备编号
const eqpCd = {
  dataIndex: 'eqp_cd',
  scopedSlots: {
    customRender: 'eqp_cd',
  },
  align: 'center',
};

// 扭矩值
const torque = {
  dataIndex: 'torque',
  scopedSlots: {
    customRender: 'torque',
  },
  align: 'center',
};

// 扭矩状态
const torqueStatus = {
  dataIndex: 'torque_status',
  scopedSlots: {
    customRender: 'torque_status',
  },
  align: 'center',
};

// 角度值
const angle = {
  dataIndex: 'angle',
  scopedSlots: {
    customRender: 'angle',
  },
  align: 'center',
};

// 角度状态
const angleStatus = {
  dataIndex: 'angle_status',
  scopedSlots: {
    customRender: 'angle_status',
  },
  width: 100,
  align: 'center',
};

// 操作时间
const operateTime = {
  dataIndex: 'operate_time',
  scopedSlots: {
    customRender: 'operate_time',
  },
  width: 200,
  align: 'center',
};
// 操作员
const operatorNm = {
  dataIndex: 'operator_nm',
  scopedSlots: {
    customRender: 'operator_nm',
  },
  width: 120,
  align: 'center',
};


export default {};

// 过点信息
export const torqueColumns = [
  vin,
  vhclModel,
  plantNm,
  eqpCd,
  torque,
  torqueStatus,
  angle,
  angleStatus,
  operatorNm,
  operateTime,
];
