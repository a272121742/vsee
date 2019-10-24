<template>
  <div
    v-lazy:background-image="'/static/portal/login_bg.png'"
    class="login_wrapper"
  >
    <div class="ant-drawer ant-drawer-right ant-drawer-open no-mask">
      <div
        class="ant-drawer-content-wrapper div-wrapper"
      >
        <div class="ant-drawer-content">
          <div class="ant-drawer-wrapper-body">
            <div class="ant-drawer-body">
              <div>
                <div class="logo"></div>
                <div class="radio-group">
                  <language-radio class="language-radio"></language-radio>
                </div>
              </div>
              <a-row>
                <h1 class="title">
                  TQIS
                </h1>
                <p class="subtitle">
                  Total Quality Information System
                </p>
              </a-row>
              <div>
                <login-form class="login-form"></login-form>
              </div>
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
};
</script>

<style lang="less" scoped>
  .ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
      box-shadow: none;
  }
  .div-wrapper {
    width: 35%;
    height:100%;
    padding: 5% 5% 5% 0;
    box-shadow:none;
  }
  .title {
    margin-bottom: 4px;
    padding-top: 9.3%;
    font-size: 38px;
    color: #0097E0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .subtitle {
    margin-bottom: 4px;
    font-size: 11px;
    color: #0097E0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login_wrapper {
    width: 100%;
    height: 100%;
    // background-image: url(/static/portal/login_bg.png);
    background-repeat:no-repeat;
    background-size: cover;
    -webkit-font-smoothing: antialiased;

    /deep/ .ant-drawer-content {
      background: rgba(255, 255, 255, 0.6);
    }
  }
  .logo {
    display: inline-block;
    width: 160px;
    height: 32px;
    margin: 0;
    padding: 0;
    background-image: url("/static/logo.svg");
    background-size: 100%;
  }
  .logo:before,:after {
    display: inline;
  }
  .language-radio {
    line-height: 1;
    position: relative;
    display: inline;
    margin:0;
    padding-left: 15%;
    padding-bottom: 4px;
    /deep/ .ant-radio-group{
      display: inline;
    }
  }
  .language-radio:before,:after {
    display: inline;
  }
  .login-form {
    height:28%;
    margin: auto 7%;
    /deep/ .ant-row {
      height: 5.2%;
    }
    /deep/ .ant-form-item,
    /deep/ .ant-checkbox-wrapper {
      margin-bottom:7%;
    }
    .checked {
      height: 14px;
    }
  }
  .radio-group {
    display: inline !important;
    /deep/ .a-radio-button {
      display: inline;
    }
  }
</style>
