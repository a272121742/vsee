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

    selCreateVehiRepRowKeys: [], // 创建报告页面的
    basicFaultInfList: [],
    problemDescList: [],
    enterVehicleList: [],
    initialAnalysisList: [],
    temporaryMeasuresList: [],
    historicalFaultStatisticsList: [],
  },
  getters,
  actions,
  mutations,
};
