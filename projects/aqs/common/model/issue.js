/**
 * 售后问题定义
 */

// 1. 问题属类
const issueCategory = {
  dataIndex: 'issueCategory',
  scopedSlots: {
    customRender: 'issueCategory',
  },
  width: 140,
};
// 3. 报告编码
const asqIssueRptCode = {
  dataIndex: 'asqIssueRptCode',
  scopedSlots: {
    customRender: 'asqIssueRptCode',
  },
  width: 140,
  fixed: 'left',
};
// 5. 报告类型(单车/批量)
const rptNameType = {
  dataIndex: 'rptNameType',
  scopedSlots: {
    customRender: 'rptNameType',
  },
  width: 120,
  align: 'center',
};
// 6. 问题来源
const issueSourceName = {
  dataIndex: 'issueSourceName',
  scopedSlots: {
    customRender: 'issueSourceName',
  },
  width: 130,
};
// 8. 创建时间(发布时间)
const createDate = {
  dataIndex: 'createDate',
  scopedSlots: {
    customRender: 'createDate',
  },
  width: 160,
};
// 36. 销售车系编码
const vhclSeriesCode = {
  dataIndex: 'vhclSeriesCode',
  scopedSlots: {
    customRender: 'vhclSeriesCode',
  },
  width: 130,
};
// -----------------xiu.li 新加的模型
// 37. 创建类型
const isHandMadeName = {
  dataIndex: 'isHandMadeName',
  scopedSlots: {
    customRender: 'isHandMadeName',
  },
  width: 120,
  align: 'center',
};
// 38、 故障工况
const faultCondition = {
  dataIndex: 'faultCondition',
  scopedSlots: {
    customRender: 'faultCondition',
  },
};
// 39、 IssueNo
const issueCode = {
  dataIndex: 'issueCode',
  scopedSlots: {
    customRender: 'issueCode',
  },
  width: 180,
};
// 40、 issueStatus
const issueStatus = {
  dataIndex: 'issueStatus',
  scopedSlots: {
    customRender: 'issueStatus',
  },
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
// 祸首件代码
const code = {
  dataIndex: 'code',
  scopedSlots: {
    customRender: 'code',
  },
  width: 115,
};
// 祸首件名称
const name = {
  dataIndex: 'name',
  scopedSlots: {
    customRender: 'name',
  },
  width: 140,
};

export default {};

export const issueListColumns = [
  asqIssueRptCode,
  rptNameType,
  isHandMadeName,
  issueSourceName,
  createDate,
  issueCategory,
  code,
  name,
  vhclSeriesCode,
  faultCondition,
  issueCode,
  issueStatus,
  operate,
];
