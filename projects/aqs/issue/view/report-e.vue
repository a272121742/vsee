<template>
  <div class="e">
    <a-card
      :title="`E: `+ $t('title.reporttitlE')"
    >
      <p>
        <span class="spantitle">
          {{ $t('issue.hisFaultStatsTitle') }}:
        </span>
        <span
          class="spancontext"
        >
          </br>{{ asqIssueDefnData['hisFaultStats'] }}
        </span>
      </p>
    </a-card>
  </div>
</template>

<script>

export default {
  name: 'ReportE',
  props: {
    id: {
      type: String,
      default: '',
    },
    asqIssueDefnData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
    };
  },
};
</script>
<style lang="less" scoped>
.e{
  margin-top: 1.6%;
}
.ant-card {
  /deep/ .ant-card-head {
    min-height: 42px;
    background-color: rgba(0, 0, 0, 0.09);
    .ant-card-head-title {
      padding: 8px 0;
    }
  }
  p {
    width: calc(100% - 24px);
    margin: 0 12px;

    .spantitle {
      text-align: right;
    }
    .spancontext{
      line-height: 28px;
      flex: 5;
      color: rgba(0, 0, 0, 1);
    }
  }
}
</style>
