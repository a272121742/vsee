<template>
  <a-modal
    class="forget-pd-modal"
    :visible="visible"
    style="height:232px;top:140px;"
    :closable="false"
    width="438px"
  >
    <template slot="footer">
      <a-button 
        type="primary" 
        html-type="submit"
        @click="handleOk"
      >
        {{ $t('confirm') }}
      </a-button>
    </template>
    <a-form>
      <a-form-item>
        <a-icon 
          type="exclamation-circle" 
          style="color:#FABE00;"
        >
        </a-icon>
        <span style="font-size:16px;"> {{ $t('forget_confirm_title') }} </span>
      </a-form-item>
      <a-form-item>
        <span style="font-size:16px;"> {{ $t('forgetEmail') }} </span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleOk () {
      this.close();
    },
    close () {
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style>
.forget-pd-modal .ant-modal-body{
  padding: 32px 24px 16px 32px;
  font-size: 16px;
}
.forget-pd-modal .ant-modal-footer {
  border: 0px;
}
</style>