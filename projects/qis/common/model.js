import moment from 'moment';
import { transform, treeTransform } from '@util/datahelper.js';
import { omit } from 'ramda';

// 问题编号
const code = {
  title: 'code',
  dataIndex: 'code',
  width: 130,
  fixed: true,
  scopedSlots: { customRender: 'code' },
};
// 标题
const title = {
  title: 'title',
  dataIndex: 'title',
  width: 240,
  scopedSlots: { customRender: 'title' },
};
// 所属系统
const faultTreeIds1Name = {
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1Name',
  width: 160,
  scopedSlots: { customRender: 'faultTreeIds1' },
};
// 问题等级
const gradeName = {
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'gradeName' },
  sorter: true,
};
// 问题分类
const sourceName = {
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 120,
  scopedSlots: { customRender: 'sourceName' },
};
// 问题阶段
const projectPhase = {
  title: 'projectPhase',
  dataIndex: 'projectPhaseName',
  width: 130,
  scopedSlots: { customRender: 'projectPhase' },
};
// 解决进度
const status = {
  title: 'status',
  dataIndex: 'status',
  width: 120,
  scopedSlots: { customRender: 'status' },
  sorter: true,
};
// 立项日期
const projectDate = {
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 165,
  align: 'center',
  sorter: true,
  scopedSlots: { customRender: 'projectDate' },
  customRender (date = '') {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  },
};
// 接受日期
const receiveDate = {
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 150,
  align: 'center',
  sorter: true,
  scopedSlots: { customRender: 'receiveDate' },
  customRender (date = '') {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  },
};
// 当前处理人
const assignerName = {
  title: 'assignerName',
  dataIndex: 'assignerName',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'assignerName' },
};
// 问题提出人
const proposerName = {
  title: 'proposerName',
  dataIndex: 'creatorName',
  width: 150,
  align: 'center',
  scopedSlots: {
    customRender: 'creatorName',
  },
};
// 创建日期
const createDate = {
  title: 'createDate',
  dataIndex: 'createDate',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'createDate' },
  customRender (date = '') {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  },
};

// 超期天数
const overdays = {
  title: 'overDays',
  dataIndex: 'overDays',
  width: 80,
  align: 'center',
  scopedSlots: { customRender: 'overDays' },
};

// 待办 1 - todo
export const issueTodoColumns = [code, title, faultTreeIds1Name, gradeName, sourceName,
  projectPhase, status, assignerName, proposerName, projectDate, receiveDate,
];
// 待发 0 - draft (草稿)
export const issueDraftColumns = [code, title, faultTreeIds1Name, gradeName, sourceName,
  projectPhase, status, assignerName, proposerName, createDate,
];
// 已办 2 - done
export const issueDoneColumns = [code, title, faultTreeIds1Name, gradeName, sourceName,
  projectPhase, status, assignerName, proposerName, projectDate,
];
// 已发 3 - published (已发布)
export const issuePublishedColumns = [code, title, faultTreeIds1Name, gradeName, sourceName,
  projectPhase, status, assignerName, proposerName, projectDate,
];
// 暂存 4 - temporary
export const issueTemporaryColumns = [code, title, faultTreeIds1Name, gradeName, sourceName,
  projectPhase, status, assignerName, proposerName, projectDate,
];
// 问题检索
export const issueColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, assignerName, proposerName, createDate, projectDate];

// 超期问题
export const overdayColumns = [omit(['fixed'], { ...code, width: 108 }), { ...title, width: 184 }, omit(['sorter'], { ...status, width: 100 }), overdays];

const transformField = (mapping) => (list) => {
  const keys = Object.keys(mapping);
  return list.map((item) => {
    const obj = {};
    keys.forEach((key) => {
      obj[key] = item[mapping[key]];
    });
    return obj;
  });
};

export const transform1 = transformField({ value: 'id', label: 'name' });
export const transform2 = transformField({ value: 'dictValue', label: 'dictName' });
export const transform3 = transformField({ value: 'id', label: 'nameZh' });
export const transform4 = transformField({ value: 'creator', label: 'creatorName' });
export const transform5 = transformField({ value: 'assigner', label: 'assignerName' });
export const transform6 = transformField({ value: 'workflowGroupNameCode', label: 'workflowGroupNameZh' });
export const transform7 = transformField({ value: 'responsibleUserId', label: 'responsibleUserName' });
export const transform8 = transformField({ value: 'advanceUserId', label: 'advanceUserName' });
export const transform9 = transformField({ value: 'id', label: 'vhclProjectNameZh' });

/**
 * 树的转换结构
 */
export const transformTree = treeTransform(transform({
  value: 'id', label: 'name', children: 'children', selectable: (item) => !(item.children && item.children.length),
}));
