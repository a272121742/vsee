<template>
  <a-form-model
    ref="form"
    :model="form"
    @submit.stop.self.prevent="handleSubmit"
  >
    <!-- uuid -->
    <a-form-model-item>
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
      <a-auto-complete
        v-model="form.username"
        :data-source="accounts"
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
      </a-auto-complete>
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
      </a-input-password>
    </a-form-model-item>
    <!-- 验证码 -->
    <!-- <a-form-model-item>
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
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </captcha-input>
    </a-form-model-item> -->
    <a-form-model-item>
      <a-button
        type="primary"
        size="large"
        block
        html-type="submit"
      >
        {{ $t('login.submit') }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { validator } from '@util/formhelper.js';
import { getUUID } from '@util/datahelper.js';

const mailback = '@bjev.com.cn';
const accounts = [
  `suwei1${mailback}`,
  `fanjiangnan${mailback}`,
  `zhanghaitao${mailback}`,
  `liangchao${mailback}`,
  `youtao${mailback}`,
  `zhaojiaqi${mailback}`,
  `jiayanmin${mailback}`,
  `gufeng${mailback}`,
  `lihongbin${mailback}`,
  `zhaojia${mailback}`,
  `wangxueying${mailback}`,
  `raomiaotao${mailback}`,
  `wangchunjie${mailback}`,
  `baijie${mailback}`,
  `zhangliquan${mailback}`,
  `tianxiongwei${mailback}`,
  `zhangpeng${mailback}`,
  `chaihonggen${mailback}`,
  `houjun${mailback}`,
  `tianyuli${mailback}`,
  `liujie1${mailback}`,
  `chenguoqi${mailback}`,
  `wangtao${mailback}`,
  `liyuan${mailback}`,
  `liulizhi${mailback}`,
  `sunshuailong${mailback}`,
  `duxiangzheng${mailback}`,
  `lixifu${mailback}`,
  `zhangshouyuan${mailback}`,
  `shendawei${mailback}`,
  `xuehongwei${mailback}`,
  `renxianfei${mailback}`,
  `liyongfei${mailback}`,
  `qiaozenan${mailback}`,
  `hanzhiqiang${mailback}`,
  `liuyundong${mailback}`,
  `liyunduan${mailback}`,
  `duheng${mailback}`,
  `luolinlan${mailback}`,
  `shijunbo${mailback}`,
  `yanliguo${mailback}`,
  `sunwentao${mailback}`,
  `tangdianju${mailback}`,
  `chenwenwu${mailback}`,
  `zhangyule${mailback}`,
  `zhangyouhuan${mailback}`,
  `wangjianfeng${mailback}`,
  `yutao1${mailback}`,
  `lihuihui${mailback}`,
  `songzhixue${mailback}`,
  `zhoujinling${mailback}`,
  'yangsuoyu@baicvbu.com',
  `zhengyunfei${mailback}`,
  `tangxiangdong${mailback}`,
  `xutengda${mailback}`,
  `mapengcheng${mailback}`,
  `lixinghua${mailback}`,
  `marubin${mailback}`,
  `luodengyuan${mailback}`,
  `jiwei01${mailback}`,
  `jiujiajie${mailback}`,
  `mengxiangtao01${mailback}`,
  `shenjincheng@baicvbu.com`,
];
export default {

  components: {
    // VInput: () => import('@comp/form/VInput.vue'),
    // CaptchaInput: () => import('@comp/form/CaptchaInput.vue'),
    // Password: () => import('@comp/form/Password.vue'),
  },
  mixins: [validator],
  data () {
    return {
      form: {
        username: 'superadmin@bjev.com.cn',
        password: 'bjev2019',
        // captcha: null,
        uuid: getUUID(),
      },
      accounts,
    };
  },
  methods: {
    /**
     * 提交数据
     */
    handleSubmit (e) {
      this.$refs.form.validate((valid) => {
        const userInfo = (typeof e === 'string') ? { ...this.form, username: e } : this.form;
        // this.$store.dispatch('logout');
        if (this.$store.state.isMock) {
          this.$store.commit('setToken', 'abc');
        }
        if (valid) {
          this.$store.dispatch('login', userInfo).then((res) => {
            if (res.token) {
              this.$store.commit('setLoginStatus', res.token);
            }
          }).catch((errCode) => {
            errCode && this.$message.error(this.$t(errCode));
          }).finally(() => {
            this.$store.dispatch('reload');
            this.$store.dispatch('refresh');
          });
        }
        return valid;
      });
    },
    handleSearch (value) {
      this.accounts = accounts.filter((item) => ~item.indexOf(value));
    },
    /**
     * 验证码更新
     */
    // captchaChange () {
    //   this.record.uuid = getUUID();
    // },
  },
};
</script>

<i18n>
{
  "zh": {
    "username": {
      "label": "用户名",
      "placeholder": "请输入用户名",
      "required_message": "用户名不能为空"
    },
    "password": {
      "label": "密码",
      "placeholder": "请输入用户密码",
      "required_message": "密码不能为空"
    },
    "captcha": {
      "label": "验证码",
      "placeholder": "请输入验证码",
      "required_message": "验证码不能为空"
    },
    "remember": {
      "text": "记住用户名和密码"
    },
    "login": {
      "submit": "登录"
    }
  },
  "en": {
    "username": {
      "label": "Username",
      "placeholder": "please input username",
      "required_message": "username is required"
    },
    "password": {
      "label": "Password",
      "placeholder": "please input password",
      "required_message": "password is required"
    },
    "captcha": {
      "label": "Captcha",
      "placeholder": "please input captcha",
      "required_message": "captcha id required"
    },
    "remember": {
      "text": "remember username and password"
    },
    "login": {
      "submit": "Login"
    }
  }
}
</i18n>
