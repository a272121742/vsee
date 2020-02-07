<template>
  <div class="root">
    <!-- 故障基本信息面板 -->
    <basic-fault-information-search-form ref="basicFaultInformationSearchForm" />
    <!-- 问题描述面板 -->
    <problem-description-search-from ref="problemDescriptionSearchFrom" />
    <!-- 车辆信息面板 -->
    <vehicle-information ref="vehicleInformation" />
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
        @click="save('save')"
      >
        {{ $t('action.save') }}
      </a-button>
      <a-button
        type="primary"
        :style="{ marginRight: '8px' ,padding:'0'}"
        @click="save"
      >
        {{ $t('action.save2project') }}
      </a-button>
      <a-button
        @click="$router.push({ path: fromPath })"
      >
        {{ $t('action.back') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('issue');
export default {
  components: {
    'basic-fault-information-search-form': () => import('./basic-fault-information-search-form.vue'),
    'problem-description-search-from': () => import('./problem-description-search-from.vue'),
    'vehicle-information': () => import('./vehicle-information.vue'),
    'initial-analysis': () => import('./initial-analysis.vue'),
    'temporary-measure': () => import('./temporary-measure.vue'),
    'historical-fault-statistics': () => import('./historical-fault-statistics.vue'),
  },
  props: {
    /**
     * 单车或批量
     */
    asqIssueRptType: {
      type: String,
      required: true,
      validator (value) {
        return ~['1', '2'].indexOf(value);
      },
    },
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
    /**
     * 点击编辑按钮，拿到id发送给后台，从响应的数据中进行分发
     */
    const { id } = this;
    if (id !== undefined) {
      this.getDetailProblemReport(id).then((res) => {
        this.mergeData = res.asqIssueDefnData;
        this.vehicleMergeData = res.asqIssueDefnData.asqVchList;
      });
    }
  },
  methods: {
    ...mapActions(['saveVehicleReport', 'saveAndIrsR', 'getDetailProblemReport']),

    save (type) {
      Promise.all([
        this.$refs.basicFaultInformationSearchForm.getData(),
        this.$refs.problemDescriptionSearchFrom.getData(),
        this.$refs.initialAnalysis.getData(),
        this.$refs.temporaryMeasures.getData(),
        this.$refs.historicalFaultStatistics.getData(),
        this.$refs.vehicleInformation.getData(),
      ]).then((datas) => {
        const mergeData = Object.assign({}, ...datas, { asqIssueRptType: this.asqIssueRptType }, { isHandmade: this.isHandmade }, { optCounter: 0 });
        if (type === 'save') {
          this.saveVehicleReport(mergeData).then(() => {
            this.$router.push('/issue/definition-list');
          });
        } else {
          // 保存并IRS立项
          this.saveVehicleReport(mergeData).then((res) => {
            this.saveAndIrsR(res).then((data) => {
              this.$router.push('/issue/definition-list');
              window.open(`/qis/question/question-create/edit/${data.id}`);
            });
          });
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
