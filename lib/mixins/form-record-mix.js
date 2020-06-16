import { validator } from '@util/formhelper.js';
import { isPlainObject, cloneDeep } from 'lodash';

console.warn('form-record-mix因存在表单验证上的bug，后期将弃用，请采用官方的a-form-model，并配合`import formRecordMix form \'@mix/form-model-record.js\'`方案');

const mapPropsToFields = (vm, fields = [], path) => () => {
  const obj = vm[path] ? vm[path] : vm;
  if (!obj._isVue) {
    const keys = fields.length ? fields : Object.keys(obj);
    const result = {};
    keys.forEach((key) => {
      result[key] = vm.$form.createFormField({ value: obj[key] });
    });
    return result;
  }
  return {};
};

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

export default (formName = 'form', fields = []) => {
  const recordName = `${formName}Record`;
  const record = fields ? fields.reduce((obj, item) => {
    obj[item] = void 0;
    return obj;
  }, {}) : {};
  const cache = {
    loaded: false,
    record,
  };
  return {
    mixins: [validator],
    data () {
      const vm = this;
      vm.mapPropsToFields = mapPropsToFields(vm, fields, recordName);
      const formObject = {};
      const form = vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: (_, values, updateRecord) => {
          const formRecord = vm[recordName];
          const entrys = Object.entries(values || {});
          entrys.forEach((entry) => {
            const key = entry[0];
            const value = entry[1];
            if (value instanceof Array && ((value.includes(void 0) && value.length > 1) || value.length === 1)) {
              const last = value.length - 1;
              if (!formRecord[key]) {
                formRecord[key] = value;
              } else if (value.length === 1 && updateRecord[key] && updateRecord[key].length === value.length) {
                if (isPlainObject(value[0])) {
                  formRecord[key] = [{ ...updateRecord[key][0], ...value[0] }];
                } else {
                  formRecord[key] = value;
                }
              } else if (isPlainObject(value[last])) {
                formRecord[key][last] = { ...updateRecord[key][last], ...value[last] };
              } else {
                formRecord[key][last] = value[last];
              }
            } else {
              formRecord[key] = value === void 0 ? null : value;
            }
          });
        },
      });
      if (!form.clear) {
        Object.defineProperties(form, {
          clear: {
            ...propertiesConfig,
            value: () => {
              vm[recordName] = { };
            },
          },
          reset: {
            ...propertiesConfig,
            value: () => {
              vm[recordName] = cloneDeep(cache.record);
            },
          },
          set: {
            ...propertiesConfig,
            value: (source, cacheIt = false) => {
              const target = vm[recordName];
              vm[formName].update(cloneDeep({ ...target, ...source }), cacheIt);
            },
          },
          update: {
            ...propertiesConfig,
            value: (source, cacheIt = false) => {
              vm[recordName] = cloneDeep({ ...source });
              if (cacheIt) {
                cache.record = cloneDeep({ ...source });
              }
            },
          },
        });
      }
      Object.defineProperties(formObject, {
        [formName]: {
          ...propertiesConfig,
          value: form,
        },
        [recordName]: {
          ...propertiesConfig,
          value: record,
        },
      });
      return formObject;
    },
    watch: {
      [recordName]: {
        deep: true,
        immediate: true,
        handler (value) {
          if (!cache.loaded) {
            cache.loaded = true;
            cache.record = cloneDeep({ ...value });
          }
          if (value) {
            this.$nextTick(this[formName].updateFields);
          }
        },
      },
    },
  };
};
