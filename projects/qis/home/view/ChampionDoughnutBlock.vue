<template>
  <a-card
    :bordered="false"
  >
    <template #title>
      {{ $t('champion_block.title') }}
      <a-badge
        :count="total"
        show-zero
        :offset="[0, -2]"
        :number-style="{backgroundColor: 'rgba(0,0,0,0.09)', color: 'rgba(0,0,0,0.85)'}"
      />
    </template>
    <div class="chart-panel">
      <div class="chart-status">
        {{ $t('champion_block.unclose') }}
      </div>
      <div class="chart-size">
        <span>{{ unCloseNumber }}</span> {{ $t('champion_block.count') }}
      </div>
    </div>
    <ratio-graph
      :data="data"
      :title="$t('champion_block.fail_ratio')"
      :ratio="ratio"
    >
    </ratio-graph>
  </a-card>
</template>

<i18n>
{
  "zh": {
    "champion_block": {
      "title": "责任被分配",
      "unclose": "未关闭",
      "closeNumber": "关闭数",
      "unCloseNumber": "未关闭数",
      "fail_ratio": "关闭率",
      "count": "个"
    }
  },
  "en": {
    "champion_block": {
      "title": "Assigned Issue",
      "unclose": "Unclose",
      "closeNumber": "Closed",
      "unCloseNumber": "Unclose",
      "fail_ratio": "Fail Ratio",
      "count": " "
    }
  }
}
</i18n>

<script>
import { map, omit } from 'ramda';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('home');

export default {
  components: {
    RatioGraph: () => import('./RatioGraph.vue'),
  },
  data () {
    return {
      data: [],
      ratio: 0,
      unCloseNumber: 0,
      total: 0,
    };
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler () {
        this.fetch();
      },
    },
  },
  methods: {
    ...mapActions(['championCount']),
    init () {
      this.fetch();
    },
    fetch () {
      const user = this.$store.getters.getUser();
      this.championCount({ userId: user.id }).then(this.load);
    },
    load (data = {}) {
      const res = map((item) => parseInt(item, 10), omit(['sumNumber'], data));
      this.total = (res.unCloseNumber + res.closeNumber);
      const $t = this.$t.bind(this);
      this.data = Object.entries(res).map((item) => ({
        name: $t(`champion_block.${item[0]}`),
        value: parseInt(item[1], 10),
      }));
      this.ratio = this.total <= 0 ? 0 : parseInt((res.closeNumber * 100) / (res.unCloseNumber + res.closeNumber), 10);
      this.unCloseNumber = res.unCloseNumber;
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-card {
    /deep/ .ant-card-head {
      min-height: unset;
      border-bottom: unset;
      .ant-card-head-title {
        line-height: 1;
        padding-bottom: 0;
      }
    }
    /deep/ .ant-card-body {
      padding: 0 12px 12px;
      width: 288px;
      height: 188px;
    }
    .chart-panel {
      position: absolute;
      left: 24px;
      top: 48px;
    }
    .chart-status {
      font-size: 12px;
      color: rgba(0,0,0,0.45);
    }
    .chart-size {
      color: #13C2C2;
      font-size: 16px;
      span {
        font-size: 32px;
        line-height: 1.2;
        font-weight: bold;
      }
    }
  }
</style>
