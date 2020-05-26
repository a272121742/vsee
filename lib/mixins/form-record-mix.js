import { clone } from 'ramda';
import { validator } from '@util/formhelper.js';

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
                formRecord[key] = value;
              } else {
                formRecord[key][last] = value[last];
              }
            } else {
              formRecord[key] = value;
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
              vm[recordName] = clone(cache.record);
            },
          },
          set: {
            ...propertiesConfig,
            value: (source, cacheIt = false) => {
              const target = vm[recordName];
              vm[formName].update(clone({ ...target, ...source }), cacheIt);
            },
          },
          update: {
            ...propertiesConfig,
            value: (source, cacheIt = false) => {
              vm[recordName] = clone({ ...source });
              if (cacheIt) {
                cache.record = clone({ ...source });
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
            cache.record = clone({ ...value });
          }
          this.$nextTick(this[formName].updateFields);
        },
      },
    },
  };
};
