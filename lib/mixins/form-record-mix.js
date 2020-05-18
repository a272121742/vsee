import { clone } from 'ramda';
import { validator } from '@util/formhelper.js';

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
  const formObject = {};
  Object.defineProperties(formObject, {
    [recordName]: {
      value: record,
      ...propertiesConfig,
    },
  });
  return {
    mixins: [validator],
    data () {
      return formObject;
    },
    beforeCreate () {
      Object.defineProperties(this, {
        [formName]: {
          ...propertiesConfig,
          value: this.$form.createForm(this, {
            onValuesChange: (_, values) => {
              const formRecord = this[recordName];
              const entrys = Object.entries(values || {});
              entrys.forEach((entry) => {
                const key = entry[0];
                const value = entry[1];
                if (value instanceof Array && ((value.includes(void 0) && value.length > 1) || value.length === 1)) {
                  const last = value.length - 1;
                  if (!formRecord[key]) {
                    formRecord[key] = value;
                  } else {
                    formRecord[key][last] = value[last];
                  }
                } else {
                  formRecord[key] = value;
                }
              });
            },
          }),
        },
      });
      Object.defineProperties(this[formName], {
        clear: {
          ...propertiesConfig,
          value: () => {
            this.$nextTick(() => {
              this[recordName] = { };
              const form = this[formName];
              form && form.resetFields();
            });
          },
        },
        reset: {
          ...propertiesConfig,
          value: () => {
            this.$nextTick(() => {
              const form = this[formName];
              form && form.resetFields();
              this[recordName] = clone({ ...cache.record });
            });
          },
        },
      });
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
          this.$nextTick(() => {
            const form = this[formName];
            form && form.setFieldsValue(this[recordName]);
          });
        },
      },
    },
  };
};
