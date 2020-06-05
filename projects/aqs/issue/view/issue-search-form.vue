<template>
  <a-form-model
    :model="issuSearchForm"
    layout="vertical"
    class="issue-search-form form-column-split-compact form-column-action-right"
  >
    <a-row :gutter="24">
      <!-- 报告编号 -->
      <a-col
        :span="formItemSpan"
      >
        <a-form-model-item :label="$t('issue.asqIssueRptCode')">
          <single-net-select
            v-model="issuSearchForm.asqIssueRptCode"
            :placeholder="$t('form.select')"
            url="/field-q/v1/asqissuedefn/codeList"
            value-by="asqIssueRptCode"
            allow-clear
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- 报告类型 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('issue.asqIssueRptType')">
          <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
          <multiple-net-select
            v-model="issuSearchForm.asqIssueRptType"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_rpt_type"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
          />
        </a-form-model-item>
      </a-col>
      <!-- 问题来源 -->
      <a-col
        :span="formItemSpan"
      >
        <a-form-model-item :label="$t('issue.asqIssueSource')">
          <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
          <multiple-net-select
            v-model="issuSearchForm.asqIssueSource"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_source"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
            :max-tag-count="1"
          />
        </a-form-model-item>
      </a-col>
      <!-- 发布日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('issue.createDate')">
          <a-range-picker
            v-model="issuSearchForm.createDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <!-- 问题分类 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          :label="$t('issue.asqIssueCategory')"
        >
          <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
          <single-net-select
            v-model="issuSearchForm.asqIssueCategory"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_category"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- 祸首件 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          :label="$t('issue.firstCausePart')"
        >
          <!-- @FIXME: 这里的地址不应该放参数，应该封装在order-field里 -->
          <single-net-select
            v-model="issuSearchForm.firstCausePart"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/part/partList"
            order-field="name"
            value-by="id"
            :label-of="(item) => `${item.name}-${item.code}`"
            allow-clear
            search-by="all"
          />
        </a-form-model-item>
      </a-col>
      <!-- 车型 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('issue.vhclSeriesCode')">
          <multiple-net-select
            v-model="issuSearchForm.vhclSeriesCode"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="vhclSeriesCode"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-model-item>
      </a-col>
      <a-col
        class="form-column-action"
        :span="formItemSpan"
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
  </a-form-model>
</template>

<script>
import { RANGE_TO_MAP_BY_FIELD } from '@util/datetime-helper.js';

export default {
  data () {
    return {
      formItemSpan: 6,
      issuSearchForm: {},
    };
  },
  methods: {
    // 重置表单
    resetFormData () {
      this.$set(this, 'issuSearchForm', {});
      this.$store.commit('issue/set', { issueSearchData: {} });
    },
    // 查询已创建的问题报告
    issueSearch () {
      RANGE_TO_MAP_BY_FIELD(this.issuSearchForm, 'createDate');
      const issueSearchData = { ...this.issuSearchForm };
      this.$store.commit('issue/set', { issueSearchData });
    },
  },
};
</script>

<style lang="less" scoped>
  .issue-search-form {
    min-height: 118px;
  }
</style>
