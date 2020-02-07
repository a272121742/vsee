import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default {
  state: {
    // 选项卡使用（首页/我的问题通用）
    selectTabKey: '1',
    // 查询表单（待办事项/问题检索通用）
    searchData: {},
    // 查询数据（查询表单的数据经过格式化之后成为查询数据）
    queryData: {},
    // 是否显示高级查询（问题检索）
    showAdvance: false,
    // 是否显示查询表单（待办列表）
    showForm: false,
    // 分页/排序信息（问题检索使用）
    searchOrderData: {},
    searchPageData: { current: 1, pageSize: 10 },
    _t: new Date(),
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
    publishedPageData: { current: 1, pageSize: 10 },
    // advanceSearchFormRecord: {},
    // searchFormAdvanced: false
  },
  getters,
  actions,
  mutations,
};
