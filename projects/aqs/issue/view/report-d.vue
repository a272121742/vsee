<template>
  <div class="d">
    <a-card
      :title="`D: `+ $t('title.reporttitlD')"
    >
      <table>
        <tr>
          <td>{{ $t('issue.tempSolution') }}:</td>
          <td>{{ asqIssueDefnData['tempSolution'] }}</td>
        </tr>
      </table>
    </a-card>
  </div>
</template>
<script>
export default {
  name: 'ReportD',
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
.d{
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
   table {
    width: calc(100% - 24px);
    margin: 0 12px;
    tr {
      width: 100%;
      line-height: 28px;
      display: -webkit-flex;
      display: flex;
      td:first-child {
        // flex: 1;
        text-align: left;
      }
      td:last-child {
        flex: 5;
        width: 410px;
        margin-left: 12px;
        color: rgba(0, 0, 0, 1);
                // word-wrap: break-word;

      }
    }
  }
}
</style>
