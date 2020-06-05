<template>
  <a-form
    :form="form"
    :hide-required-mark="false"
    layout="inline"
    self-update
    :class="{'form-column-align': align}"
  >
    <a-row :gutter="12">
      <!-- 问题标题 -->
      <a-col :span="formItemSpan * 4">
        <a-form-item
          required
          label="问题标题"
        >
          <a-input
            v-decorator="['问题标题', { rules: [ $v.required('必须填写') ] }]"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 问题责任详细描述 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item
          required
          label="问题责任详细描述"
        >
          <v-textarea
            v-decorator="['问题责任详细描述']"
            :limit="1000"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 问题备注 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item
          required
          label="问题备注"
        >
          <v-textarea
            v-decorator="['问题备注']"
            :limit="1000"
            allow-clear
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
      <!-- 最后更新时间 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="最后更新时间"
        >
          <a-range-picker
            v-decorator="['最后更新时间']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 车型 -->
      <a-col :span="formItemSpan * 3">
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
      <a-col :span="formItemSpan * 3">
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
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fileds = ['问题标题', '报告编号', '报告类型', '问题属类', '问题来源', '问题分类', '祸首件', '车型', '车型代码', '车型名称', '服务站', '供应商代码', '供应商名称', '单据状态', '故障代码', '故障现象', '下线工厂', '颜色名称', '问题级别', '发布日期', '生产日期', '销售日期', '维修日期', '出厂日期'];

export default {
  mixins: [formRecordMix('form', fileds)],
  props: {
    align: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      formItemSpan: 6,
    };
  },
};
</script>
