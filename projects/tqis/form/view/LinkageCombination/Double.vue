<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="祸首件代码">
          <single-net-select
            v-decorator="['祸首件ID']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/part/partList"
            value-by="id"
            label-of="code"
            allow-clear
          >
          </single-net-select>
        </a-form-item>
      </a-col>
      <a-col :span="formItemSpan">
        <a-form-item label="祸首件名称">
          <single-net-select
            v-decorator="['祸首件ID']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/part/partList"
            value-by="id"
            label-of="name"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fields = ['祸首件代码', '祸首件名称'];

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
