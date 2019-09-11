<template>
  <div class="login_wrapper">
    <div class="ant-drawer ant-drawer-right ant-drawer-open no-mask">
      <div class="ant-drawer-content-wrapper" style="width: 500px;">
        <div class="ant-drawer-content">
          <div class="ant-drawer-wrapper-body" style="overflow: auto; height: 100%;">
            <div class="ant-drawer-body">
              <a-row>
                <language-radio class="language-radio"></language-radio>
              </a-row>
              <a-row>
                <h1 class="title">BJEV-TQIS</h1>
              </a-row>
              <a-row>
                <login-form class="login-form"></login-form>
              </a-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    LanguageRadio: () => import('@comp/i18n/LanguageRadio'),
    LoginForm: () => import('./Form.vue')
  }
}
</script>

<style lang="less" scoped>
  .title {
    margin-bottom: 36px;
    font-size: 36px;
    color: #0097E0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login_wrapper {
    height: -webkit-fill-available;
    background-image: url('/static/portal/login_bg.png');
    background-repeat:no-repeat;
    background-size: cover;
    -webkit-font-smoothing: antialiased;

    /deep/ .ant-drawer-content {
      background: rgba(255, 255, 255, 0.6);
    }
  }
  .language-radio {
    float: right;
    margin-bottom: 108px;
  }
  .login-form {
    margin: auto 48px;
  }
  
</style>