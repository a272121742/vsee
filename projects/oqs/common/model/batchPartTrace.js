// 工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  width: 90,
  align: 'center',
};

// 零件代码
const partCd = {
  dataIndex: 'part_cd',
  scopedSlots: {
    customRender: 'part_cd',
  },
  width: 90,
  align: 'center',
};

// 零件名称
const partNm = {
  dataIndex: 'part_nm',
  scopedSlots: {
    customRender: 'part_nm',
  },
  width: 200,
  align: 'center',
};
// 供应商代码
const supplierCode = {
  dataIndex: 'supplier_code',
  scopedSlots: {
    customRender: 'supplier_code',
  },
  width: 100,
  align: 'center',

};
// 供应商名称
const supplierNm = {
  dataIndex: 'supplier_nm',
  scopedSlots: {
    customRender: 'supplier_nm',
  },
  width: 200,
  align: 'center',
};

// 仓库
const warehouseNm = {
  dataIndex: 'warehouse_nm',
  scopedSlots: {
    customRender: 'warehouse_nm',
  },
  width: 100,
  align: 'center',
};

// 库区
const dlocNm = {
  dataIndex: 'dloc_nm',
  scopedSlots: {
    customRender: 'dloc_nm',
  },
  width: 100,
  align: 'center',
};

// 库位
const locNm = {
  dataIndex: 'loc_nm',
  scopedSlots: {
    customRender: 'loc_nm',
  },
  width: 120,
  align: 'center',
};

// 数量
const boundQty = {
  dataIndex: 'bound_qty',
  scopedSlots: {
    customRender: 'bound_qty',
  },
  width: 100,
  align: 'center',
};

// 批次
const batchNo = {
  dataIndex: 'batch_no',
  scopedSlots: {
    customRender: 'batch_no',
  },
  width: 110,
  align: 'center',
};

// 箱号
const boxNo = {
  dataIndex: 'box_no',
  scopedSlots: {
    customRender: 'box_no',
  },
  width: 110,
  align: 'center',
};

// 出库时间
const outboundTime = {
  dataIndex: 'outbound_time',
  scopedSlots: {
    customRender: 'outbound_time',
  },
  width: 160,
  align: 'center',
};


export default {};

// 车辆档案
export const batchPartTraceColumns = [plantNm, partCd, partNm, supplierCode, supplierNm, warehouseNm, dlocNm, locNm, boundQty, batchNo, boxNo, outboundTime];
