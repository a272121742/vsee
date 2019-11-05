<template>
  <a-layout-header>
    <change-password :visible.sync="showChangePassword"></change-password>
    <div class="header-index-wide">
      <div class="header-index-left">
        <div
          class="logo"
          @click="toPortal"
        >
        </div>
        <a-divider
          type="vertical"
          style="height: 16px; margin: 24px 0; background: #0C9CE0"
        ></a-divider>
        <banner
          title="全面质量信息管理系统"
          desc="Total Quality Information System"
        ></banner>
      </div>
      <div class="header-index-right user-wrapper">
        <div class="content-box">
          <language-radio />
          <a-dropdown
            :trigger="['click', 'hover']"
            class="user-info"
          >
            <span>
              <a-avatar icon="user">
              </a-avatar>
              {{ $store.state.userInfo.realName }}
            </span>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a @click="downloadFromStatic($t('download.user_manual'))">
                  {{ $t('user_action.manual') }}
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="toChangePd">
                  {{ $t('user_action.change_pd') }}
                </a>
              </a-menu-item>
              <a-menu-item key="2">
                <a @click.stop.prevent="logoutHandle">
                  {{ $t('user_action.logout') }}
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import attachment from '~~/attachment.js';

export default {
  components: {
    Banner: () => import('@comp/head/Banner.vue'),
    ChangePassword: () => import('./ChangePassword.vue'),
    LanguageRadio: () => import('@comp/i18n/LanguageRadio.vue')
  },
  mixins: [attachment],
  data () {
    return {
      showChangePassword: false
    };
  },
  computed: {
    menus () {
      return this.$store.state.menus;
    }
  },
  methods: {
    toPortal () {
      window.location.replace(this.$store.state.isProd ? '/portal' : '/');
    },
    toChangePd () {
      this.showChangePassword = true;
    },
    logoutHandle () {
      this.$store.dispatch('logout');
    }
  }
};
</script>

<style lang="less" scoped>
  /* 重写头部 */
  .ant-layout-header {
    background: #FFFFFF;
    padding: 0px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
    /deep/ .ant-menu {
      display: flex;
      justify-content: right;
      align-items: center;
      border-bottom: 1px solid transparent!important;
    }
    /deep/ .ant-menu-item {
      height: 64px;
      line-height: 64px;
    }
    .header-index-wide {
      width: 1200px;
      margin: 0 auto;
      padding-left: 0;
      display: flex;
      height: 64px;
    }
    .header-index-left {
      flex: 0 1 calc(100% - 128px);
      display: flex;
      .logo {
        cursor: pointer;
        display: inline-block;
        width: 168px;
        height: 40px;
        margin: 12px 16px 12px 0;
        background: url("/static/logo.svg") no-repeat;
        background-size: 100%;
        img {
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
      .user-info {
        cursor: pointer;
        display: inline-block;
      }
    }
  }
</style>
