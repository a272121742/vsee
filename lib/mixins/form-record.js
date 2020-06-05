/**
 *  表单混入器
 */
import { mapPropsToFields, autoUpdateFileds, validator } from '@util/formhelper.js';

console.error('`form-record`即将弃用，请使用`import formRecordMix form \'@mix/form-record-mix.js\'`代替');

export default (formName = 'form', fields) => {
  const recordName = `${formName}Record`;
  const record = fields ? fields.reduce((obj, item) => {
    obj[item] = void 0;
    return obj;
  }, {}) : {};
  const cache = {
    record,
  };
  return {
    mixins: [validator],
    data () {
      const vm = this;
      vm.mapPropsToFields = mapPropsToFields(vm, fields, recordName);
      const onValuesChange = autoUpdateFileds(vm, recordName);
      const form = vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange,
      });
      form.clear = () => {
        vm.$nextTick(() => {
          vm[recordName] = { ...record };
        });
      };
      form.reset = () => {
        vm.$nextTick(() => {
          vm[recordName] = { ...cache.record };
        });
      };
      return {
        [formName]: form,
        [recordName]: {
          ...record,
        },
      };
    },
    mounted () {
      this.$nextTick(() => {
        cache.record = { ...this[recordName] };
      });
    },
    watch: {
      [recordName]: {
        deep: true,
        immediate: true,
        handler () {
          this.$nextTick(this[formName].updateFields);
        },
      },
    },
  };
};
