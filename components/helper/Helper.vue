<template>
  <a-affix
    :offset-top="top"
    :style="{ position: 'fixed', top: `${top}px`, right: '0px'}"
  >
    <a-button
      type="primary"
      icon="setting"
      @click="show"
    >
      配置
    </a-button>
    <a-drawer
      title="开发人员配置（生产环境不可见）"
      :width="800"
      :visible="visible"
      @close="hide"
    >
      <template v-if="!isLogin">
        开发人员专用，授权验证（按回车直接提交）
        <async-component
          path="@comp/form/CaptchaInput.vue"
          :url="authUrl"
          @click-captcha="reloadCaptcha"
          @keyup.enter="submitAuth"
        >
        </async-component>
      </template>
      <template>
        是否代理
        <a-switch
          default-checked
          @change="onProxyChange"
        />
      </template>
      <template>
        刷新页面
        <a-button
          @click="refresh"
        >
          刷新页面
        </a-button>
      </template>
      <template>
        <async-component
          path="@comp/helper/LocaleTable.vue"
        ></async-component>
      </template>
    </a-drawer>
  </a-affix>
</template>

<script>
import $ from '@lib/ajax.js';
console.log($.instance.defaults.baseURL);

export default {
  components: {
    AsyncComponent: () => import('@comp/AsyncComponent')
  },
  data () {
    const vm = this;
    return {
      top: 80,
      visible: false,
      isLogin: vm.$store.state.isLogin
    }
  },
  computed: {
    authUrl () {
      this.reloadCaptcha();
      const uuid = this.$store.getters.getUUID();
      const time = Date.now();
      return `/auth/captcha?uuid=${uuid}&_t=${time}`;
    }
  },
  methods: {
    // 显示
    show () {
      this.visible = true;
    },
    // 隐藏
    hide () {
      this.visible = false;
    },
    // 重新加载验证码
    reloadCaptcha () {
      this.$store.dispatch('loadUUID');
    },
    // 提交授权
    submitAuth (e) {
      const captcha = e.target.value;
      const uuid = this.$store.getters.getUUID();
      $.post('/auth/login', {
        captcha,
        password: 'admin',
        username: 'admin',
        uuid
      }).then(() => {
        this.isLogin = true;
      }).catch(() => {
        this.isLogin = false;
      }).finally(() => {
        this.reloadCaptcha();
      });
    },
    onProxyChange (checked) {
      checked
        ? ($.instance.defaults.baseURL = '/api')
        : ($.instance.defaults.baseURL = '/');
    },
    refresh () {
      this.$store.dispatch('refresh');
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-btn {
    width: auto;
    margin-right: -50px;
    opacity: 0.65;
    text-align: left;
    &:hover {
      opacity: 1;
      margin-right: -10px;
    }
  }
  /deep/ .anticon {
    margin-left: -12px;
  }
</style>
