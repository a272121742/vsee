<template>
  <div>
    <banner
      title="标题"
      desc="说明文件"
    ></banner>
    <a-form :form="form">
      <a-form-item>
        <a-input-number
          v-decorator="['uuid', {
            rules: [{type: 'string', required: true, message: '必填'}]}]"
        >
        </a-input-number>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';

export default {
  components: {
    Banner: () => import('@comp/head/Banner.vue')
  },
  data () {
    return {
      uuid: ''
    };
  },
  created () {
    const { mapPropsToFields, onValuesChange } = this;
    this.form = this.$form.createForm(this, {
      mapPropsToFields,
      onValuesChange
    });
  },
  methods: {
    formatNumber (str) {
      return str.split('').join(' ');
    },
    /**
     * 数据映射
     */
    mapPropsToFields () {
      return createFormFields(this, ['uuid'], 'record');
    },
    /**
     * 监听数据变更
     */
    onValuesChange (props, values) {
      return autoUpdateFileds(this, 'record')(props, values);
    }
  }
};
</script>