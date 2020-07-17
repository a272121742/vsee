
// vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  align: 'center',
  width: 160,
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
  width: 90,
};

// 车间
const workshopNm = {
  dataIndex: 'workshop_nm',
  scopedSlots: {
    customRender: 'workshop_m',
  },
  align: 'center',
  width: 90,
};

// 检测部位
const insptSection = {
  dataIndex: 'inspt_section',
  scopedSlots: {
    customRender: 'inspt_section',
  },
  width: 110,
  align: 'center',
};
// 检测站点
const defectInputStationNm = {
  dataIndex: 'defect_input_station_nm',
  scopedSlots: {
    customRender: 'defect_input_station_nm',
  },
  width: 90,
  align: 'center',
};
// 缺陷项
const insptItem = {
  dataIndex: 'inspt_item',
  scopedSlots: {
    customRender: 'inspt_item',
  },
  width: 90,
  align: 'center',
};

// 缺陷描述
const defectType = {
  dataIndex: 'defect_type',
  scopedSlots: {
    customRender: 'defect_type',
  },
  width: 90,
  align: 'center',
};

// 缺陷位置
const defectPst = {
  dataIndex: 'defect_pst',
  scopedSlots: {
    customRender: 'defect_pst',
  },
  width: 90,
  align: 'center',
};

// 缺陷等级
const defectLevel = {
  dataIndex: 'defect_level',
  scopedSlots: {
    customRender: 'defect_level',
  },
  width: 90,
  align: 'center',
};

// 9.缺陷状态
const defectStatus = {
  dataIndex: 'defect_status',
  scopedSlots: {
    customRender: 'defect_status',
  },
  width: 90,
  align: 'center',
};
// 缺陷区域
const insptArea = {
  dataIndex: 'inspt_area',
  scopedSlots: {
    customRender: 'inspt_area',
  },
  width: 90,
  align: 'center',
};
// 源质量门
const srcGateNm = {
  dataIndex: 'src_gate_nm',
  scopedSlots: {
    customRender: 'src_gate_nm',
  },
  width: 120,
  align: 'center',
};
// 质量门
const gateNm = {
  dataIndex: 'gate_nm',
  scopedSlots: {
    customRender: 'gate_nm',
  },
  width: 100,
  align: 'center',
};

// 责任部门
const rspnsArea = {
  dataIndex: 'rspns_area',
  scopedSlots: {
    customRender: 'rspns_area',
  },
  width: 90,
  align: 'center',
};

// 缺陷录入人
const defectInputUserNm = {
  dataIndex: 'defect_input_user_nm',
  scopedSlots: {
    customRender: 'defect_input_user_nm',
  },
  width: 100,
  align: 'center',
};

// 缺陷时间
const defectInputTime = {
  dataIndex: 'defect_input_time',
  scopedSlots: {
    customRender: 'defect_input_time',
  },
  align: 'center',
  width: 160,
};

// 是否补录
const isCollection = {
  dataIndex: 'is_collection',
  scopedSlots: {
    customRender: 'is_collection',
  },
  align: 'center',
  width: 80,
};

// 班次
const shift = {
  dataIndex: 'shift',
  scopedSlots: {
    customRender: 'shift',
  },
  align: 'center',
  width: 80,
};

// 缺陷原因
const rootCause = {
  dataIndex: 'root_cause',
  scopedSlots: {
    customRender: 'root_cause',
  },
  align: 'center',
  width: 100,
};

// 维修站点
const defectRepairStationNm = {
  dataIndex: 'defect_repair_station_nm',
  scopedSlots: {
    customRender: 'defect_repair_station_nm',
  },
  align: 'center',
  width: 90,
};

// 维修时间
const repairTime = {
  dataIndex: 'repair_time',
  scopedSlots: {
    customRender: 'repair_time',
  },
  align: 'center',
  width: 160,
};

// 维修员
const defectRepairUserNm = {
  dataIndex: 'defect_repair_user_nm',
  scopedSlots: {
    customRender: 'defect_repair_user_nm',
  },
  align: 'center',
  width: 90,
};

// 确认站点
const defectConfirmStationNm = {
  dataIndex: 'defect_confirm_station_nm',
  scopedSlots: {
    customRender: 'defect_confirm_station_nm',
  },
  align: 'center',
  width: 90,
};

// 确认时间
const defectConfirmTime = {
  dataIndex: 'defect_confirm_time',
  scopedSlots: {
    customRender: 'defect_confirm_time',
  },
  align: 'center',
  width: 160,
};

// 确认人
const defectConfirmUserNm = {
  dataIndex: 'defect_confirm_user_nm',
  scopedSlots: {
    customRender: 'defect_confirm_user_nm',
  },
  align: 'center',
  width: 90,
};

// 备注
const remark = {
  dataIndex: 'remark',
  scopedSlots: {
    customRender: 'remark',
  },
  align: 'center',
  width: 150,
};

export default {};
export const onlineDefectColumns = {
  vin,
  vhclModel,
  plantNm,
  workshopNm,
  defectInputStationNm,
  insptSection,
  rootCause,
  insptArea,
  insptItem,
  defectType,
  defectPst,
  defectLevel,
  defectStatus,
  rspnsArea,
  srcGateNm,
  gateNm,
  defectInputUserNm,
  defectInputTime,
  isCollection,
  shift,
  defectRepairStationNm,
  repairTime,
  defectRepairUserNm,
  defectConfirmStationNm,
  defectConfirmTime,
  defectConfirmUserNm,
  remark,
};
