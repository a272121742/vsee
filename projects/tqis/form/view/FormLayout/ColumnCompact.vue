<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    :hide-required-mark="compact"
    :class="{'form-column-split-compact': compact}"
  >
    <a-row :gutter="24">
      <!-- 问题标题 -->
      <a-col :span="formItemSpan * 4">
        <a-form-item label="问题标题">
          <a-input
            v-decorator="['问题标题', {
              rules: compact ? [] : [
                $v.required('请填写问题标题')
              ]
            }]"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 所属系统 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="所属系统"
        >
          <single-net-select
            v-decorator="['所属系统']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/pfscategory?p_id=0&page=1&limit=20&order=&orderField=&ids=&cds=&code=&name=&q="
            value-by="id"
            label-of="name"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 所属功能 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="所属功能"
        >
          <single-net-select
            v-decorator="['所属功能']"
            :placeholder="$t('form.select')"
            :url="`/masterdata/v1/pfscategory?p_id=${formRecord['所属系统']}`"
            :delay="!formRecord['所属系统']"
            :cache="false"
            :disabled="!formRecord['所属系统']"
            value-by="id"
            label-of="name"
            allow-clear
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
            :url="`/masterdata/v1/pfsfault?psId=${formRecord['所属功能']}`"
            :delay="!formRecord['所属功能']"
            :cache="false"
            :disabled="!formRecord['所属功能']"
            value-by="id"
            label-of="name"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 创建日期 -->
      <a-col :span="formItemSpan">
        <a-form-item
          required
          label="创建日期"
        >
          <a-date-picker
            v-decorator="['创建日期']"
            :format="DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 问题描述 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item
          required
          label="问题描述"
        >
          <v-textarea
            v-decorator="['问题描述', {
              rules: compact ? [] : [
                $v.required('请填写问题描述')
              ]
            }]"
            :limit="1000"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 问题备注 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item label="问题备注">
          <v-textarea
            v-decorator="['问题备注']"
            :limit="1000"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fileds = [];

export default {
  mixins: [formRecordMix('form', fileds)],
  props: {
    compact: {
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
