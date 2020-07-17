
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
// 工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  align: 'center',
};

// 2.车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  width: 100,
  align: 'center',
  fixed: 'left',
};

// 车间
const workshopNm = {
  dataIndex: 'workshop_nm',
  scopedSlots: {
    customRender: 'workshop_nm',
  },
  align: 'center',
};

// 13.站点编
const workstationCd = {
  dataIndex: 'workstation_cd',
  scopedSlots: {
    customRender: 'workstation_cd',
  },
  align: 'center',
};
// 13.站点名称
const workstationNm = {
  dataIndex: 'workstation_nm',
  scopedSlots: {
    customRender: 'workstation_nm',
  },
  align: 'center',
};
// 14.站点类型
const checkpointType = {
  dataIndex: 'checkpoint_type',
  scopedSlots: {
    customRender: 'checkpoint_type',
  },
  align: 'center',
};
// 15.入站时
const checkStartTime = {
  dataIndex: 'check_start_time',
  scopedSlots: {
    customRender: 'check_start_time',
  },
  width: 160,
  align: 'center',
};
// 15.出站时
const checkEndTime = {
  dataIndex: 'check_end_time',
  scopedSlots: {
    customRender: 'check_end_time',
  },
  width: 160,
  align: 'center',
};
// 下线标志
const downFlg = {
  dataIndex: 'down_flg',
  scopedSlots: {
    customRender: 'down_flg',
  },
  align: 'center',
};

// 是否手工补录
const manualFlg = {
  dataIndex: 'manual_flg',
  scopedSlots: {
    customRender: 'manual_flg',
  },
  width: 100,
  align: 'center',
};

// 班次
const shift = {
  dataIndex: 'shift',
  scopedSlots: {
    customRender: 'shift',
  },
  align: 'center',
};

export default {};

// 过点信息
export const checkpointColumns = [
  vin,
  vhclModel,
  plantNm,
  workshopNm,
  workstationCd,
  workstationNm,
  checkpointType,
  checkStartTime,
  checkEndTime,
  downFlg,
  manualFlg,
  shift,
];
