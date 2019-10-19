<!--<template>-->
<!--  <a-form-->
<!--    :form="form"-->
<!--  >-->
<!--    <a-form-item label="订单名称">-->
<!--      <a-input-->
<!--        v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"-->
<!--      />-->
<!--    </a-form-item>-->
<!--    <a-form-item>-->
<!--      <a-button @click="resetFields">-->
<!--        重置-->
<!--      </a-button>-->
<!--    </a-form-item>-->
<!--    <a-form-item>-->
<!--      <a-button @click="clearFields">-->
<!--        清空-->
<!--      </a-button>-->
<!--    </a-form-item>-->
<!--  </a-form>-->
<!--</template>-->

<!--<script>-->
<!--import { mapPropsToFields } from '@util/formhelper.js';-->
<!--import { createNamespacedHelpers } from 'vuex';-->
<!--const { mapActions } = createNamespacedHelpers('order');-->

<!--export default {-->
<!--  props: {-->
<!--    /**-->
<!--     * 上层数据是固定不变的，是用于传递给下层组件进行再加工-->
<!--     */-->
<!--    id: {-->
<!--      type: String,-->
<!--      default: String-->
<!--    }-->
<!--  },-->
<!--  data () {-->
<!--    const vm = this;-->
<!--    vm.mapPropsToFields = mapPropsToFields(vm, ['name'], 'record');-->
<!--    return {-->
<!--      form: vm.$form.createForm(vm, {-->
<!--        mapPropsToFields: vm.mapPropsToFields-->
<!--      }),-->
<!--      // 下层数据-->
<!--      record: {}-->
<!--    };-->
<!--  },-->
<!--  // created () {-->
<!--  //   // 【策略】映射-->
<!--  //   this.mapPropsToFields = mapPropsToFields(this, ['name'], 'record');-->
<!--  //   // 【策略】投影-->
<!--  //   this.form = this.$form.createForm(this, {-->
<!--  //     mapPropsToFields: this.mapPropsToFields-->
<!--  //   });-->
<!--  // },-->
<!--  created () {-->
<!--    // this.init();-->
<!--  },-->
<!--  activated () {-->
<!--    this.init();-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions([-->
<!--      'getOrder'-->
<!--    ]),-->
<!--    init () {-->
<!--      console.log('id')-->
<!--      this.getOrder(this.id).then(order => {-->
<!--        this.record = order;-->
<!--        this.form.updateFields(order);-->
<!--      });-->
<!--    },-->
<!--    load (data = {}) {-->
<!--      this.visible = true;-->
<!--      this.record = data;-->
<!--      this.form.updateFields(data);-->
<!--    },-->
<!--    handleOk () {-->
<!--      this.close();-->
<!--    },-->
<!--    handleCancel () {-->
<!--      this.close();-->
<!--    },-->
<!--    // 【策略】重置-->
<!--    resetFields () {-->
<!--      this.form.updateFields(this.data);-->
<!--    },-->
<!--    // 【策略】清空-->
<!--    clearFields () {-->
<!--      this.form.resetFields();-->
<!--    },-->
<!--    // 关闭事件-->
<!--    close () {-->
<!--      console.log('关闭弹窗');-->
<!--      this.visible = false;-->
<!--      this.$emit('close', this.form.getFieldsValue());-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
