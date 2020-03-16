<template>
  <div class="root">
    <!-- 故障基本信息面板 -->
    <basic-fault-information-search-form
      ref="basicFaultInformationSearchForm"
      :result-data="resultData"
      :no-result-data="noResultData"
    />
    <!-- 问题描述面板 -->
    <problem-description-search-from
      ref="problemDescriptionSearchFrom"
      :result-data="resultData"
      :no-result-data="noResultData"
    />
    <!-- 车辆信息面板 -->
    <vehicle-information
      ref="vehicleInformation"
      :result-data="resultData"
      :no-result-data="noResultData"
      :params-map="paramsMap"
    />
    <!-- 初步分析 -->
    <initial-analysis ref="initialAnalysis" />
    <!-- 临时措施 -->
    <temporary-measure ref="temporaryMeasures" />
    <!-- 历史故障统计 -->
    <historical-fault-statistics ref="historicalFaultStatistics" />
    <!-- 保存 -->
    <div class="operate-buttons">
      <a-button
        type="primary"
        :style="{ marginRight: '8px' }"
        html-type="submit"
        :loading="saveLoading"
        :disabled="saveBtn"
        @click="save('save')"
      >
        {{ $t('action.save') }}
      </a-button>
      <a-button
        :loading="save2Loading"
        :disabled="save2Btn"
        type="primary"
        :style="{ marginRight: '8px' ,padding:'0'}"
        @click="save"
      >
        {{ $t('action.save2project') }}
      </a-button>
      <a-button
        :disabled="saveBtn || save2Btn"
        @click="$router.push({ path: fromPath })"
      >
        {{ $t('action.back') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';

export default {
  components: {
    'basic-fault-information-search-form': () => import('./basic-fault-information-search-form.vue'),
    'problem-description-search-from': () => import('./problem-description-search-from.vue'),
    'vehicle-information': () => import('./vehicle-information.vue'),
    'initial-analysis': () => import('./initial-analysis.vue'),
    'temporary-measure': () => import('./temporary-measure.vue'),
    'historical-fault-statistics': () => import('./historical-fault-statistics.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'issue',
      action: ['saveVehicleReport', 'saveAndIrsR', 'getDetailProblemReport', 'saveAllVehicleReport', 'getAllReporterData', 'getReporterData', 'saveAllhandReport'],
    }),
  ],
  props: {
    /**
     * 单车或批量  全量
     */
    // asqIssueRptType: {
    //   type: String,
    //   required: true,
    //   validator (value) {
    //     console.log('全量吗内容', value);
    //     return ~['1', '2', '3'].indexOf(value);
    //   },
    // },
    /**
     * 手工或工单 */
    isHandmade: {
      type: String,
      required: true,
      validator (value) {
        return ~['1', '0'].indexOf(value);
      },
    },
  },
  data () {
    return {
      saveBtn: false,
      save2Btn: false,
      save2Loading: false,
      saveLoading: false,
      // 全选进来 响应的数据
      paramsMap: {},
      resultData: [],
      // 非全选进来 响应的数据
      noResultData: [],
    };
  },
  computed: {
    fromIssue () {
      return this.isHandmade === '1';
    },
    fromPath () {
      return this.fromIssue ? '/issue/definition-list' : '/order';
    },
  },
  created () {
    console.log('登录的信息', this.$store.state.userInfo);

    /**
     * 售后工单创建报告  拿到后台响应的数据
     */
    if (this.$route.path.startsWith('/order')) {
      if (!this.$route.query.orderFlag) {
        this.getReporterData({ ids: this.$route.query.ids }).then((res) => {
          this.noResultData = res;
        });
      } else {
        this.getAllReporterData(this.$route.query).then((res) => {
          this.paramsMap = res.paramsMap;
          this.resultData = res.resultData;
          this.asqIssueRptType = res.paramsMap.asqIssueRptType;
        });
      }
    }
  },
  methods: {
    save (type) {
      Promise.all([
        this.$refs.basicFaultInformationSearchForm.getData(),
        this.$refs.problemDescriptionSearchFrom.getData(),
        this.$refs.initialAnalysis.getData(),
        this.$refs.temporaryMeasures.getData(),
        this.$refs.historicalFaultStatistics.getData(),
        this.$refs.vehicleInformation.getData(),
      ]).then((datas) => {
        const mergeData = Object.assign({}, ...datas, { asqIssueRptType: this.$route.query.asqIssueRptType }, { isHandmade: this.isHandmade }, { optCounter: 0 });
        if (type === 'save') {
          // 保存
          this.saveLoading = true;
          this.save2Btn = true;
          if (this.$route.query.orderFlag) {
            // 工单全量
            this.saveAllVehicleReport({ ...mergeData, params: { ...this.paramsMap, ...mergeData.params } }).then(() => {
              this.$router.push('/issue/definition-list');
            });
          } else if (mergeData.handAllFlag) {
            // 手工全量
            this.saveAllhandReport({ ...mergeData }).then(() => {
              this.$router.push('/issue/definition-list');
            });
          } else {
            // 其他情况
            this.saveVehicleReport(mergeData).then(() => {
              this.$router.push('/issue/definition-list');
            });
          }
        } else {
          // 保存并IRS立项
          this.save2Loading = true;
          this.saveBtn = true;
          if (this.$route.query.orderFlag) {
            this.saveAllVehicleReport({ ...mergeData, params: { ...this.paramsMap, ...mergeData.params } }).then((res) => {
              this.saveAndIrsR(res).then((data) => {
                this.$router.push('/issue/definition-list');
                window.open(`/qis/question/question-create/edit/${data.id}`);
              });
            });
          } else if (mergeData.handAllFlag) {
            this.saveAllhandReport({ ...mergeData }).then((res) => {
              this.saveAndIrsR(res).then((data) => {
                this.$router.push('/issue/definition-list');
                window.open(`/qis/question/question-create/edit/${data.id}`);
              });
            });
          } else {
            this.saveVehicleReport(mergeData).then((res) => {
              this.saveAndIrsR(res).then((data) => {
                this.$router.push('/issue/definition-list');
                window.open(`/qis/question/question-create/edit/${data.id}`);
              });
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.root {
  .operate-buttons {
    text-align: center;
    .ant-btn {
      width: 120px;
    }
  }
}
</style>
