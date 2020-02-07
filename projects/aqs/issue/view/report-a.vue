<template>
  <a-card
    :title="`A: `+ $t('title.reporttitlA')"
  >
    <table>
      <!-- 故障时间 -->
      <tr>
        <td>1. {{ $t('issue.reportFalutDate') }}:</td>
        <td v-if="!asqIssueDefnData['falutDateEnd']">
          {{ asqIssueDefnData['falutDate'] }}
        </td>
        <td v-else>
          {{ asqIssueDefnData['falutDate'] }} ~ {{ asqIssueDefnData['falutDateEnd'] }}
        </td>
      </tr>
      <!-- 问题级别 -->
      <tr>
        <td>2. {{ $t('issue.asqIssueGrade') }}:</td>
        <td>{{ asqIssueDefnData['asqIssueGradeName'] }}</td>
      </tr>
      <!-- 故障现象 -->
      <tr>
        <td>3. {{ $t('issue.faultSignAnalysis') }}:</td>
        <td>{{ asqIssueDefnData['faultSymptom'] }}</td>
      </tr>
      <!-- 所属系统 -->
      <tr>
        <td>4. {{ $t('issue.faultTreeIds1') }}:</td>
        <td>{{ asqIssueDefnData['faultTreeIds1Name'] }}</td>
      </tr>
      <!-- 所属功能 -->
      <tr>
        <td>5. {{ $t('issue.faultTreeIds2') }}:</td>
        <td>{{ asqIssueDefnData['faultTreeIds2Name'] }}</td>
      </tr>
      <!-- 故障代码 -->
      <tr>
        <td>6. {{ $t('issue.faultTreeIds3') }}:</td>
        <td>{{ asqIssueDefnData['faultTreeIds3Name'] }}</td>
      </tr>
      <!-- 故障频次 -->
      <tr>
        <td>7. {{ $t('issue.faultFrequency') }}:</td>
        <td>{{ asqIssueDefnData['faultFrequency'] }}</td>
      </tr>
      <!-- 故障工况 -->
      <tr>
        <td>8. {{ $t('issue.faultCondition') }}:</td>
        <td>{{ asqIssueDefnData['faultCondition'] }}</td>
      </tr>
      <!-- 附件 -->
      <tr>
        <td>9. {{ $t('issue.accessory') }}:</td>
        <td>
          <v-upload
            disabled
            :value="asqIssueDefnData.files"
            download="/oss/ossFile/download"
          >
          </v-upload>
        </td>
      </tr>
    </table>
  </a-card>
</template>

<script>
import attachmentMix from '@mix/attachment.js';

export default {
  name: 'ReportA',
  components: {
    VUpload: () => import('@comp/form/VUpload.vue'),
  },
  mixins: [
    attachmentMix,
  ],
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
      display: flex;
      td:first-child {
        // flex: 1;
        text-align: right;
      }
      td:last-child {
        flex: 5;
        margin-left: 12px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
</style>
