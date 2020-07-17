
// 1.vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 180,
  align: 'center',
  fixed: 'left',
};
// 2. 车型
const model = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  width: 120,
  align: 'center',
  fixed: 'left',
};
// 2. 车型代码
const modelCode = {
  dataIndex: 'vhcl_model_code',
  scopedSlots: {
    customRender: 'vhcl_model_code',
  },
  align: 'center',
};
// 2. 车型名称
const modelName = {
  dataIndex: 'vhcl_model_name',
  scopedSlots: {
    customRender: 'vhcl_model_name',
  },
  align: 'center',
};
// 3. 工厂
const plant = {
  dataIndex: 'plant_shot_nm',
  scopedSlots: {
    customRender: 'plant_shot_nm',
  },
  align: 'center',
};
// 4. 订单号
const orderNo = {
  dataIndex: 'sales_order_no',
  scopedSlots: {
    customRender: 'sales_order_no',
  },
  align: 'center',
};
// 8. 总装下线日期
const prodDate = {
  dataIndex: 'prod_date',
  scopedSlots: {
    customRender: 'prod_date',
  },
  align: 'center',
};
// 9. 报交时间
const outStockDate = {
  dataIndex: 'out_stock_date',
  scopedSlots: {
    customRender: 'out_stock_date',
  },
  align: 'center',
};
// 11.颜色
const colorName = {
  dataIndex: 'color_name',
  scopedSlots: {
    customRender: 'color_name',
  },
  align: 'center',
};
// 12.整车物料编号
const materialCode = {
  dataIndex: 'material_code',
  scopedSlots: {
    customRender: 'material_code',
  },
  align: 'center',
};

export default {};

// 车辆档案
export const vehProfileColumns = [vin, model, modelCode, modelName, plant, orderNo, prodDate, outStockDate, colorName, materialCode];
