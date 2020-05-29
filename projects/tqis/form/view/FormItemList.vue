<template>
  <a-form
    :form="form"
    :hide-required-mark="readOnly"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="隐藏必填">
          <a-switch v-model="readOnly" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <!-- 报告编号 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="报告编号"
        >
          <single-net-select
            v-decorator="['报告编号']"
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
        <a-form-item
          required
          label="报告类型"
        >
          <multiple-net-select
            v-decorator="['报告类型']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_rpt_type"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <!-- 问题属类 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="问题属类"
        >
          <single-net-select
            v-decorator="['问题属类']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_category"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 问题来源 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="问题来源"
        >
          <multiple-net-select
            v-decorator="['问题来源']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_source"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
      <!-- 问题分类 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="问题分类"
        >
          <single-net-select
            v-decorator="[ '问题分类']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=asq_issue_category"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 祸首件 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="祸首件"
        >
          <single-net-select
            v-decorator="['祸首件']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/part/partList?orderField=name"
            value-by="id"
            :label-of="(item) => `${item.name}-${item.code}`"
            allow-clear
            search-by="all"
          />
        </a-form-item>
      </a-col>
      <!-- 车型 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="车型"
        >
          <multiple-net-select
            v-decorator="['车型']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="vhclSeriesCode"
            label-of="vhclSeriesCode"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
      <!-- 车型代码 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="车型代码"
        >
          <single-net-select
            v-decorator="['车型代码']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelCode"
            label-of="vhclModelCode"
            allow-clear
            search-by="code"
          />
        </a-form-item>
      </a-col>
      <!-- 车型名称 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="车型名称"
        >
          <single-net-select
            v-decorator="['车型名称']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelName"
            label-of="vhclModelName"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 服务站 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="服务站"
        >
          <multiple-net-select
            v-decorator="['服务站']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/servicestation/stationList"
            value-by="id"
            :label-of="(item) => `${item.serviceStationShortName}-${item.serviceStationCode}`"
            search-by="all"
            allow-clear
            :max-tag-count="0"
          />
        </a-form-item>
      </a-col>
      <!-- 供应商代码 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="供应商代码"
        >
          <net-auto-complete
            v-decorator="['供应商代码']"
            url="/masterdata/v1/supplier/supplierList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="supplierCode"
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 供应商名称 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="供应商名称"
        >
          <net-auto-complete
            v-decorator="['供应商名称']"
            url="/masterdata/v1/supplier/supplierList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="supplierName"
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 单据状态 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="单据状态"
        >
          <multiple-net-select
            v-decorator="['单据状态']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=claim_order_status"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
      <!-- 故障代码 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="故障代码"
        >
          <single-net-select
            v-decorator="['故障代码']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultCode"
            value-by="faultSignCode"
            label-of="faultSignCode"
            allow-clear
            search-by="code"
          />
        </a-form-item>
      </a-col>
      <!-- 故障现象 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="故障现象"
        >
          <single-net-select
            v-decorator="['故障现象']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultReason"
            value-by="faultSignAnalysis"
            label-of="faultSignAnalysis"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 下线工厂 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="下线工厂"
        >
          <single-net-select
            v-decorator="['下线工厂']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=factory_code"
            value-by="dictName"
            label-of="dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <!-- 颜色名称 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="颜色名称"
        >
          <single-net-select
            v-decorator="['颜色名称']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/colorNameAndCode"
            value-by="colorName"
            label-of="colorName"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 问题级别 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="问题级别"
        >
          <single-net-select
            v-decorator="['问题级别']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=issue_grade"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <!-- 是否再发 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="是否再发"
        >
          <single-net-select
            v-decorator="['是否再发']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=is_recur"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <!-- 发布日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="发布日期"
        >
          <a-range-picker
            v-decorator="['发布日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 生产日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="生产日期"
        >
          <a-range-picker
            v-decorator="['生产日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 销售日期日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="销售日期日期"
        >
          <a-range-picker
            v-decorator="['销售日期日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 维修日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="维修日期"
        >
          <a-range-picker
            v-decorator="['维修日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 出厂日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="出厂日期"
        >
          <a-range-picker
            v-decorator="['出厂日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fileds = ['报告编号', '报告类型', '问题属类', '问题来源', '问题分类', '祸首件', '车型', '车型代码', '车型名称', '服务站', '供应商代码', '供应商名称', '单据状态', '故障代码', '故障现象', '下线工厂', '颜色名称', '问题级别', '发布日期', '生产日期', '销售日期', '维修日期', '出厂日期'];

export default {
  mixins: [formRecordMix('form', fileds)],
  data () {
    return {
      formItemSpan: 6,
      readOnly: false,
    };
  },
};
</script>
