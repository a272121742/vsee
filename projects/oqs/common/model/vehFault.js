
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
const cartypeName = {
  dataIndex: 'cartypeName',
  scopedSlots: {
    customRender: 'cartypeName',
  },
  width: 120,
  align: 'center',
  fixed: 'left',
};
// 3. 项目代码
const batchCode = {
  dataIndex: 'batchCode',
  scopedSlots: {
    customRender: 'batchCode',
  },
  align: 'center',
};
// 4. 故障类型
const type = {
  dataIndex: 'type',
  scopedSlots: {
    customRender: 'type',
  },
  align: 'center',
};
// 5、国际故障类型
const standardFaultLevel = {
  dataIndex: 'standardFaultLevel',
  scopedSlots: {
    customRender: 'standardFaultLevel',
  },
  align: 'center',
};
// 4. 自定义故障登记
const customFaultLevel = {
  dataIndex: 'customFaultLevel',
  scopedSlots: {
    customRender: 'customFaultLevel',
  },
  align: 'center',
};
// 故障发生时间
const startTime = {
  dataIndex: 'startTime',
  scopedSlots: {
    customRender: 'startTime',
  },
  align: 'center',
};
// 故障结束时间
const endTime = {
  dataIndex: 'endTime',
  scopedSlots: {
    customRender: 'endTime',
  },
  align: 'center',
};
// 故障编码
const faultCode = {
  dataIndex: 'faultCode',
  scopedSlots: {
    customRender: 'faultCode',
  },
  align: 'center',
};
// 故障名称
const faultName = {
  dataIndex: 'faultName',
  scopedSlots: {
    customRender: 'faultName',
  },
  align: 'center',
};
// VUC零部件号
const vcuSpareparts = {
  dataIndex: 'vcuSpareparts',
  scopedSlots: {
    customRender: 'vcuSpareparts',
  },
  align: 'center',
};

// MCU零部件号
const mcupareparts = {
  dataIndex: 'mcupareparts',
  scopedSlots: {
    customRender: 'mcupareparts',
  },
  align: 'center',
};

export default {};

// 车辆档案
export const vehFaultColumns = [vin, cartypeName, batchCode, type, standardFaultLevel, customFaultLevel, startTime, endTime, faultCode, faultName, vcuSpareparts, mcupareparts];
