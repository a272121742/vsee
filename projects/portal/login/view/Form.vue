<template>
  <a-form
    :form="form"
    @submit.stop.self.prevent="handleSubmit"
  >
    <!-- uuid -->
    <a-form-item>
      <a-input
        v-decorator="['uuid', {initialValue: record.uuid}]"
        type="hidden"
      >
      </a-input>
    </a-form-item>
    <!-- 用户名 -->
    <a-form-item>
      <v-input
        v-decorator="['username', {
          initialValue: record.username,
          rules: [{type: 'string', required: true, message: $t('username.required_message')}]
        }]"
        allow-clear
        autocomplete="off"
        size="large"
        :placeholder="$t('username.placeholder')"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
      </v-input>
    </a-form-item>
    <!-- 密码 -->
    <a-form-item>
      <password
        v-decorator="['password', {
          initialValue: record.password,
          rules: [{type: 'string', required: true, message: $t('password.required_message')}]
        }]"
        autocomplete="off"
        allow-clear
        size="large"
        :placeholder="$t('password.placeholder')"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </password>
    </a-form-item>
    <!-- 验证码 -->
    <a-form-item>
      <captcha-input
        v-decorator="['captcha', {
          rules: [{type: 'string', required: true, message: $t('captcha.required_message')}]
        }]"
        autocomplete="off"
        allow-clear
        size="large"
        :url="`/auth/captcha?uuid=${record.uuid}`"
        :placeholder="$t('captcha.placeholder')"
        class="background-white-50"
        @click-captcha="captchaChange"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </captcha-input>
    </a-form-item>
    <a-form-item>
      <a-checkbox
        :checked="remember"
        @change="e => remember = e.target.checked"
      >
        {{ $t('remember.text') }}
      </a-checkbox>
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        size="large"
        block
        html-type="submit"
      >
        {{ $t('login.submit') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { getUUID } from '@util/datahelper.js';
import { createNamespacedHelpers } from 'vuex';
import { createFormFields } from '@util/formhelper.js';

const { mapActions } = createNamespacedHelpers('login');

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    CaptchaInput: () => import('@comp/form/CaptchaInput.vue'),
    Password: () => import('@comp/form/Password.vue')
  },
  data () {
    return {
      /**
       * 表单
       */
      form: null,
      /**
       * 表单数据
       */
      record: {
        username: null,
        password: null,
        captcha: null,
        uuid: getUUID()
      },
      /**
       * 是否记住密码
       */
      remember: false
    }
  },
  created () {
    this.recovery();
    this.form = this.$form.createForm(this, createFormFields(this, ['username', 'password', 'captcha', 'uuid'], 'record'));
  },
  methods: {
    ...mapActions(['login']),
    /**
     * 还原用户缓存
     */
    recovery () {
      const cache = this.$store.getters.getLoginCache();
      if (cache) {
        this.remember = true;
        this.record.username = cache.username;
        this.record.password = cache.password;
      }
    },
    /**
     * 提交数据
     */
    handleSubmit () {
      this.form.validateFields((err, loginInfo) => {
        if (!err) {
          this.login(loginInfo).then(res => {
            if (res.token) {
              const goPage = this.$route.query.redirect || '/';
              if (this.$router.matcher.match(goPage).name === '404') {
                this.$router.push({ path: '/' });
              } else {
                this.$router.push({ path: this.$route.query.redirect });
              }
              if (this.remember) {
                this.$store.commit('cacheLoginInfo', loginInfo);
              } else {
                this.$store.commit('cleanLoginInfo', loginInfo);
              }
            }
          }).catch(errCode => {
            this.$message.error(this.$t(errCode));
            this.captchaChange();
          })
        }
      });
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
      this.record.uuid = getUUID();
    }
  }
}
</script>

<style lang="less" scoped>
  .background-white-50 {
    /deep/ input {
      background: rgba(255, 255, 255, 0.5);
    }
  }
</style>
