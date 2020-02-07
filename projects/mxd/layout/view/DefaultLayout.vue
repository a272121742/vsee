<template>
  <a-layout>
    <a-layout-header>
      <div class="header-index-wide">
        <!-- 测试提示 -->
        <span style="position: fixed; left: 40%;">
          <h2
            v-if="$store.state.isBuildTest"
            style="color:red;"
          >
            <!-- 测试环境 -->
            {{ $t('env.name') }}
          </h2>
        </span>
        <div class="com-info">
          <div class="logo"></div>
          <a-divider
            type="vertical"
            style="height: 25%; margin: 25px 0; background: #0C9CE0"
          ></a-divider>
          <banner
            class="banner"
            title="全面质量信息管理系统"
            desc="Total Quality Information System"
          ></banner>
        </div>
        <div class="nav-info">
          <language-radio style="margin-right: 48px; margin-top: 21px; line-height: 100%;" />
          <user-avatar></user-avatar>
        </div>
      </div>
    </a-layout-header>
    <a-layout-sider>
      <left-menu></left-menu>
    </a-layout-sider>
    <a-layout-content>
      <main class="main-content">
        <Breadcrumb></Breadcrumb>
        <a-spin :spinning="refreshing">
          <transition v-if="!refreshing">
            <router-view
              class="child-view"
            />
          </transition>
        </a-spin>
      </main>
      <a-layout-footer></a-layout-footer>
    </a-layout-content>
    <helper></helper>
  </a-layout>
</template>

<script>
export default {
  components: {
    Banner: () => import('@comp/head/Banner.vue'),
    LeftMenu: () => import('./Menu.vue'),
    UserAvatar: () => import('./UserAvatar.vue'),
    Helper: () => import('@comp/helper/Helper.vue'),
    Breadcrumb: () => import('./Breadcrumb.vue'),
    LanguageRadio: () => import('@comp/i18n/LanguageRadio.vue'),
  },
  // data () {
  //   return {
  //     blocking: true
  //   };
  // },
  computed: {
    refreshing () {
      return this.$store.state.refresh;
    },
    reloading () {
      return this.$store.state.reload;
    },
  },
  watch: {
    reloading: {
      handler (value) {
        !value && this.init();
      },
      immediate: true,
    },
  },
  methods: {
    init () {
      this.$store.dispatch('fetchUser').then(() => {
        this.$store.dispatch('fetchPermissions');
        this.blocking = false;
      }).catch((err) => {
        err && this.$message.error(this.$t(err));
      });
    },
  },
};
</script>

<style lang="less" scoped>
  @header-height: 64px;
  @sider-width: 200px;
  // 设置`ant-design`的所有布局元素透明
  div[class^="ant-layout"] {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
  }
  .ant-layout {
    position: relative;
    height: 100%;
    padding-top: @header-height;
    // 顶部固定
    .ant-layout-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: @header-height;
      background: #FFF!important;
      z-index: 6000;
      padding: 0 24px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12);
      .header-index-wide {
        display: flex;
        .com-info {
          flex: 0 1 auto;
          display: flex;
          .logo {
            width: 168px;
            height: 40px;
            margin: 12px 16px 12px 0;
            background: url("/static/logo.svg") no-repeat;
            background-size: 100%;
          }
          .banner {
            height: @header-height;
          }
        }
        .nav-info {
          display: inline-flex;
          justify-content: flex-end;
          flex: 1 0 720px;
          overflow: hidden;
          .menus {
            height: @header-height;
            line-height: 62px;
            margin-right: 32px;
          }
        }
      }
    }
    .ant-layout-sider {
      position: fixed;
      top: @header-height;
      left: 0;
      bottom: 0;
      width: @sider-width;
      overflow: hidden;
    }
    .ant-layout-content {
      margin-left: @sider-width;
      transition: margin-left .3s;
      position: relative;
      min-height: calc(100vh - @header-height);
      overflow-x: visible;
      .main-content {
        .ant-breadcrumb {
          position: fixed;
          top: @header-height;
          left: @sider-width;
          right: 0;
          z-index: 6000;
          display: block;
          padding: 16px 24px;
          background: #f7f7f7;
        }
        .ant-spin-nested-loading {
          padding: 48px 16px 16px;
        }
        .child-view {
          background: #FFF;
        }
      }
    }
    // 底部固定
    /deep/ .ant-layout-footer {
      width: calc(100% - @sider-width);
      padding: 8px 0;
      position: fixed;
      bottom: 0;
      z-index: 6000;
    }
  }
</style>
