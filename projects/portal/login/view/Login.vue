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
                <div class="logo">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="100%" 
                    width="100%"
                  >
                    <image 
                      xlink:href="/static/logo.svg" 
                      height="100%" 
                      width="100%" 
                    />
                  </svg>
                </div>
                <div class="radio-group">
                  <language-radio class="language-radio"></language-radio>
                </div>
              </div>
              <a-row
                v-if="$store.state.isBuildTest"
                style="position: absolute; left: calc(50% - 44px)"
              >
                <h2
                  style="color: red"
                >
                  {{ $t('env.name') }}
                </h2>
              </a-row>
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
  .login_wrapper {
    width: 100%;
    height: 100%;
    // background-image: url(/static/portal/login_bg.png);
    background-repeat:no-repeat;
    background-size: 100% 100%;
    -webkit-font-smoothing: antialiased;

    /deep/ .ant-drawer-content {
      background: rgba(255, 255, 255, 0.66);
      min-height: 520px;
    }
  }
  /deep/ .ant-radio-button-wrapper-checked {
    box-shadow: -1px 0 0 0 #ccc;
  }
  
  @media screen and(min-width: 1366px) {
    .div-wrapper {
      width: 546px;
      padding: 64px;
      border:none;
    }
    .ant-drawer-content {
      border-radius: 8px;
    }
    .title {
      margin-bottom: 4px;
      margin-top: 72px;
      font-size: 32px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo {
      display: inline-block;
      width: 160px;
      height: 32px;
    }
    .logo:before,:after {
      display: inline-block;
    }
    .language-radio {
      padding-left: 10px;
    }
    .login-form {
      height:274px;
      margin: auto 32px;
      /deep/ .ant-row {
        height: 40px;
      }
      /deep/ .ant-form-item,
      /deep/ .ant-checkbox-wrapper {
        margin-bottom:24px;
      }
    }
    .radio-group {
      display: inline-block !important;
      height: 32px;
      overflow: hidden;
      /deep/ .a-radio-button {
        display: inline-block;
      }
      /deep/ div {
        padding-left: 95px;
      }
    }
    .language-radio {
      line-height: 1;
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
  }
  @media screen and(min-width: 1536px) {
    .div-wrapper {
      width: 546px;
      padding: 64px 72px 64px 0;
      border:none;
    }
    .ant-drawer-content {
      border-radius: 8px;
    }
    .title {
      margin-bottom: 4px;
      margin-top: 72px;
      font-size: 32px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo {
      display: inline-block;
      width: 160px;
      height: 32px;
    }
    .logo:before,:after {
      display: inline-block;
    }
    .language-radio {
      padding-left: 10px;
    }
    .login-form {
      height:274px;
      margin: auto 32px;
      /deep/ .ant-row {
        height: 40px;
      }
      /deep/ .ant-form-item,
      /deep/ .ant-checkbox-wrapper {
        margin-bottom:24px;
      }
    }
    .radio-group {
      display: inline-block !important;
      height: 32px;
      overflow: hidden;
      /deep/ .a-radio-button {
        display: inline-block;
      }
      /deep/ div {
        padding-left: 155px;
      }
    }
    .language-radio {
      line-height: 1;
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
  }
  @media screen and(min-width: 1920px) {
    .div-wrapper {
      width: 726px;
      padding: 112px 152px 112px 0;
      border:none;
    }
    .ant-drawer-content {
      border-radius: 8px;
    }
    .title {
      margin-bottom: 4px;
      margin-top: 72px;
      font-size: 32px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .subtitle {
      margin-bottom: 4px;
      font-size: 10px;
      color: #0097E0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo {
      display: inline-block;
      width: 216px;
      height: 44px;
    }
    .logo:before,:after {
      display: inline-block;
    }
    .language-radio {
      padding-left: 10px;
    }
    .login-form {
      height:430px;
      margin: auto 72px;
      /deep/ .ant-row {
        height: 56px;
      }
      /deep/ .ant-form-item,
      /deep/ .ant-checkbox-wrapper {
        margin-bottom:32px;
      }
    }
    .radio-group {
      display: inline-block !important;
      height: 44px;
      overflow: hidden;
      /deep/ .a-radio-button {
        display: inline-block;
      }
      /deep/ div {
        padding-left: 180px;
        padding-top: 5px;
      }
    }
    .language-radio {
      line-height: 1;
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
  }
  .language-radio:before,:after {
    display: inline;
  }
</style>