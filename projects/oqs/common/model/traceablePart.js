
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
// 工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  align: 'center',
};
// 零件代码
const partCd = {
  dataIndex: 'part_cd',
  scopedSlots: {
    customRender: 'part_cd',
  },
  align: 'center',
};


// 零件名称
const partNm = {
  dataIndex: 'part_name',
  scopedSlots: {
    customRender: 'part_name',
  },
  align: 'center',

};
// 零件条码
const partBarcd = {
  dataIndex: 'part_barcd',
  scopedSlots: {
    customRender: 'part_barcd',
  },
  width: 300,
  align: 'center',
};


// 绑定站点
const workstationNm = {
  dataIndex: 'workstation_nm',
  scopedSlots: {
    customRender: 'workstation_nm',
  },
  align: 'center',
};

// 绑定时间
const bindTime = {
  dataIndex: 'bind_time',
  scopedSlots: {
    customRender: 'bind_time',
  },
  width: 160,
  align: 'center',
};

// 供应商代码
const supplierCd = {
  dataIndex: 'supplier_cd',
  scopedSlots: {
    customRender: 'supplier_cd',
  },
  align: 'center',
};
// 供应商名称
const supplierName = {
  dataIndex: 'supplier_name',
  scopedSlots: {
    customRender: 'supplier_name',
  },
  align: 'center',
};


export default {};

// 车辆档案
export const traceablePartColumns = [
  vin,
  vhclModel,
  plantNm,
  partCd,
  partNm,
  partBarcd,
  workstationNm,
  bindTime,
  supplierCd,
  supplierName,
];
