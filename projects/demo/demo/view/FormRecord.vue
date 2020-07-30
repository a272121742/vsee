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
              initialValue: key,
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
      <a-form-item label="下拉多选">
        <multiple-net-select
          v-decorator="[
            `muselect`, {
            }]"
          label-of="name"
          value-by="name"
          url="/test/list"
          :delay="false"
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

<script>
import formRecordMix from '@mix/form-record-mix.js';

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [formRecordMix('form', ['muselect', 'names', 'checkbox'])],
  data () {
    return {
      checkboxOptions: ['Apple', 'Pear', 'Orange'],
      // formRecord: {
      //   checkbox: ['Apple'],
      //   // test: 'test',
      //   names: ['朝辞白帝彩云间'],
      //   muselect: ['EX2'],
      // },
    };
  },
  created () {
    // console.log(this);
    // this.formRecord.muselect = ['EX2'];
    // this.formRecord = { names: ['123'], test: '123' };
    /**
     * 1. 合并缓存 data.record created.record
     * 2. 独立缓存 created.record
     */
    // this.form.set({ names: ['床前明月光'], test: '123' }, true);
    // this.$nextTick(() => {
    //   // this.formRecord.muselect = ['EX2'];
    this.form.update({ muselect: ['EX2'], names: ['朝辞白帝彩云间'] }, true);
    // });
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
    set () {
      this.$store.commit('s12/update', (store) => {
        store.a = 1;
      });
    },
  },
};
</script>
