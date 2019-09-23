import moment from 'moment';

// 问题编号
const code = {
  title: 'code',
  dataIndex: 'code',
  width: 130,
  fixed: true,
  scopedSlots: { customRender: 'code' }
};
// 标题
const title = {
  title: 'title',
  dataIndex: 'title',
  width: 200,
  scopedSlots: { customRender: 'title' }
};
// 所属系统
const faultTreeIds1Name = {
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1Name',
  width: 130,
  scopedSlots: { customRender: 'faultTreeIds1' }
};
// 问题等级
const gradeName = {
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 150,
  scopedSlots: { customRender: 'gradeName' },
  align: 'center',
  sorter: true
};
// 问题分类
const sourceName = {
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 140,
  scopedSlots: { customRender: 'sourceName' }
};
// 问题阶段
const projectPhase = {
  title: 'projectPhase',
  dataIndex: 'projectPhase',
  width: 140,
  scopedSlots: { customRender: 'projectPhase' }
};
// 解决进度
const status = {
  title: 'status',
  dataIndex: 'status',
  width: 110,
  scopedSlots: { customRender: 'status' },
  align: 'center',
  sorter: true
};
// 立项日期
const projectDate = {
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 150,
  scopedSlots: { customRender: 'projectDate' },
  align: 'center',
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  }
};
// 接受日期
const receiveDate = {
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 150,
  scopedSlots: { customRender: 'receiveDate' },
  align: 'center',
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  }
};
// 创建日期
const createDate = {
  title: 'createDate',
  dataIndex: 'createDate',
  width: 150,
  scopedSlots: { customRender: 'createDate' },
  align: 'center',
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  }
};


// 待办 1 - todo
export const issueTodoColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, projectDate, receiveDate];
// 待发 0 - draft (草稿)
export const issueDraftColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, createDate];
// 已办 2 - done
export const issueDoneColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, projectDate];
// 已发 3 - published (已发布)
export const issuePublishedColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, projectDate];
// 问题检索
export const issueColumns = [code, title, faultTreeIds1Name, gradeName, sourceName, projectPhase, status, createDate, projectDate];


const transformField = mapping => list => {
  const keys = Object.keys(mapping);
  return list.map(item => {
    const obj = {};
    keys.forEach(key => {
      obj[key] = item[mapping[key]];
    });
    return obj;
  });
};

export const transform1 = transformField({ value: 'id', label: 'name' });
export const transform2 = transformField({ value: 'dictValue', label: 'dictName' });
export const transform3 = transformField({ value: 'id', label: 'nameZh' });
