<template>
  <a-modal
    :visible="visible"
    :confirm-loading="confirmLoading"
    :title="$t('changePassword.title')"
    style="height:232px;top:140px;"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
    >
      <!-- 原密码 -->
      <a-form-item
        :label="$t('old_password.label')"
        self-update
      >
        <a-input-password
          v-decorator="['password', {
            rules: [{ required: true, message: $t('old_password.required_message')}]
          }]"
          :placeholder="$t('old_password.placeholder')"
        />
      </a-form-item>
      <!-- 新密码 -->
      <a-form-item
        :label="$t('new_password.label')"
        self-update
      >
        <a-input-password
          v-decorator="['newPassword', {
            rules: [{ required: true, message: $t('new_password.required_message')}]
          }]"
          :placeholder="$t('new_password.placeholder')"
        />
      </a-form-item>
      <!-- 确认密码 -->
      <a-form-item
        :label="$t('repeat_password.label')"
        self-update
      >
        <a-input-password
          v-decorator="['repeatPassword', {
            rules: [{
              validator: valiRepeatPassword
            }]
          }]"
          :placeholder="$t('repeat_password.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';
import $ from '@http';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    const vm = this;
    this.mapPropsToFields = mapPropsToFields(vm, ['password', 'newPassword', 'repeatPassword'], 'record');
    return {
      form: vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: autoUpdateFileds(vm, 'record'),
      }),
      // 下层数据
      record: {},
      confirmLoading: false,
    };
  },
  created () {

  },
  methods: {
    // 验证密码相同
    valiRepeatPassword (rule, repeatPassword, callback) {
      const {newPassword} = this.record;
      if (!repeatPassword) {
        callback(new Error(this.$t('repeat_password.required_message')));
      } else if (repeatPassword !== newPassword) {
        callback(new Error(this.$t('repeat_password.unconfirm_message')));
      }
      callback();
    },
    handleOk () {
      this.form.validateFields((err) => {
        if (!err) {
          this.confirmLoading = true;
          const { password, newPassword } = this.record;
          $.put('/sys/user/password', { password, newPassword }).then(() => {
            this.$message.info(this.$t('changePassword.success'));
            this.close();
            this.$store.dispatch('logout');
          }).catch((serverError) => {
            if (serverError) {
              this.$message.error(this.$t(serverError));
            } else {
              this.$message.error(this.$t('changePassword.failure'));
            }
          }).finally(() => {
            this.confirmLoading = false;
          });
        }
      });
    },
    handleCancel () {
      this.close();
    },
    close () {
      console.log('close');
      this.$emit('update:visible', false);
    },
  },
};
</script>
