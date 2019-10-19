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
  width: 240,
  scopedSlots: { customRender: 'title' }
};
// 所属系统
const faultTreeIds1Name = {
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1Name',
  width: 160,
  scopedSlots: { customRender: 'faultTreeIds1' }
};
// 问题等级
const gradeName = {
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'gradeName' },
  sorter: true
};
// 问题分类
const sourceName = {
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 120,
  scopedSlots: { customRender: 'sourceName' }
};
// 问题阶段
const projectPhase = {
  title: 'projectPhase',
  dataIndex: 'projectPhaseName',
  width: 120,
  scopedSlots: { customRender: 'projectPhase' }
};
// 解决进度
const status = {
  title: 'status',
  dataIndex: 'status',
  width: 120,
  align: 'center',
  scopedSlots: { customRender: 'status' },
  sorter: true
};
// 立项日期
const projectDate = {
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 150,
  align: 'center',
  sorter: true,
  scopedSlots: { customRender: 'projectDate' },
  customRender (date = '') {
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  }
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
  }
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

// 动态模块缓存的默认数据 MODULE_DYNAMIC_CACHE
export const getModuleDynamicCache = () => ({
  // 选项卡使用（首页/我的问题通用）
  selectTabKey: '1',
  // 查询表单（待办事项/问题检索通用）
  searchData: {},
  // 是否显示高级查询（问题检索）
  showAdvance: false,
  // 是否显示查询表单（待办列表）
  showForm: false,
  // 分页/排序信息（问题检索使用）
  searchOrderData: {},
  searchPageData: { current: 1, pageSize: 10 },
  // 分页/排序信息（待办使用）
  todoOrderData: {},
  todoPageData: { current: 1, pageSize: 10 },
  // 分页/排序信息（待发使用）
  draftOrderData: {},
  draftPageData: { current: 1, pageSize: 10 },
  // 分页/排序信息（已办）
  doneOrderData: {},
  donePageData: { current: 1, pageSize: 10 },
  // 分页/排序信息（已发）
  publishedOrderData: {},
  publishedPageData: { current: 1, pageSize: 10 }
});


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
