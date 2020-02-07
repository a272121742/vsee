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
          <v-logo
            class="logo"
            type="iconlogo"
            @click="$store.dispatch('gohome')"
          />
          <a-divider
            type="vertical"
            style="height: 25%; margin: 25px 0; background: #0097E0"
          ></a-divider>
          <banner
            class="banner"
            title="售后质量模块"
          ></banner>
        </div>
        <div class="nav-info">
          <user-avatar></user-avatar>
        </div>
      </div>
    </a-layout-header>
    <a-layout-sider
      v-model="collapsed"
      width="256px"
      theme="light"
      collapsible
    >
      <left-menu v-if="!$store.state.reload"></left-menu>
    </a-layout-sider>
    <a-layout-content>
      <main class="main-content">
        <a-card
          :bordered="false"
          class="content-top"
        >
          <template #title>
            <Breadcrumb></Breadcrumb>
          </template>
        </a-card>
        <a-card
          :bordered="false"
          class="content-body"
        >
          <!-- <template #title>
            <Breadcrumb></Breadcrumb>
          </template> -->
          <a-spin :spinning="refreshing">
            <transition v-if="!refreshing">
              <router-view
                class="child-view"
              />
            </transition>
          </a-spin>
        </a-card>
      </main>
      <a-layout-footer></a-layout-footer>
    </a-layout-content>
    <helper v-if="$store.state.isDev"></helper>
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
  },
  data () {
    return {
      collapsed: false,
      blocking: true,
    };
  },
  computed: {
    refreshing () {
      return this.$store.state.refresh;
    },
    reloading () {
      return this.$store.state.reload;
    },
  },
  // watch: {
  //   reloading: {
  //     handler (value) {
  //       !value && this.init();
  //     },
  //     immediate: true,
  //   },
  // },
  created () {
    this.init();
  },
  methods: {
    init () {
      // this.$store.dispatch('fetchMenus').then((res) => {
      //   this.$store.commit('setMenus', res);
      // });
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
  @sider-width: 256px;
  @sider-min: 80px;
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
      z-index: 6010;
      padding: 0 24px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      .header-index-wide {
        display: flex;
        .com-info {
          flex: 0 1 auto;
          display: flex;
          .logo {
            color: @primary-color;
            font-size: 168px;
            margin: auto 16px;
            cursor: pointer;
            svg {
              height: 64px;
            }
          }
          .banner {
            height: @header-height;
            // /deep/ .ant-notification-notice-message {
            //   color: #FFF;
            // }
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
      z-index: 6000;
      position: fixed;
      top: @header-height;
      left: 0;
      bottom: 0;
      width: @sider-width!important;
      max-width: @sider-width!important;
      min-width:  @sider-width!important;
      flex: 0 0 @sider-width;
      overflow: hidden;
      /deep/ .ant-layout-sider-trigger {
        &:hover {
          background: #e6fbff;;
        }
      }
    }

    .ant-layout-sider-collapsed + .ant-layout-content {
      margin-left: @sider-min;
      /deep/ .content-top {
        left: @sider-min!important;
      }
    }
    .ant-layout-content {
      width: calc(100% - @sider-width);
      margin-left: @sider-width;
      transition: margin-left .3s;
      position: relative;
      min-height: calc(100vh - @header-height);
      overflow-x: visible;
      .main-content {
        .content-top {
          position: fixed;
          top: @header-height;
          left: @sider-width;
          right: 0;
          z-index: 30;
          display: block;
          padding: 16px 16px 0;
          background: #f7f7f7;
          /deep/ .ant-card-head {
            padding: 0 24px;
            min-height: 0;
            background-color: #FFF;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12);
            .ant-card-head-title {
              padding: 11px 0;
            }
          }
        }
        .content-body {
          margin: 62px 16px 16px;
          min-height: calc(100vh - 144px);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
          /deep/ .ant-card-head {
            padding: 0 24px!important;
          }
          /deep/ .ant-card-body {
            padding: 12px;
          }
        }
        .ant-spin-nested-loading {
          padding: 0 12px;
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
