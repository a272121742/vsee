<template>
  <div class="root">
    <a-form
      :form="issuSearchForm"
      layout="vertical"
      self-update
      class="col-layout-form col-layout-search-form"
    >
      <a-row :gutter="24">
        <!-- 报告编号 -->
        <a-col
          :span="formItemSpan"
        >
          <a-form-item :label="$t('issue.asqIssueRptCode')">
            <single-net-select
              v-decorator="['asqIssueRptCode']"
              :placeholder="$t('form.select')"
              url="/field-q/v1/asqissuedefn/codeList"
              value-by="asqIssueRptCode"
              :label-of="(item) => item.asqIssueRptCode"
              allow-clear
              search-by="name"
            />
          </a-form-item>
        </a-col>
        <!-- 报告类型 -->
        <a-col :span="formItemSpan">
          <a-form-item :label="$t('issue.asqIssueRptType')">
            <multiple-net-select
              v-decorator="['asqIssueRptType']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=asq_issue_rpt_type"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-item>
        </a-col>
        <!-- 问题来源 -->
        <a-col
          :span="formItemSpan"
        >
          <a-form-item :label="$t('issue.asqIssueSource')">
            <multiple-net-select
              v-decorator="['asqIssueSource']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=asq_issue_source"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
              :max-tag-count="1"
            />
          </a-form-item>
        </a-col>
        <!-- 发布日期 -->
        <a-col :span="formItemSpan">
          <a-form-item :label="$t('issue.createDate')">
            <a-range-picker
              v-decorator="['createDate']"
            />
          </a-form-item>
        </a-col>
        <!-- 问题分类 -->
        <a-col :span="formItemSpan">
          <a-form-item
            :label="$t('issue.asqIssueCategory')"
          >
            <single-net-select
              v-decorator="[
                'asqIssueCategory'
              ]"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=asq_issue_category"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <!-- 祸首件 -->
        <a-col :span="formItemSpan">
          <a-form-item
            :label="$t('issue.firstCausePart')"
          >
            <single-net-select
              v-decorator="[
                'firstCausePart']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/part/partList?orderField=name"
              value-by="id"
              :label-of="(item) => item.name+'-'+item.code"
              allow-clear
              search-by="all"
            />
          </a-form-item>
        </a-col>
        <!-- 车型 -->
        <a-col :span="formItemSpan">
          <a-form-item :label="$t('issue.vhclSeriesCode')">
            <multiple-net-select
              v-decorator="['vhclSeriesCode']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicleseries/seriesCodeList"
              value-by="vhclSeriesCode"
              :label-of="(item) => item.vhclSeriesCode"
              allow-clear
              search-by="name"
              :max-tag-count="1"
            />
          </a-form-item>
        </a-col>
        <a-col
          :span="formItemSpan"
          :style="{ textAlign: 'right', marginTop: '23px' }"
        >
          <a-button
            type="primary"
            html-type="submit"
            @click="issueSearch"
          >
            {{ $t('action.find') }}
          </a-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            @click="resetFormData"
          >
            {{ $t('action.reset') }}
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import formRecordMix from '@mix/form-record.js';
import timeFormatMix from '@mix/time-format.js';

const fileds = ['asqIssueRptCode', 'asqIssueRptType', 'asqIssueSource', 'createDate', 'asqIssueCategory', 'firstCausePart', 'vhclSeriesCode'];

export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },

  mixins: [
    formRecordMix('issuSearchForm', fileds),
    timeFormatMix,
  ],
  data () {
    return {
      formItemSpan: 6,
    };
  },

  methods: {
    // 重置表单
    resetFormData () {
      this.issuSearchForm.reset();
      this.$store.commit('issue/set', { issueSearchData: {} });
    },
    // 查询已创建的问题报告
    issueSearch () {
      this.transformMomentDate(this.issuSearchFormRecord, 'createDate');
      const issueSearchData = { ...this.issuSearchFormRecord };
      this.$store.commit('issue/set', { issueSearchData });
    },

  },
};
</script>

<style lang="less" scoped>
.root{
  .ant-btn{
    width:65px;
 }
}
</style>
