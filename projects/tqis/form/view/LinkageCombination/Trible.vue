<template>
  <a-form
    :form="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row :gutter="24">
      <a-col :span="formItemSpan">
        <a-form-item label="所属系统">
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
      <a-col :span="formItemSpan">
        <a-form-item label="所属功能">
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
      <a-col :span="formItemSpan">
        <a-form-item label="故障代码">
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
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

const fields = ['所属系统', '所属功能', '故障代码'];

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
