<template>
  <a-col :span="6">
    <a-form
      :form="form"
      :label-col="{span: 8}"
      :wrapper-col="{span: 16}"
      self-update
      :validate-messages="validateMessages"
    >
      <a-form-item
        label="input1"
        has-feedback
      >
        <a-input
          v-decorator="['a1', {
            rules: [
              $v.required(),
              $v.remote('/remote/vali?value={{value}}'),
            ]
          }]"
        >
        </a-input>
      </a-form-item>
      <a-form-item
        label="input2"
        has-feedback
      >
        <a-input
          v-decorator="['a2', {
            rules: [
              $v.required(),
              $v.equal(record.a1, '两次输入不一致，目标值为{{value}}'),

            ]
          }]"
        >
        </a-input>
      </a-form-item>
    </a-form>
    {{ $options.abcd }}
  </a-col>
</template>

<script>
import { createFormFields, autoUpdateFileds, validator } from '@util/formhelper.js';

export default {
  components: {
    // Banner: () => import('@comp/head/Banner.vue')
  },
  mixins: [validator],
  data () {
    return {
      record: {a1:undefined},
      uuid: '',
      validateMessages: {
        default: 'Validation error on field %s',
        required: '%s 必填',
        enum: '%s must be one of %s',
        whitespace: '%s cannot be empty',
        date: {
          format: '%s date %s is invalid for format %s',
          parse: '%s date could not be parsed, %s is invalid ',
          invalid: '%s date %s is invalid',
        },
        types: {
          string: '%s is not a %s',
          method: '%s is not a %s (function)',
          array: '%s is not an %s',
          object: '%s is not an %s',
          number: '%s is not a %s',
          date: '%s is not a %s',
          boolean: '%s is not a %s',
          integer: '%s is not an %s',
          float: '%s is not a %s',
          regexp: '%s is not a valid %s',
          email: '%s is not a valid %s',
          url: '%s is not a valid %s',
          hex: '%s is not a valid %s',
        },
        string: {
          len: '%s must be exactly %s characters',
          min: '%s must be at least %s characters',
          max: '%s cannot be longer than %s characters',
          range: '%s must be between %s and %s characters',
        },
        number: {
          len: '%s must equal %s',
          min: '%s cannot be less than %s',
          max: '%s cannot be greater than %s',
          range: '%s must be between %s and %s',
        },
        array: {
          len: '%s must be exactly %s in length',
          min: '%s cannot be less than %s in length',
          max: '%s cannot be greater than %s in length',
          range: '%s must be between %s and %s in length',
        },
        pattern: {
          mismatch: '%s value %s does not match pattern %s',
        },
        clone () {
          const cloned = JSON.parse(JSON.stringify(this));
          cloned.clone = this.clone;
          return cloned;
        },
      }
    };
  },
  created () {
    const { mapPropsToFields, onValuesChange, validateMessages } = this;
    this.form = this.$form.createForm(this, {
      mapPropsToFields,
      onValuesChange,
      validateMessages
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