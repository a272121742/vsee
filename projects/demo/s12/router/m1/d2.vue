<template>
  <a-form
    :form="form"
  >
    <template>
      <a-form-item
        v-for="(key, index) in formRecord.names"
        :key="index"
        :label="`${index}/${key}`"
      >
        <a-input
          v-decorator="[
            `names[${index}]`, {
              preserve: true
            }]"
        />
        <a-icon
          type="plus"
          @click="() => add(formRecord.names, index + 1)"
        />
        <a-icon
          v-if="index"
          type="minus-circle"
          @click="() => remove(formRecord.names, index)"
        />
      </a-form-item>
      <a-form-item
        label="checkbox数组"
      >
        <a-checkbox-group
          v-decorator="[
            `checkbox`, {
            }]"
          :options="checkboxOptions"
        />
      </a-form-item>
      <a-form-item label="日期范围">
        <a-range-picker
          v-decorator="[
            `dataRange`, {
            }]"
        />
      </a-form-item>
      <a-form-item
        :label="'test'"
      >
        <a-input
          v-decorator="[
            `test`, {
            }]"
        />
      </a-form-item>
    </template>
  </a-form>
</template>

</template>

<script>
// import formRecordMix from '@mix/form-record.js';

// export default {
//   mixins: [formRecordMix('form')],
//   data () {
//     return {
//       checkboxOptions: ['Apple', 'Pear', 'Orange'],
//     };
//   },
//   created () {
//     setTimeout((res) => {
//       this.formRecord = { ...res };
//     }, 2000, { names: ['明月即使有', '把酒问青天'] });
//   },
//   methods: {
//     remove (list = [], index) {
//       list.splice(index, 1);
//     },
//     add (list = [], index) {
//       list.splice(index, 0, '');
//     },
//   },
// };
export default {
  data () {
    return {
      // form: {},
      show: false,
      checkboxOptions: ['Apple', 'Pear', 'Orange'],
      formRecord: {
        names: ['窗前明月光', '疑似地上霜', '举头望明月', '低头思故乡'],
        test: 'tes123t',
        checkbox: ['Pear'],
        dataRange: [],
      },
    };
  },
  watch: {
    formRecord: {
      deep: true,
      immediate: true,
      handler () {
        this.$nextTick(() => { this.form && this.form.setFieldsValue && this.form.setFieldsValue(this.formRecord); });
      },
    },
  },
  beforeCreate () {
    // this.mapPropsToFields = () => ({
    //   names: this.$form.createFormField({ value: this.formRecord.names }),
    //   test: this.$form.createFormField({ value: this.formRecord.test }),
    //   checkbox: this.$form.createFormField({ value: this.formRecord.checkbox }),
    //   dataRange: this.$form.createFormField({ value: this.formRecord.dataRange }),
    // });
    this.form = this.$form.createForm(this, {
      onValuesChange: (_, values) => {
        const entrys = Object.entries(values || {});
        entrys.forEach((entry) => {
          const key = entry[0];
          const value = entry[1];
          console.log(value);
          if (value instanceof Array && (value.includes(void 0) && value.length > 1)) {
            console.log('数组操作', values, value);
            this.$set(this.formRecord[key], value.length - 1, value[value.length - 1]);
          } else {
            console.log('对象值操作');
            this.formRecord[key] = value;
          }
        });
      },
    });
    console.log(this.form);

    // 通过setTimeout模拟网络请求
    // setTimeout((res) => {
    //   console.log('res', res);
    //   // this.form.getFieldDecorator('keys', { initialValue: res.names, preserve: true });
    //   this.show = true;
    //   this.$nextTick(() => {
    //     // this.form.setFieldsValue(res);
    //   });
    // }, 0, this.formRecord);
  },
  created () {
    // this.$nextTick(() => { this.form.setFieldsValue(this.formRecord); });
  },
  methods: {
    remove (list = [], index) {
      list.splice(index, 1);
      // this.form.setFieldsValue({ names: list });
      console.log(this.form);
      // this.form.updateFields(this.mapPropsToFields());
      // this.$nextTick(() => { this.form.setFieldsValue(this.formRecord); });
    },
    add (list = [], index) {
      list.splice(index, 0, '');
      // this.form.setFieldsValue({ names: list });
      // this.$nextTick(() => { this.form.setFieldsValue(this.formRecord); });
    },
  },
};
</script>
