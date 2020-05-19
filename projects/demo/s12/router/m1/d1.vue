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
    <a-button @click="reset">
      重置
    </a-button>
    <a-button @click="clear">
      清空
    </a-button>
  </a-form>
</template>

</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';

export default {
  mixins: [formRecordMix('form')],
  data () {
    return {
      checkboxOptions: ['Apple', 'Pear', 'Orange'],
      formRecord: {
        checkbox: ['Apple'],
        // test: 'test',
        // names: ['朝辞白帝彩云间'],
      },
    };
  },
  created () {
    console.log(this);
    // this.formRecord = { names: ['123'], test: '123' };
    /**
     * 1. 合并缓存 data.record created.record
     * 2. 独立缓存 created.record
     */
    // this.form.set({ names: ['床前明月光'], test: '123' }, true);
    setTimeout((res) => {
      this.form.update(res, true);
    }, 2000, { names: ['明月即使有', '把酒问青天'], test: '123' });
  },
  methods: {
    reset () {
      this.form.reset();
    },
    clear () {
      this.form.clear();
    },
    remove (list = [], index) {
      list.splice(index, 1);
    },
    add (list = [], index) {
      list.splice(index, 0, '');
    },
  },
};
</script>
