
// 1.vin
const no = {
  dataIndex: 'no',
  scopedSlots: {
    customRender: 'no',
  },
  width: 60,
  align: 'center',

};
// 2. 车型
const defect = {
  dataIndex: 'defect',
  scopedSlots: {
    customRender: 'defect',
  },
  align: 'center',
  width: 130,
};
// 5.车身号
const plant = {
  dataIndex: 'plant',
  scopedSlots: {
    customRender: 'plant',
  },
  align: 'center',
  width: 140,
};
// 7. 总装序列号
const defectposition = {
  dataIndex: 'defectposition',
  scopedSlots: {
    customRender: 'defectposition',
  },
  align: 'center',
  width: 150,
};
// 13.站点编号
const severity = {
  dataIndex: 'severity',
  scopedSlots: {
    customRender: 'severity',
  },
  align: 'center',
  width: 140,
};
// 13.站点名称
const respdept = {
  dataIndex: 'respdept',
  scopedSlots: {
    customRender: 'respdept',
  },
  align: 'center',
  width: 220,
};
// 14.站点类型
const frequency = {
  dataIndex: 'frequency',
  scopedSlots: {
    customRender: 'frequency',
  },
  align: 'center',
  width: 140,
};
const percent = {
  dataIndex: 'percent',
  scopedSlots: {
    customRender: 'percent',
  },
  align: 'center',
  width: 140,
};


export default {};

// 过点信息
export const topColumns = [
  no,
  plant,
  defectposition,
  defect,
  severity,
  respdept,
  frequency,
  percent,
];
