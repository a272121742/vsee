<template>
  <a-modal
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    title="编辑"
  >
    <a-form
      :form="form"
    >
      <a-form-item label="订单名称1">
        <a-input
          v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
        />
      </a-form-item>
      <a-form-item>
        <a-button @click="resetFields">
          重置
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="clearFields">
          清空
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
// import { mapPropsToFields } from '@util/formhelper.js';
import { createNamespacedHelpers } from 'vuex';
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';
import { clearObserver } from '@util/datahelper.js';
const { mapActions } = createNamespacedHelpers('order');

export default {
  props: {
    /**
     * 上层数据是固定不变的，是用于传递给下层组件进行再加工
     */
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visible: false,
      form: null,
      // 下层数据
      record: {}
    };
  },
  watch: {
    // 【策略】监听
    data (data) {
      this.load(clearObserver(data));
    }
  },
  created () {
    const vm = this
    // 【策略】映射
    vm.mapPropsToFields = mapPropsToFields(vm, ['name'], 'record');
    // 【策略】投影
    vm.form = vm.$form.createForm(vm, {
      mapPropsToFields: vm.mapPropsToFields,
      onValuesChange: autoUpdateFileds(vm, 'record')
    });
  },
  methods: {
    ...mapActions([
      'orderEdit',
      'orderAdd'
    ]),
    load (data = {}) {
      // console.log(data)
      this.visible = true;
      this.record = data;
      this.form.updateFields();
    },
    handleOk () {
      if (typeof this.record.id === 'undefined') {
        this.orderAdd(this.record);
      } else {
        const t = this.record;
        const s = { id: t.id, name: t.name }
        this.orderEdit(s);
      }
      this.close();
    },
    handleCancel () {
      this.close();
    },
    // 【策略】重置
    resetFields () {
      this.record = clearObserver(this.data);
      this.form.updateFields();
    },
    // 【策略】清空
    clearFields () {
      this.record = {};
      this.form.resetFields();
    },
    // 关闭事件
    close () {
      this.visible = false;
      this.$emit('close', this.form.getFieldsValue());
    }
  }
};
</script>
