<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="下拉单选-祸首件">
          <single-net-select
            v-decorator="['下拉单选']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/part/partList"
            value-by="id"
            label-of="name"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <a-col :span="formItemSpan">
        <a-form-item label="下拉多选-祸首件">
          <multiple-net-select
            v-decorator="['下拉多选']"
            :placeholder="$t('form.select')"
            :max-tag-count="1"
            url="/masterdata/v1/part/partList"
            value-by="id"
            label-of="name"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fields = ['下拉单选', '下拉多选'];

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
