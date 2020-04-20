import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default {
  state: {
    tableRowData: {},
    vehicleInforSearch: {}, // 弹框搜索
    enterVehicleInfFormSearch: {},
    issueSearchData: {},
    selectedVehicleRowKeys: [], // dialogue里面的
    orderRowKeys: [], // 工单创建的 车辆信息 是索赔单号的合集

    selCreateVehiRepRowKeys: [], // 创建报告页面的
    basicFaultInfList: [],
    problemDescList: [],
    enterVehicleList: [],
    initialAnalysisList: [],
    temporaryMeasuresList: [],
    historicalFaultStatisticsList: [],

    isFlag: false, // 判断手工全量是否渲染
    faultFrequency: 0, // 故障频次
  },
  getters,
  actions,
  mutations,
};
