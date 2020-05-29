<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="远程搜索-单选-车型">
          <single-net-select
            v-decorator="['下拉单选']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="vhclSeriesCode"
            label-of="vhclSeriesCode"
            search-by="name"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="formItemSpan">
        <a-form-item label="远程搜索-多选-车型">
          <multiple-net-select
            v-decorator="['下拉多选']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="vhclSeriesCode"
            label-of="vhclSeriesCode"
            search-by="name"
            allow-clear
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fields = ['下拉单选', '下单多选'];

export default {
  mixins: [
    formRecordMix('form', fields),
  ],
  data () {
    return {
      formItemSpan: 6,
    };
  },
};
</script>
