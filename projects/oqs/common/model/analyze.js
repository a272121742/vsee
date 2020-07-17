
// 0.序号
const number = {
  dataIndex: 'id',
  scopedSlots: {
    customRender: 'id',
  },
  align: 'center',
  width: 60,
};

// 1.日期
const date = {
  dataIndex: 'date_id',
  scopedSlots: {
    customRender: 'date_id',
  },
  align: 'center',
  width: 90,
};
// 2. 车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  align: 'center',
  width: 80,
};

// 3.工厂
const plant = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  align: 'center',
  width: 80,
};

// 4. 站点点位
const station = {
  dataIndex: 'station_nm',
  scopedSlots: {
    customRender: 'station_nm',
  },
  align: 'center',
  width: 90,
};

// 车间
const workshopNm = {
  dataIndex: 'ftq_workshop_nm',
  scopedSlots: {
    customRender: 'ftq_workshop_nm',
  },
  align: 'center',
  width: 90,
};

// 5、 一次通过合格率
const FTQ = {
  dataIndex: 'kpi_value',
  scopedSlots: {
    customRender: 'kpi_value',
  },
  align: 'center',
  width: 150,
};

// 6、目标值
const target = {
  dataIndex: 'kpi_target',
  scopedSlots: {
    customRender: 'kpi_target',
  },
  align: 'center',
  width: 170,
};

// 7.缺陷车辆数
const defect = {
  dataIndex: 'nmrtr_value',
  scopedSlots: {
    customRender: 'nmrtr_value',
  },
  align: 'center',
  width: 100,
};
// 8、过站车辆数
const pass = {
  dataIndex: 'dnmtr_value',
  scopedSlots: {
    customRender: 'dnmtr_value',
  },
  align: 'center',
  width: 100,
};


// pdi
//
const pdiFTQ = {
  dataIndex: 'kpi_value',
  scopedSlots: {
    customRender: 'kpi_value',
  },
  align: 'center',
  width: 100,
};

// 6、目标值
const pdiTarget = {
  dataIndex: 'kpi_target',
  scopedSlots: {
    customRender: 'kpi_target',
  },
  align: 'center',
  width: 140,
};

// 7.一次报交通过车辆数
const pdiDefect = {
  dataIndex: 'nmrtr_value',
  scopedSlots: {
    customRender: 'nmrtr_value',
  },
  align: 'center',
  width: 140,
};
// 8、当日新校验车辆台数
const pdiPass = {
  dataIndex: 'dnmtr_value',
  scopedSlots: {
    customRender: 'dnmtr_value',
  },
  align: 'center',
  width: 150,
};


export default {};

// DR 综合直行率
export const drColumns = [number, date, plant, vhclModel, station, FTQ, target, defect, pass];

// DRL 一次通过率损失
export const drlColumns = [number, date, plant, vhclModel, station, FTQ, target, defect, pass];

// audit 整车评审
export const auditColumns = [number, date, plant, vhclModel, FTQ, target, defect, pass];

// pdi 入库直行率
export const pdiDdrColumns = [number, date, plant, vhclModel, pdiFTQ, pdiTarget, pdiDefect, pdiPass];

// pdi 功能缺陷数
export const pdiFdrColumns = [number, date, plant, vhclModel, pdiFTQ, pdiTarget, pdiDefect, pdiPass];

// FTQ 一次通过率损失
export const ftqColumns = [number, date, plant, vhclModel, workshopNm, FTQ, target, defect, pass];
