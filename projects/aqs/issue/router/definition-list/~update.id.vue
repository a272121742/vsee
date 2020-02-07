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
        @click="$router.push({ path: '/issue/definition-list' })"
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
    'basic-fault-information-search-form': () => import('../../view/basic-fault-information-search-form.vue'),
    'problem-description-search-from': () => import('../../view/problem-description-search-from.vue'),
    'vehicle-information': () => import('../../view/vehicle-information.vue'),
    'initial-analysis': () => import('../../view/initial-analysis.vue'),
    'temporary-measure': () => import('../../view/temporary-measure.vue'),
    'historical-fault-statistics': () => import('../../view/historical-fault-statistics.vue'),
  },
  props: {
    id: {
      type: String,
      default: '',
      required: true,
    },
  },
  data () {
    return {
      mergeData: {},
      vehicleMergeData: [],
      envAndIfo: {},
    };
  },
  created () {
    const { id } = this;
    this.getDetailProblemReport(id).then((res) => {
      this.mergeData = res.asqIssueDefnData;
      this.vehicleMergeData = res.asqIssueDefnData.asqVchList;
    });
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
        this.mergeData = Object.assign({}, this.mergeData, ...datas);
        if (type === 'save') {
          this.saveVehicleReport(this.mergeData).then(() => {
            this.$router.push('/issue/definition-list');
          });
        } else {
          this.saveVehicleReport(this.mergeData).then((res) => {
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
