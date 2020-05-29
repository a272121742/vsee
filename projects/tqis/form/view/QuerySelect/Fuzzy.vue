<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="提示输入-供应商代码">
          <net-auto-complete
            v-decorator="['提示输入']"
            url="/masterdata/v1/part/partList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="name"
            search-by="name"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fields = ['提示输入'];

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
