<template>
  <a-modal
    class="force-changepd-model"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :title="$t('changePassword.title')"
    style="height:232px;top:140px;"
    :closable="false"
    width="600px"
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
    <a-form
      :form="form"
      :layout="formLayout"
    >
      <a-form-item>
        <div class="force-change-tip-class">
          <span>{{ $t('tip') }}</span>
        </div>
      </a-form-item>
      <!-- 新密码 -->
      <a-form-item
        :label="$t('newPd.label')"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        self-update
      >
        <a-input-password
          v-decorator="['newPd', {
            rules: [
              $v.required($t('newPd.required_message')),
              $v.rangeLen([8,12], $t('pdValid')),
              $v.password(2, $t('pdValid'))
            ],
            validateFirst: true
          }]"
          :placeholder="$t('pdValid')"
        />
      </a-form-item>
      <!-- 确认密码 -->
      <a-form-item
        :label="$t('confirmPd.label')"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        self-update
      >
        <a-input-password
          v-decorator="['confirmPd', {
            rules: [
              $v.required($t('confirmPd.required_message')),
              $v.rangeLen([8,12], $t('pdValid')),
              $v.password(2, $t('pdValid')),
              valiRepeatPassword
            ],
            validateFirst: true
          }]"
          :placeholder="$t('pdValid')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapPropsToFields, autoUpdateFileds, validator } from '@util/formhelper.js';
import $ from '@http';

export default {
  mixins: [validator],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    oldpd: {
      type: String,
      default: '',
    },
  },
  data () {
    const vm = this;
    vm.mapPropsToFields = mapPropsToFields(vm, ['newPd', 'confirmPd'], 'record');
    return {
      form: vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: autoUpdateFileds(vm, 'record'),
      }),
      // 下层数据
      record: {},
      formLayout: 'horizontal',
      confirmLoading: false,
    };
  },
  computed: {
    formItemLayout () {
      const { formLayout } = this;
      return formLayout === 'horizontal'
        ? { labelCol: { span: 7 }, wrapperCol: { span: 12 } } : {};
    },
  },
  methods: {
    // 验证密码相同
    valiRepeatPassword (rule, confirmPd, callback) {
      const {newPd} = this.record;
      if (!confirmPd) {
        callback(new Error(this.$t('confirmPd.required_message')));
      } else if (confirmPd !== newPd) {
        callback(new Error(this.$t('confirmPd.unconfirm_message')));
      }
      callback();
    },
    handleOk () {
      this.form.validateFields((err) => {
        if (!err) {
          this.confirmLoading = true;
          const {oldpd} = this;
          const {confirmPd} = this.record;
          $.put('/sys/user/password', { password: oldpd, newPassword: confirmPd }).then(() => {
            this.$message.success(this.$t('force_change_pd_success'));
          }).catch((serverError) => {
            if (serverError) {
              this.$message.error(this.$t(serverError));
            } else {
              this.$message.error(this.$t('changePassword.failure'));
            }
          }).finally(() => {
            this.close();
            this.confirmLoading = false;
          });
        }
      });
    },
    close () {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style>
.force-changepd-model .ant-modal-body {
  padding: 0px;
}
/* .force-changepd-model .ant-modal-footer {
  border: 0px;
} */
.force-change-tip-class {
  text-align: center;
  background-color: rgba(250,190,0,0.08);
  margin-top: 16px;
  line-height: 24px;
}
.force-change-tip-class span {
  color: #FABE00;
  font-size: 12px;
  font-weight:bold;
}
</style>
