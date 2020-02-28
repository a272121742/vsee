<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-layout-header">
      <Header />
    </a-layout-header>
    <a-layout class="app-layout-content">
      <a-layout-sider
        v-if="true"
        v-model="collapsed"
        theme="light"
        class="app-content-sider"
        collapsible
      >
        <SiderMenu v-if="false" />
        <AnchorMenu v-else />
      </a-layout-sider>
      <a-layout-header
        v-if="false"
        class="app-content-header"
      >
        <Breadcrumb v-if="false" />
        <Tab v-else />
      </a-layout-header>
      <a-layout-content class="app-content-warpper">
        <a-spin
          class="app-content-spiner"
          :spinning="refreshing"
        >
          <transition v-if="false">
            <keep-alive v-if="true">
              <router-view
                class="content-child-view"
              />
            </keep-alive>
            <router-view
              v-else
              class="content-child-view"
            />
          </transition>
          <AnchorContent v-else />
        </a-spin>
      </a-layout-content>
      <a-layout-footer class="app-content-footer">
      </a-layout-footer>
    </a-layout>
    <a-layout-footer class="app-layout-footer">
    </a-layout-footer>
    <Helper v-if="$store.state.isDev" />
  </a-layout>
</template>

<script>
export default {
  components: {
    Header: () => import('./Header.vue'),
    SiderMenu: () => import('./SiderMenu.vue'),
    AnchorMenu: () => import('./AnchorMenu.vue'),
    AnchorContent: () => import('./AnchorContent.vue'),
    Breadcrumb: () => import('./Breadcrumb.vue'),
    Tab: () => import('./Tab.vue'),
    Helper: () => import('@comp/helper/Helper.vue'),
  },
  data () {
    return {
      collapsed: false,
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
  created () {
    this.init();
  },
  methods: {
    init () {
      this.$store.dispatch('fetchUser').then(() => {
        this.blocking = false;
      }).catch((err) => {
        err && this.$message.error(this.$t(err));
      });
    },
  },
};
</script>

<style lang="less" scoped>
@app-layout-header-height: 64px;
@app-layout-footer-height: 0px;
@app-content-sider-width: 200px;
@app-content-sider-width-min: 80px;
@app-content-sider-trigger-height: 48px;
@app-content-header-height: 48px;
@app-content-footer-height: 0px;
@app-layout-zindex: 1050;
@app-content-zindex: 1000;
.app-layout {
  .app-layout-header {
    position: fixed;
    z-index: @app-layout-zindex;
    top: 0;
    left: 0;
    right: 0;
    height: @app-layout-header-height;
    padding: 0;
    box-shadow: @box-shadow-h;
    background: #FFF;
  }
  .app-layout-content {
    margin-top: @app-layout-header-height;
    margin-bottom: @app-layout-footer-height;
    .app-content-sider {
      position: fixed;
      z-index: @app-layout-zindex - 1;
      top: @app-layout-header-height;
      left: 0;
      bottom: @app-layout-footer-height;
      padding: 0;
      box-shadow: @box-shadow-v;
      overflow-x: hidden;
      /deep/ .ant-layout-sider-trigger {
        z-index: @app-layout-zindex;
        height: @app-content-sider-trigger-height;
        bottom: @app-layout-footer-height;
      }
      /deep/ .ant-layout-sider-children {
        &::after {
          content: '';
          display: inline-block;
          padding-bottom: @app-content-sider-trigger-height;
        }
      }
      &.ant-layout-sider-collapsed {
        & + .app-content-header {
          left: @app-content-sider-width-min;
          & + .app-content-warpper {
            margin-left: @app-content-sider-width-min;
            & + .app-content-footer {
              left: @app-content-sider-width-min;
            }
          }
        }
      }
      & ~ .app-content-warpper {
        margin-top: 0;
        .app-content-spiner {
          min-height: calc(100vh - @app-layout-header-height - @app-layout-footer-height - @app-content-footer-height - 32px);
        }
      }
    }
    .app-content-header {
      position: fixed;
      z-index: @app-content-zindex;
      left: @app-content-sider-width;
      top: @app-layout-header-height;
      right: 0;
      padding: 0;
      height: @app-content-header-height;
      background: #FFF;
      box-shadow: @box-shadow-h;
    }
    &:not(.ant-layout-has-sider) .app-content-header{
      left: 0;
    }
    .app-content-warpper {
      padding: 0;
      margin-top: @app-content-header-height;
      margin-bottom: @app-content-footer-height;
      margin-left: @app-content-sider-width;
      .app-content-spiner {
        margin: 16px;
        background: #FFF;
        box-shadow: @box-shadow-base;
        min-height: calc(100vh - @app-layout-header-height - @app-content-header-height - @app-layout-footer-height - @app-content-footer-height - 32px);
        .content-child-view {
          &:not(iframe) {
            padding: 12px 24px;
          }
        }
      }
    }
    &:not(.ant-layout-has-sider) .app-content-warpper{
      margin-left: 0;
    }
    .app-content-footer {
      position: fixed;
      z-index: @app-content-zindex;
      bottom: @app-layout-footer-height;
      left: @app-content-sider-width;
      right: 0;
      height: @app-content-footer-height;
      padding: 0;
      background: rgba(122, 122, 122, 0.2);
    }
    &:not(.ant-layout-has-sider) .app-content-footer{
      left: 0;
    }
  }
  .app-layout-footer {
    position: fixed;
    z-index: @app-layout-zindex;
    bottom: 0;
    left: 0;
    right: 0;
    height: @app-layout-footer-height;
    padding: 0;
    background: rgba(255, 255, 255, 0.3)!important;
  }
}
</style>
