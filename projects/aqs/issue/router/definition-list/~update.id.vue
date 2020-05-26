<template>
  <div class="root">
    <!-- 故障基本信息面板 -->
    <basic-fault-information-search-form
      ref="basicFaultInformationSearchForm"
      :merge-data="mergeData"
    />
    <!-- 问题描述面板 -->
    <problem-description-search-from
      ref="problemDescriptionSearchFrom"
      :merge-data="mergeData"
    />
    <!-- 车辆信息面板 -->
    <vehicle-information
      ref="vehicleInformation"
      :vehicle-merge-data="vehicleMergeData"
      :merge-data="mergeData"
      :total="total"
      :asq-issue-rpt-id="asqIssueRptId"
    />
    <!-- 初步分析 -->
    <initial-analysis
      ref="initialAnalysis"
      :merge-data="mergeData"
    />
    <!-- 临时措施 -->
    <temporary-measure
      ref="temporaryMeasures"
      :merge-data="mergeData"
    />
    <!-- 历史故障统计 -->
    <historical-fault-statistics
      ref="historicalFaultStatistics"
      :merge-data="mergeData"
    />
    <!-- 保存 -->
    <div class="operate-buttons">
      <a-button
        :loading="saveLoading"
        :disabled="saveBtn"
        type="primary"
        :style="{ marginRight: '8px' }"
        html-type="submit"
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
        @click="$router.push({ path: '/issue/definition-list' })"
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
    'basic-fault-information-search-form': () => import('../../view/basic-fault-information-search-form.vue'),
    'problem-description-search-from': () => import('../../view/problem-description-search-from.vue'),
    'vehicle-information': () => import('../../view/vehicle-information.vue'),
    'initial-analysis': () => import('../../view/initial-analysis.vue'),
    'temporary-measure': () => import('../../view/temporary-measure.vue'),
    'historical-fault-statistics': () => import('../../view/historical-fault-statistics.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'issue',
      action: ['saveVehicleReport', 'saveAndIrsR', 'getDetailProblemReport', 'saveAllVehicleReport', 'saveAllEdit'],
    }),
  ],
  props: {
    id: {
      type: String,
      default: '',
      required: true,
    },
  },
  data () {
    return {
      saveBtn: false,
      save2Btn: false,
      save2Loading: false,
      saveLoading: false,
      mergeData: {},
      vehicleMergeData: [],
      envAndIfo: {},
      // 工单 +全量
      total: 0,
      asqIssueRptId: '',
    };
  },
  created () {
    /**
     * 点击编辑按钮，拿到id发送给后台，从响应的数据中进行分发
     */
    const { id } = this;
    this.getDetailProblemReport(id).then((res) => {
      this.$store.commit('issue/set', { isEditHand: true });
      this.asqIssueRptId = res.asqIssueRptId;
      if (res.asqIssueDefnData.asqIssueRptType === '3') {
        this.mergeData = res.asqIssueDefnData;
        this.total = res.vhclPageData.total;
      }
      this.mergeData = res.asqIssueDefnData;
      this.vehicleMergeData = res.asqIssueDefnData.asqVchList;
    });
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
        this.mergeData = Object.assign({}, this.mergeData, ...datas);
        if (type === 'save') {
          // 保存
          this.saveLoading = true;
          this.save2Btn = true;
          if (this.mergeData.asqIssueRptType !== '3') {
            this.saveVehicleReport(this.mergeData).then(() => {
              this.$router.push('/issue/definition-list');
            });
          } else {
            // 走全量
            this.mergeData.params = this.$store.state.issue.vehicleInforSearch;
            this.saveAllEdit(this.mergeData).then(() => {
              this.$router.push('/issue/definition-list');
            });
          }
        } else {
          // 保存并IRS立项
          this.save2Loading = true;
          this.saveBtn = true;
          if (this.mergeData.asqIssueRptType !== '3') {
            this.saveVehicleReport(this.mergeData).then((res) => {
              this.saveAndIrsR(res).then((data) => {
                this.$router.push('/issue/definition-list');
                window.open(`/qis/question/question-create/edit/${data.id}`);
              });
            });
          } else {
            this.saveAllEdit(this.mergeData).then((res) => {
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
