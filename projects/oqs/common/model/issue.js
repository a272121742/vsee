
const code = {
  dataIndex: 'code',
  scopedSlots: {
    customRender: 'code',
  },
  width: 150,
  align: 'center',
};

const vhclModel = {
  dataIndex: 'vhclProjectName',
  scopedSlots: {
    customRender: 'vhclProjectName',
  },
  width: 100,
  align: 'center',
};

const issueSource = {
  dataIndex: 'issueSource',
  scopedSlots: {
    customRender: 'issueSource',
  },
  align: 'center',
  width: 90,
};

const createDate = {
  dataIndex: 'createDate',
  scopedSlots: {
    customRender: 'createDate',
  },
  width: 160,
  align: 'center',
};

const occurDate = {
  dataIndex: 'occurDate',
  scopedSlots: {
    customRender: 'occurDate',
  },
  align: 'center',
  width: 160,
};
const partName = {
  dataIndex: 'partName',
  scopedSlots: {
    customRender: 'partName',
  },
  align: 'center',
  width: 110,
};
const firstCausePart = {
  dataIndex: 'firstCausePart',
  scopedSlots: {
    customRender: 'firstCausePart',
  },
  align: 'center',
  width: 110,
};

const issueId = {
  dataIndex: 'issueId',
  scopedSlots: {
    customRender: 'issueId',
  },
  width: 180,
  align: 'center',
};
const issueStatus = {
  dataIndex: 'issueStatus',
  scopedSlots: {
    customRender: 'issueStatus',
  },
  align: 'center',
  width: 180,
};
// 41、 操作
const operate = {
  dataIndex: 'operate',
  scopedSlots: {
    customRender: 'operate',
  },
  width: 104,
  fixed: 'right',
};


export default {};

// 过点信息
export const issueColumns = [
  code,
  vhclModel,
  issueSource,
  createDate,
  occurDate,
  firstCausePart,
  partName,
  issueId,
  issueStatus,
  operate,
];
