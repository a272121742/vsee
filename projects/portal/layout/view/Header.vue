<template>
  <a-layout-header>
    <div class="header-index-wide">
      <div class="header-index-left">
        <div class="logo">
        </div>
        <a-divider type="vertical" style="height: 16px; margin: 24px 0; background: #0C9CE0"></a-divider>
        <banner title="全面质量管理系统" desc="Total Quality Information System"></banner>
      </div>
      <div class="header-index-right user-wrapper">
        <div class="content-box">
          <language-radio />
          <a-dropdown :trigger="['click', 'hover']">
            <a-button
              shape="circle"
              icon="user"
            />
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a @click.stop.prevent="refresh">刷新</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a href="http://www.alipay.com/">编辑信息</a>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="logoutHandle">退出系统</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  components: {
    Banner: () => import('@comp/head/Banner.vue'),
    LanguageRadio: () => import('@comp/i18n/LanguageRadio.vue')
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    logoutHandle () {
      Cookies.remove('login_token');
      window.location.href = window.location.href;
    }
  }
}
</script>

<style lang="less" scoped>
  /* 重写头部 */
  .ant-layout-header {
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.06);
    /deep/ .ant-menu-item {
      height: 64px;
      line-height: 64px;
    }
    .header-index-wide {
      max-width: 1200px;
      margin: auto;
      padding-left: 0;
      display: flex;
      height: 64px;
      
    }

    .header-index-left {
      flex: 0 1 1080px;
      display: flex;
      .logo {
        width: 168px;
        height: 32px;
        margin: 16px 16px 16px 0;
        float: left;
        background-image: url("/static/logo.png");
        img,
        svg {
          display: inline-block;
          vertical-align: middle;
          height: 32px;
          width: 32px;
        }

        h1 {
          color: #fff;
          display: inline-block;
          vertical-align: top;
          font-size: 16px;
          margin: 0 0 0 12px;
          font-weight: 400;
        }
      }
    }

    .header-index-right {
      flex: 1 0 auto;
      height: 64px;
      overflow: hidden;
      color: rgba(255, 255, 255, .65);

      .content-box {
        float: right;
        button, span {
          margin-left: 24px;
        }
      }
    }
    .user-wrapper {
      float: right;
      height: 100%;
    }
  }
</style>

