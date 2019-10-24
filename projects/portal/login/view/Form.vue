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
    <a-form-item
      self-update
    >
      <v-input
        v-decorator="['username', {
          initialValue: record.username,
          rules: [{type: 'string', required: true, message: $t('username.required_message')}]
        }]"
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
      </v-input>
    </a-form-item>
    <!-- 密码 -->
    <a-form-item
      self-update
    >
      <password
        v-decorator="['password', {
          initialValue: record.password,
          rules: [{type: 'string', required: true, message: $t('password.required_message')}]
        }]"
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
      </password>
    </a-form-item>
    <!-- 验证码 -->
    <!-- <a-form-item>
      <captcha-input
        v-decorator="['captcha', {
          rules: [{type: 'string', required: true, message: $t('captcha.required_message')}]
        }]"
        :url="`/auth/captcha?uuid=${record.uuid}`"
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
    </a-form-item> -->
    <!-- <a-form-item class=""> -->
    <a-checkbox
      :checked="remember"
      @change="e => remember = e.target.checked"
    >
      {{ $t('remember.text') }}
    </a-checkbox>
    <!-- </a-form-item> -->
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
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';

const { mapActions } = createNamespacedHelpers('login');

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    // CaptchaInput: () => import('@comp/form/CaptchaInput.vue'),
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
        // captcha: null,
        uuid: getUUID()
      },
      /**
       * 是否记住密码
       */
      remember: false
    };
  },
  created () {
    this.recovery();
    const { mapPropsToFields, onValuesChange } = this;
    this.form = this.$form.createForm(this, {
      mapPropsToFields,
      onValuesChange
    });
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
          this.$store.dispatch('login', loginInfo).then(res => {
            if (res.token) {
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
          }).catch(errCode => {
            errCode && this.$message.error(this.$t(errCode));
            this.record.captcha = null;
            this.form.updateFields(this.mapPropsToFields());
            this.captchaChange();
          });
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
    },
    /**
     * 数据映射
     */
    mapPropsToFields () {
      return createFormFields(this, ['username', 'password', 'captcha', 'uuid'], 'record');
    },
    /**
     * 监听数据变更
     */
    onValuesChange (props, values) {
      return autoUpdateFileds(this, 'record')(props, values);
    }
  }
};
</script>

<style lang="less" scoped>
  .background-white-50 {
    /deep/ input {
      background: rgba(255, 255, 255, 0.5);
    }
  }
</style>
