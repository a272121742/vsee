<template>
  <a-affix
    :offset-top="top"
    :style="{ position: 'fixed', top: `${top}px`, right: '0px', 'z-index': 6000}"
  >
    <a-button
      type="primary"
      icon="setting"
      @click="show"
    >
      配置
    </a-button>
    <a-drawer
      :width="800"
      :visible="visible"
      :z-index="6000"
      title="开发人员配置（生产环境不可见）"
      @close="hide"
    >
      <a-row>
        发布日期：{{ buildDate }}
      </a-row>
      <a-row>
        开发人员专用，授权验证（按回车直接提交）
        <async-component
          path="@comp/helper/LoginForm.vue"
        />
      </a-row>
      <a-row>
        是否代理
        <a-switch
          :default-checked="!$store.state.isMock"
          @change="onProxyChange"
        />
      </a-row>
      <a-row>
        刷新页面：
        <a-button-group>
          <a-button
            style="margin-right: 0px;"
            @click="reload"
          >
            重载页面
          </a-button>
          <a-button @click="refresh">
            刷新内容
          </a-button>
        </a-button-group>
      </a-row>
      <a-row>
        国际化
        <async-component path="@comp/i18n/LanguageRadio.vue" />
        <async-component
          path="@comp/helper/LocaleTable.vue"
        ></async-component>
      </a-row>
    </a-drawer>
  </a-affix>
</template>

<script>
import $ from '@http';


export default {
  components: {
    AsyncComponent: () => import('@comp/AsyncComponent'),
  },
  data () {
    const vm = this;
    return {
      buildDate: process.env,
      top: 80,
      visible: false,
      isLogin: vm.$store.state.isLogin,
    };
  },
  computed: {
    authUrl () {
      this.reloadCaptcha();
      const uuid = this.$store.getters.getUUID();
      const time = Date.now();
      return `/auth/captcha?uuid=${uuid}&_t=${time}`;
    },
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
    // 刷新
    reload () {
      this.$store.dispatch('reload');
    },
    refresh () {
      this.$store.dispatch('refresh');
    },
    // 提交授权
    submitAuth (e) {
      const captcha = e.target.value;
      const uuid = this.$store.getters.getUUID();
      $.post('/auth/login', {
        captcha,
        password: 'admin',
        username: 'admin',
        uuid,
      }).then(() => {
        this.isLogin = true;
      }).catch(() => {
        this.isLogin = false;
      }).finally(() => {
        this.reloadCaptcha();
      });
    },
    onProxyChange (checked) {
      this.$store.commit('mock', !checked);
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .ant-drawer {
    z-index: 6000;
  }
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
