<template>
  <div
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
                <div class="logo">
                  <a-icon
                    class="logo"
                    type="iconlogo"
                  ></a-icon>
                </div>
                <div class="radio-group">
                  <language-radio class="language-radio"></language-radio>
                </div>
              </div>
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
    LoginForm: () => import('./Form.vue'),
  },
};
</script>

<style lang="less" scoped>
  .ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
      box-shadow: none;
  }
  .login_wrapper {
    // width: 100%;
    height: 100%;
    // background-image: url(/static/portal/login_bg.png);
    background-repeat:no-repeat;
    background-size: 100% 100%;
    -webkit-font-smoothing: antialiased;
    /deep/ .ant-drawer-content {
      background: rgba(255, 255, 255, 0.66);
      // min-height: 520px;
    }
    /deep/ .ant-drawer-body {
      width: 432px;
      padding: 24px 24px 0px 24px;
    }
  }
  /deep/ .ant-radio-button-wrapper-checked {
    box-shadow: -1px 0 0 0 #ccc;
  }
  .ant-drawer-content {
    border-radius: 8px;
  }
  .title,.subtitle{
    color: #0097E0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    margin-top: 72px;
  }
  .logo {
      display: inline-block;
      width: 160px;
      height: 32px;
  }
  .logo:before,:after {
    display: inline-block;
  }
  .ant-drawer-right .ant-drawer-content-wrapper {
    padding:4.6%;
  }
  .radio-group {
      display: inline-block !important;
      height: 32px;
      overflow: hidden;
      /deep/ div {
        padding-left: 95px;
      }
  }
  .language-radio {
      line-height: 2.5;
      display: inline;
      /deep/ .ant-radio-group{
        display: inline;
        font-size: 12px !important;
      }
      /deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        color: #26b1ed;
        background: rgba(0,0,0,0);
      }
      /deep/ .ant-radio-button-wrapper {
        border:none;
        background: rgba(0,0,0,0);
      }
      /deep/ .ant-radio-button-wrapper:last-child span{
        padding: 0 3px;
      }
  }
  .login-form {
      height:274px;
      margin: auto 32px;
      /deep/ .ant-input {
        height: 40px;
      }
      /deep/ .ant-form-item,
      /deep/ .ant-checkbox-wrapper {
        padding-bottom: 8px;
      }
  }

  @media screen and(max-width: 1366px) {
    .login_wrapper {
      /deep/ .ant-drawer-body {
          padding: 1.7% 1.7% 0px 1.7%;
        }
    }
    .ant-drawer-right .ant-drawer-content-wrapper {
      padding-bottom: 20px;
    }
    .title {
      margin-bottom: 4px;
      font-size: 32px;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
    }
  }
  @media screen and(min-width: 1536px) {
    .title {
      margin-bottom: 4px;
      font-size: 32px;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
    }
    .radio-group {
      display: inline-block !important;
      width: 200px;
      height: 32px;
      overflow: hidden;
      // /deep/ .a-radio-button {
      //   display: inline-block;
      // }
      // /deep/ div {
      //   padding-left: 155px;
      // }
    }
  }
  @media screen and(min-width: 1920px) {
    .login_wrapper {
      /deep/ .ant-drawer-body {
        width: 574px;
        padding: 24px;
      }
    }
    .title {
      margin-bottom: 4px;
      margin-top: 115.2px;
      font-size: 32px;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
    }
    .login-form {
      height:430px;
      // margin: auto 72px;
      /deep/ .ant-input {
        height: 56px;
      }
    }
    .radio-group {
      display: inline-block !important;
      width: 224px;
      padding-top: 10px;
      height: 44px;
      overflow: hidden;
      /deep/ div {
        padding-left: 130px;
      }
    }
  }
  .language-radio:before,:after {
    display: inline;
  }
</style>
