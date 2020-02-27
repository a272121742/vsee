<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-layout-header">
    </a-layout-header>
    <a-layout class="app-layout-content">
      <a-layout-sider
        v-if="!$store.state.config.useSider"
        v-model="collapsed"
        theme="light"
        class="app-content-sider"
        collapsible
      >
        <div>
          头部文字<br />
          文字<br />
          文字<br />
          文字<br />
          文字<br />
          到底了<br />
        </div>
      </a-layout-sider>
      <a-layout-header class="app-content-header"></a-layout-header>
      <a-layout-content class="app-content-warpper">
        <a-spin
          class="app-content-spiner"
          :spinning="refreshing"
        >
          <transition v-if="!refreshing">
            <router-view
              class="child-view"
            />
          </transition>
        </a-spin>
      </a-layout-content>
      <a-layout-footer class="app-content-footer">
      </a-layout-footer>
    </a-layout>
    <a-layout-footer class="app-layout-footer">
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
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
@app-layout-zindex: 6999;
@app-content-zindex: 6888;
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
    }
    .app-content-header {
      position: fixed;
      z-index: @app-content-zindex;
      left: @app-content-sider-width;
      top: @app-layout-header-height;
      right: 0;
      width: 100%;
      padding: 0;
      height: @app-content-header-height;
      background: #FFF;
      box-shadow: @box-shadow-h;
    }
    .app-content-warpper {
      padding: 0;
      margin-top: @app-content-header-height;
      margin-bottom: @app-content-footer-height;
      margin-left: @app-content-sider-width;
      .app-content-spiner {
        margin: 16px;
        padding: 16px 24px;
        background: #FFF;
        box-shadow: @box-shadow-base;
      }
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
