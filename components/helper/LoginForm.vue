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
      <a-auto-complete
        v-decorator="['username', {
          initialValue: record.username,
          rules: [{type: 'string', required: true, message: $t('username.required_message')}]
        }]"
        :data-source="accounts"
        :placeholder="$t('username.placeholder')"
        :dropdown-style="{'z-index': 6001}"
        allow-clear
        show-search
        autocomplete="off"
        size="large"
        @search="handleSearch"
        @select="handleSubmit"
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
        <!-- <a-select-option
          v-for="(act, index) in accounts"
          :key="index"
          :value="act"
        >
          {{ act.slice(0, -12) }}
        </a-select-option> -->
      </a-auto-complete>
    </a-form-item>
    <!-- 密码 -->
    <a-form-item>
      <password
        v-decorator="['password', {
          initialValue: record.password,
          rules: [{type: 'string', required: true, message: $t('password.required_message')}]
        }]"
        :placeholder="$t('password.placeholder')"
        autocomplete="off"
        allow-clear
        size="large"
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
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </captcha-input>
    </a-form-item> -->
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
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';

const mailback = '@bjev.com.cn';
const accounts = [
  'suwei1' + mailback,
  'fanjiangnan' + mailback,
  'zhanghaitao' + mailback,
  'liangchao' + mailback,
  'youtao' + mailback,
  'zhaojiaqi' + mailback,
  'jiayanmin'+ mailback,
  'gufeng'+ mailback,
  'lihongbin'+ mailback,
  'zhaojia'+ mailback,
  'wangxueying'+ mailback,
  'raomiaotao'+ mailback,
  'wangchunjie'+ mailback,
  'baijie'+ mailback,
  'zhangliquan'+ mailback,
  'tianxiongwei'+ mailback,
  'zhangpeng'+ mailback,
  'chaihonggen'+ mailback,
  'houjun'+ mailback,
  'tianyuli'+ mailback,
  'liujie1'+ mailback,
  'chenguoqi'+ mailback,
  'wangtao'+ mailback,
  'liyuan'+ mailback,
  'liulizhi'+ mailback,
  'sunshuailong'+ mailback,
  'duxiangzheng'+ mailback,
  'lixifu'+ mailback,
  'zhangshouyuan'+ mailback,
  'shendawei'+ mailback,
  'xuehongwei'+ mailback,
  'renxianfei'+ mailback,
  'liyongfei'+ mailback,
  'qiaozenan'+ mailback,
  'hanzhiqiang'+ mailback,
  'liuyundong'+ mailback,
  'liyunduan'+ mailback,
  'duheng'+ mailback,
  'luolinlan'+ mailback,
  'shijunbo'+ mailback,
  'yanliguo'+ mailback,
  'sunwentao'+ mailback,
  'tangdianju'+ mailback,
  'chenwenwu'+ mailback,
  'zhangyule'+ mailback,
  'zhangyouhuan'+ mailback,
  'wangjianfeng'+ mailback,
  'yutao1'+ mailback,
  'lihuihui'+ mailback,
  'songzhixue'+ mailback,
  'zhoujinling'+ mailback,
  'yangsuoyu@baicvbu.com',
  'zhengyunfei'+ mailback,
  'tangxiangdong'+ mailback,
  'xutengda'+ mailback,
  'mapengcheng'+ mailback,
  'lixinghua'+ mailback,
  'marubin'+ mailback,
  'luodengyuan'+ mailback,
  'jiwei01'+ mailback,
  'jiujiajie'+ mailback,
  'wangpeiyu@bjev.com.cn',
  'yuguixia@bjev.com.cn',
  'yidihua@bjev.com.cn',
  'liuweihong@bjev.com.cn',
  'wangjinkui@bjev.com.cn',
  'liyanfang@bjev.com.cn',
  'markcobbett@bjev.com.cn'
];
export default {
  components: {
    // VInput: () => import('@comp/form/VInput.vue'),
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
        password: 'bjev2019',
        // captcha: null,
        uuid: getUUID()
      },
      
      accounts: accounts,
    };
  },
  created () {
    const { mapPropsToFields, onValuesChange } = this;
    this.form = this.$form.createForm(this, {
      mapPropsToFields,
      onValuesChange
    });
  },
  methods: {
    /**
     * 提交数据
     */
    handleSubmit () {
      this.form.validateFields((err, loginInfo) => {
        this.$store.dispatch('logout');
        if (!err) {
          this.$store.dispatch('login', loginInfo).then(res => {
            if (res.token) {
              this.$store.commit('setLoginStatus', res.token);
            }
          }).catch(errCode => {
            errCode && this.$message.error(this.$t(errCode));
          }).finally(() => {
            this.$store.dispatch('reload');
            this.$store.dispatch('refresh');
          });
        }
      });
    },
    handleSearch (value) {
      this.accounts = accounts.filter(item => ~item.indexOf(value));
    },
    /**
     * 验证码更新
     */
    // captchaChange () {
    //   this.record.uuid = getUUID();
    // },
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
    },
  }
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
