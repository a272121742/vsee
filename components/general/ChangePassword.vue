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
    <a-form-model
      ref="form"
      :model="form"
      self-update
    >
      <!-- 原密码 -->
      <a-form-model-item
        v-if="!password"
        prop="oldPassword"
        :rules="[$v.required($t('oldPassword.message'))]"
        :label="$t('oldPassword.label')"
      >
        <a-input-password
          v-model="form.oldPassword"
          :placeholder="$t('oldPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-model-item>
      <a-input
        v-else
        v-model="form.oldPassword"
        type="hidden"
      >
      </a-input>
      <!-- 新密码 -->
      <a-form-model-item
        prop="newPassword"
        :rules="[
          $v.required($t('newPassword.message')),
          $v.pattern(/^(?!.*[\u4E00-\u9FA5])(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,12}$/, $t('strengthMessage')),
        ]"
        :label="$t('newPassword.label')"
      >
        <a-input-password
          v-model="form.newPassword"
          :placeholder="$t('newPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-model-item>
      <!-- 确认密码 -->
      <a-form-model-item
        prop="comfirmPassword"
        :rules="[
          $v.required($t('comfirmPassword.message')),
          $v.pattern(/^(?!.*[\u4E00-\u9FA5])(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,12}$/, $t('strengthMessage')),
          $v.equal(form.newPassword, $t('comfirmPassword.message'))
        ]"
        :label="$t('comfirmPassword.label')"
      >
        <a-input-password
          v-model="form.comfirmPassword"
          :placeholder="$t('comfirmPassword.placeholder')"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input-password>
      </a-form-model-item>
    </a-form-model>
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
    "strengthMessage": "8-12位字母、数字和符号组合，区分大小写"
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
    "strengthMessage": "8-12 letters、numbers and symbol,case sensitive"
  }
}
</i18n>

<script>
/**
 * 修改密码组件
 */
import { validator } from '@util/formhelper.js';
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
    return {
      // 下层数据
      form: {
        oldPassword: vm.password,
        newPassword: void 0,
        comfirmPassword: void 0,
      },
      confirmLoading: false,
    };
  },
  methods: {
    handleOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          const { mapping, url } = this;
          const { oldPassword, newPassword } = this.form;
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
        return valid;
      });
    },
    handleCancel () {
      this.close();
    },
    close () {
      this.$refs.form.resetFields();
      this.$emit('update:visible', false);
    },
  },
};
</script>
