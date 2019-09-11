<template>
  <a-form
    :form="form"
    @submit.stop.prevent="handleSubmit"
  >
    <!-- 用户名 -->
    <a-form-item>
      <v-input
        allow-clear
        autocomplete="false"
        size="large"
        :placeholder="$t('username.placeholder')"
        v-decorator="['username', {
          initialValue: record.username,
          rules: [{type: 'string', required: true, message: $t('username.required_message')}]
        }]"
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
        autocomplete="false"
        allow-clear
        size="large"
        :placeholder="$t('password.placeholder')"
        v-decorator="['password', {
          initialValue: record.password,
          rules: [{type: 'string', required: true, message: $t('password.required_message')}]
        }]"
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
      <v-input
        autocomplete="false"
        size="large"
        :placeholder="$t('captcha.placeholder')"
        v-decorator="['captcha', {
          rules: [{type: 'string', required: true, message: $t('captcha.required_message')}]
        }]"
        class="background-white-50"
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
        <!-- 验证码组件 -->
        <captcha 
          class="captcha"
          slot="suffix"
          :url="`/auth/captcha?uuid=${record.uuid}`"
          @click="captchaChange"
        />
      </v-input>
    </a-form-item>
    <a-form-item>
      <a-checkbox 
        :checked="remember" 
        @change="e => remember = e.target.checked"
      >
        {{ $t('remember.text')}}
      </a-checkbox>
    </a-form-item>
    <a-form-item>
      <a-input
        type="hidden"
        v-decorator="['uuid', {initialValue: record.uuid}]"
      >
    </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        block
        html-type="submit"
      >
        {{ $t('login.submit')}}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { getUUID } from '@util/datahelper.js';
import { createNamespacedHelpers } from 'vuex';
import { createFormFields } from '@util/formhelper.js';

const { mapActions, mapMutations, mapGetters } = createNamespacedHelpers('login');

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    Password: () => import('@comp/form/Password.vue'),
    Captcha: () => import('@comp/image/Captcha.vue'),
  },
  data () {
    const vm = this;
    return {
      form: null,
      record: {
        username: null,
        password: null,
        captcha: null,
        uuid: getUUID(),
      },
      remember: false,
    }
  },
  created () {
    this.recovery();
    this.form = this.$form.createForm(this, createFormFields(this, ['username','password', 'captcha', 'uuid'], 'record'));
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['cache', 'clean']),
    ...mapGetters(['getCache']),
    recovery () {
      const cache = this.getCache();
      if (cache) {
        this.remember = true;
        this.record.username = cache.username;
        this.record.password = cache.password;
      }
    },
    handleSubmit (e) {
      this.form.validateFields((err, loginInfo) => {
        if (!err) {
          this.login(loginInfo).then(res => {
            if (res.token) {
              this.$router.push({path: '/'});
              // window.location.href="/";
              if (this.remember) {
                this.cache(loginInfo);
              } else {
                this.clean();
              }
            }
          }).catch(err => {
            this.$message.error(this.$t(err));
          }).finally(_ => {
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
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-spin-nested-loading {
    margin-right: -12px;
    /deep/ img {
      border: 1px solid transparent!important;
      border-radius: 0 4px 4px 0;
    }
  }
  .captcha {
    /deep/ img {
      height: 40px;
    }
  }
  .background-white-50 {
    /deep/ input {
      background: rgba(255, 255, 255, 0.5);
    }
  }
</style>