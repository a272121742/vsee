<template>
  <div class="centre">
    <!-- 车型 -->
    <p>
      <span>
        {{ $t('issue.vhclSeriesCode') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['vhclSeriesCode'] }}
          </template>
          <span
            class="ellipsis-span"
            style="width:80px"
          >
            {{ asqIssueDefnData['vhclSeriesCode'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 问题来源 -->
    <p>
      <span>
        {{ $t('issue.asqIssueSource') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['issueSourceName'] }}
          </template>
          <span
            class="ellipsis-span"
            style="width:120px"
          >
            {{ asqIssueDefnData['issueSourceName'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 问题属类 -->
    <p>
      <span>
        {{ $t('issue.asqIssueCategory') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['issueCategory'] }}
          </template>
          <span
            class="ellipsis-span"
          >
            {{ asqIssueDefnData['issueCategory'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 祸首件 -->
    <p>
      <span>
        {{ $t('issue.name') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['name'] }}
          </template>
          <span
            class="ellipsis-span"
          >
            {{ asqIssueDefnData['name'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 零件号 -->
    <p>
      <span>
        {{ $t('issue.code') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['code'] }}
          </template>
          <span
            class="ellipsis-span"
          >
            {{ asqIssueDefnData['code'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 供应商 -->
    <p>
      <span>
        {{ $t('issue.supplierId') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['supplierName'] }}
          </template>
          <span
            class="ellipsis-span"
            style="width:120px"
          >
            {{ asqIssueDefnData['supplierName'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
    <!-- 发布时间 -->
    <p>
      <span>
        {{ $t('issue.createDate') }}:
      </span>
      <template>
        <a-tooltip placement="topLeft">
          <template slot="title">
            {{ asqIssueDefnData['createDate'] }}
          </template>
          <span
            class="ellipsis-span"
          >
            {{ asqIssueDefnData['createDate'] }}
          </span>
        </a-tooltip>
      </template>
    </p>
  </div>
</template>

<script>

export default {
  name: 'ReportCentre',
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
.centre{
  font-family: SourceHanSansCN-Medium;
  font-size: 14px;
  color: rgba(0,0,0,0.85);
  text-align: left;
  display: flex;
  justify-content: space-between;
  padding-top: 2.5%;

    p {
      flex:2;
      line-height: 28px;
      display: flex;
      color: rgba(0, 0, 0, 0.65);

      // &:first-child{
      //   flex: 2;
      // }
      // &:nth-child(2){
      //   flex: 3;
      // }

      span:first-child {
        text-align: left;
        // flex:1;
      }
      span:last-child {
        flex: 5;
        margin-left: 4px;
        margin-right: 8px;
        color: rgba(0, 0, 0, 0.85);
      }
      .ellipsis-span{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }

}
</style>
