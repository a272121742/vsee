<template>
  <div class="container">
    <a-card
      :title="`F: `+ $t('title.reporttitlF')"
    >
      <!-- <a-row
        :gutter="24"
        style="margin: 15px 0 40px"
      >
        <a-input-number
          v-decorator="['number']"
          :placeholder="$t('请输入单位为万公里')"
          autocomplete="off"
          allow-clear
          style="width: 20%;margin:0 15px 0 0"
        />
        <a-button
          type="primary"
        >
          {{ $t('action.search') }}
        </a-button>
      </a-row> -->
    </a-card>
  </div>
</template>

<script>

export default {
  name: 'ReportF',
  components: {
    // 'bar-graph': () => import('./bar-graph.vue'),
  },
  filters: {
    /**
     * 过滤`X轴`或`Y轴`数据
     */
    filterType (obj, type) {
      const keys = Object.keys(obj);
      const axis = keys.find((key) => key.indexOf(type) === key.length - 1);
      return obj[axis] || [];
    },
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    orderAboutData: {
      type: Array,
      default: () => ({}),
    },
  },
};
</script>
<style lang="less" scoped>
 .container {
   margin-top: 16px;
    .row1 {
      .ant-card {
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12)!important;
      }
    }
  }
.ant-card {
  /deep/ .ant-card-head {
    min-height: 42px;
    background-color: rgba(0, 0, 0, 0.09);
    .ant-card-head-title {
      padding: 8px 0;
    }
  }
}
</style>
