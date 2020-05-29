<template>
  <a-form
    :form="form"
    :hide-required-mark="true"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row>
      <a-col :span="formItemSpan">
        <a-radio-group
          v-model="formItemSpan"
          button-style="solid"
        >
          <a-radio-button :value="6">
            四列
          </a-radio-button>
          <a-radio-button :value="8">
            三列
          </a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row :gutter="formItemSpan * 2">
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
    };
  },
};
</script>
