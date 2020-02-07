<template>
  <a-modal
    :visible="visible"
    :confirm-loading="confirmLoading"
    :title="$t('title')"
    :mask-closable="false"
    :z-index="6001"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :form="form"
      self-update
    >
      <!-- 原密码 -->
      <a-form-item
        v-if="!password"
        :label="$t('oldPassword.label')"
      >
        <a-input-password
          v-decorator="['oldPassword', {
            rules: [
              $v.required($t('oldPassword.message')),
              $v.rangeLen([8,12], $t('strengthMessage')),
              $v.password(2, $t('strengthMessage'))
            ],
            validateTrigger: 'blur',
            validateFirst: true
          }]"
          :placeholder="$t('oldPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-item>
      <a-input
        v-else
        v-decorator="['oldPassword']"
        type="hidden"
      >
      </a-input>
      <!-- 新密码 -->
      <a-form-item
        :label="$t('newPassword.label')"
      >
        <a-input-password
          v-decorator="['newPassword', {
            rules: [
              $v.required($t('newPassword.message')),
              $v.rangeLen([8,12], $t('strengthMessage')),
              $v.password(2, $t('strengthMessage'))
            ],
            validateTrigger: 'blur',
            validateFirst: true
          }]"
          :placeholder="$t('newPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-item>
      <!-- 确认密码 -->
      <a-form-item
        :label="$t('comfirmPassword.label')"
      >
        <a-input-password
          v-decorator="['comfirmPassword', {
            rules: [
              $v.required($t('comfirmPassword.message')),
              $v.rangeLen([8,12], $t('strengthMessage')),
              $v.password(2, $t('strengthMessage')),
              $v.equal(record.newPassword, $t('comfirmPassword.message'))
            ],
            validateTrigger: 'blur',
            validateFirst: true
          }]"
          :placeholder="$t('comfirmPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<i18n>
{
  "zh": {
    "title": "修改密码",
    "oldPassword": {
      "label": "原密码",
      "placeholder": "请输入原密码",
      "message": "原密码不能为空"
    },
    "newPassword": {
      "label": "新密码",
      "placeholder": "请输入新密码",
      "message": "新密码不能为空"
    },
    "comfirmPassword": {
      "label": "确认密码",
      "placeholder": "请再次确认密码",
      "message": "两次输入不一致"
    },
    "ok": "确认",
    "cancel": "取消",
    "strengthMessage": "8-12位字母与数字组合，区分大小写"
  },
  "en": {
    "title": "Change Password",
    "oldPassword": {
      "label": "Old Password",
      "placeholder": "Please Input Old Password",
      "message": "Old Password Required"
    },
    "newPassword": {
      "label": "New Password",
      "placeholder": "Please Input New Password",
      "message": "New Password Required"
    },
    "comfirmPassword": {
      "label": "Confirm Password",
      "placeholder": "Please Comfirm Password",
      "message": "Inconsistent Input Twice"
    },
    "ok": "OK",
    "cancel": "Cancel",
    "strengthMessage": "8-12 letters and numbers,case sensitive"
  }
}
</i18n>

<script>
/**
 * 修改密码组件
 */
import { mapPropsToFields, autoUpdateFileds, validator } from '@util/formhelper.js';
import { transto } from '@util/datahelper.js';
import $ from '@http';

export default {
  mixins: [validator],
  props: {
    password: {
      type: String,
      default: void 0,
    },
    mapping: {
      type: Object,
      default: () => ({}),
    },
    url: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    const vm = this;
    this.mapPropsToFields = mapPropsToFields(vm, ['oldPassword', 'newPassword', 'repeatPassword'], 'record');
    return {
      form: vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: autoUpdateFileds(vm, 'record'),
      }),
      // 下层数据
      record: {
        oldPassword: vm.password,
        newPassword: void 0,
        comfirmPassword: void 0,
      },
      confirmLoading: false,
    };
  },
  methods: {
    handleOk () {
      this.form.validateFields((err) => {
        if (!err) {
          this.confirmLoading = true;
          const { mapping, url } = this;
          const { oldPassword, newPassword } = this.record;
          const data = transto(mapping || {}, { oldPassword, newPassword });
          $.put(url, data).then(() => {
            this.$message.info(this.$t('changePassword.success'));
            this.close();
            this.$store.dispatch('logout');
          }).catch((errcode) => {
            if (errcode) {
              this.$message.error(this.$t(errcode));
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
      this.$emit('update:visible', false);
      this.form.resetFields();
    },
  },
};
</script>
