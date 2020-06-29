<template>
  <a-form-model
    ref="form"
    :model="form"
    self-update
    @submit.stop.self.prevent="handleSubmit"
  >
    <!-- uuid -->
    <a-form-model-item class="hidden">
      <a-input
        v-model="form.uuid"
        type="hidden"
      >
      </a-input>
    </a-form-model-item>
    <!-- 用户名 -->
    <a-form-model-item
      prop="username"
      :rules="[$v.required($t('username.required_message'))]"
    >
      <a-input
        v-model="form.username"
        :placeholder="$t('username.placeholder')"
        allow-clear
        autocomplete="off"
        size="large"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-model-item>
    <!-- 密码 -->
    <a-form-model-item
      prop="password"
      :rules="[$v.required($t('password.required_message'))]"
    >
      <a-input-password
        v-model="form.password"
        :placeholder="$t('password.placeholder')"
        autocomplete="off"
        allow-clear
        size="large"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
    <!-- 验证码 -->
    <!-- <a-form-model-item>
      <captcha-input
        v-decorator="['captcha', {
          rules: [{type: 'string', required: true, message: $t('captcha.required_message')}]
        }]"
        :url="`/auth/captcha?uuid=${form.uuid}`"
        :placeholder="$t('captcha.placeholder')"
        @click-captcha="captchaChange"
        autocomplete="off"
        allow-clear
        size="large"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </captcha-input>
    </a-form-model-item> -->
    <!-- <a-form-model-item> -->
    <a-checkbox
      v-model="remember"
      style="margin-bottom: 12px;"
    >
      {{ $t('remember.text') }}
    </a-checkbox>
    <!-- </a-form-model-item> -->
    <a-form-model-item>
      <a-button
        :loading="logining"
        type="primary"
        size="large"
        block
        html-type="submit"
      >
        {{ $t('login.submit') }}
      </a-button>
    </a-form-model-item>
    <a-form-model-item>
      <div class="forget-pd-div-class">
        <a @click="forgetPdClick">{{ $t('forgetPd') }}</a>
      </div>
    </a-form-model-item>
    <force-changepd
      v-if="showChangePassword"
      :visible.sync="showChangePassword"
      :oldpd="form.password"
    >
    </force-changepd>
    <forget-pd
      v-if="showForgetPd"
      :visible.sync="showForgetPd"
      :username-data="usernameData"
    >
    </forget-pd>
  </a-form-model>
</template>

<script>
import { validator } from '@util/formhelper.js';
import { getUUID } from '@util/datahelper.js';

export default {
  components: {
    // VInput: () => import('@comp/form/VInput.vue'),
    // CaptchaInput: () => import('@comp/form/CaptchaInput.vue'),
    // Password: () => import('@comp/form/Password.vue'),
  },
  mixins: [
    validator,
  ],
  data () {
    return {
      /**
       * 表单数据
       */
      form: {
        // captcha: null,
        uuid: getUUID(),
      },
      /**
       * 是否记住密码
       */
      remember: false,
      showChangePassword: false,
      showForgetPd: false,
      usernameData: '',
      logining: false,
    };
  },
  created () {
    this.recovery();
  },
  methods: {
    /**
     * 还原用户缓存
     */
    recovery () {
      const cache = this.$store.getters.getLoginCache();
      if (cache) {
        this.remember = true;
        // Object.assign(this.form, cache);
        this.$set(this, 'form', { ...this.form, ...cache });
      }
    },
    /**
     * 提交数据
     */
    handleSubmit () {
      if (!this.logining) {
        this.logining = true;
        this.$refs.form.validate((valid) => {
          if (valid) {
            const loginInfo = this.form;
            this.$store.dispatch('login', loginInfo).then((res) => {
            // 强制修改密码状态
              if (res.isNeedUpps === 1) {
                this.showChangePassword = true;
              } else if (res.token) {
                this.$store.commit('setLoginStatus', res.token);
                const goPage = this.$route.query.redirect || '/';
                if (this.$router.matcher.match(goPage).name === '404') {
                  this.$router.push({ path: '/' });
                } else {
                  this.$router.push({ path: goPage });
                }
                if (this.remember) {
                  this.$store.commit('cacheLoginInfo', loginInfo);
                } else {
                  this.$store.commit('cleanLoginInfo', loginInfo);
                }
              }
            }).catch((errCode) => {
              errCode && this.$message.error(this.$t(errCode));
            // this.form.captcha = null;
            // this.captchaChange();
            }).finally(() => {
              this.logining = false;
            });
          } else {
            this.logining = false;
          }
          return valid;
        });
      }
      return false;
    },
    /**
     * 记住用户名密码
     */
    clickRemember (e) {
      this.remember = e.target.value;
    },
    /**
     * 验证码更新
     */
    captchaChange () {
      this.form.uuid = getUUID();
    },
    forgetPdClick () {
      this.showForgetPd = true;
      this.usernameData = this.form.username;
    },
  },
};
</script>

<style lang="less" scoped>
  .background-white-50 {
    /deep/ input {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  .forget-pd-confirm-modal {
    width: 438px;
    height: 164px;
  }
  .forget-pd-div-class {
    float: right;
    margin-top: -20px;
  }
</style>
