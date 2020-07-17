
// 1.vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 200,
  align: 'center',
  fixed: 'left',
};
// 2. 车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  width: 100,
  align: 'center',
  fixed: 'left',
};
// 5.工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  width: 100,
  align: 'center',
};

// 设备编号
const eqpCd = {
  dataIndex: 'eqp_cd',
  scopedSlots: {
    customRender: 'eqp_cd',
  },
  width: 100,
  align: 'center',
};

// 加注名称
const fillingNm = {
  dataIndex: 'filling_nm',
  scopedSlots: {
    customRender: 'filling_nm',
  },
  width: 100,
  align: 'center',
};
// 加注代码
const fillingCd = {
  dataIndex: 'filling_cd',
  scopedSlots: {
    customRender: 'filling_cd',
  },
  width: 100,
  align: 'center',
};
// 加注量
const fillingVolActual = {
  dataIndex: 'filling_vol_actual',
  scopedSlots: {
    customRender: 'filling_vol_actual',
  },
  width: 90,
  align: 'center',
};

// 加注量单位
const fillingUnit = {
  dataIndex: 'filling_unit',
  scopedSlots: {
    customRender: 'filling_unit',
  },
  width: 100,
  align: 'center',
};

// 5.加注耗时
const fillingTime = {
  dataIndex: 'filling_time',
  scopedSlots: {
    customRender: 'filling_time',
  },
  width: 170,
  align: 'center',
};

// 作业时间
const operateTime = {
  dataIndex: 'operate_time',
  scopedSlots: {
    customRender: 'operate_time',
  },
  width: 170,
  align: 'center',
};
// 加注结果
const fillingResult = {
  dataIndex: 'filling_result',
  scopedSlots: {
    customRender: 'filling_result',
  },
  width: 90,
  align: 'center',
};

// abs解码/制动液加注
const absDecipher = {
  dataIndex: 'abs_decipher',
  scopedSlots: {
    customRender: 'abs_decipher',
  },
  width: 170,
  align: 'center',
};

// 粗真空
const crudeVacuumActual = {
  dataIndex: 'crude_vacuum_actual',
  scopedSlots: {
    customRender: 'crude_vacuum_actual',
  },
  width: 80,
  align: 'center',
};
// 高真空
const highVacuumActual = {
  dataIndex: 'high_vacuum_actual',
  scopedSlots: {
    customRender: 'high_vacuum_actual',
  },
  width: 80,
  align: 'center',
};
// 真空泄露测试值
const leakageVacuumActual = {
  dataIndex: 'leakage_vacuum_actual',
  scopedSlots: {
    customRender: 'leakage_vacuum_actual',
  },
  width: 150,
  align: 'center',
};
// 后真空
const rearVacuumActual = {
  dataIndex: 'rear_vacuum_actual',
  scopedSlots: {
    customRender: 'rear_vacuum_actual',
  },
  width: 80,
  align: 'center',
};
// 作业类型
const workType = {
  dataIndex: 'work_type',
  scopedSlots: {
    customRender: 'work_type',
  },
  width: 90,
  align: 'center',
};
// 标志位
const flag = {
  dataIndex: 'flag',
  scopedSlots: {
    customRender: 'flag',
  },
  width: 80,
  align: 'center',
};
// 5.备注
const remark = {
  dataIndex: 'remark',
  scopedSlots: {
    customRender: 'remark',
  },
  width: 150,
  align: 'center',
};
// 班次
const shift = {
  dataIndex: 'shift',
  scopedSlots: {
    customRender: 'shift',
  },
  width: 80,
};

export default {};

// 车辆档案
export const fillingColumns = [
  vin,
  vhclModel,
  plantNm,
  eqpCd,
  fillingNm,
  fillingCd,
  fillingVolActual,
  fillingUnit,
  fillingTime,
  operateTime,
  fillingResult,
  absDecipher,
  crudeVacuumActual,
  highVacuumActual,
  leakageVacuumActual,
  rearVacuumActual,
  workType,
  shift,
  flag,
  remark,
];
