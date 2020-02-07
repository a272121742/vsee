<template>
  <a-layout v-if="!reloading">
    <a-layout-header>
      <div class="child-view header-index-wide">
        <span style="position: fixed; left: 34%;">
          <h2
            v-if="$store.state.isBuildTest"
            style="color:red;"
          >
            <!-- 测试环境 -->
            {{ $t('env.name') }}
          </h2>
        </span>
        <div class="com-info">
          <v-icon
            class="logo"
            type="iconlogo"
            @click="$store.dispatch('gohome')"
          ></v-icon>
          <a-divider
            type="vertical"
            style="height: 17px; margin: 25px 0; background: #0C9CE0"
          ></a-divider>
          <banner
            class="banner"
            title="质量问题分析解决平台"
          ></banner>
        </div>
        <div class="nav-info">
          <Menu class="menus"></Menu>
          <user-avatar></user-avatar>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content>
      <a-spin :spinning="refreshing">
        <transition v-if="!refreshing && $store.state.userInfo.id">
          <router-view
            class="child-view"
          />
        </transition>
      </a-spin>
    </a-layout-content>
    <a-layout-footer>
      <div class="child-view"></div>
    </a-layout-footer>
    <helper v-if="$store.state.isDev"></helper>
  </a-layout>
</template>

<script>
export default {
  components: {
    Banner: () => import('@comp/head/Banner.vue'),
    Menu: () => import('./Menu.vue'),
    UserAvatar: () => import('./UserAvatar.vue'),
    Helper: () => import('@comp/helper/Helper.vue'),
  },
  data () {
    return {
      menus: [{
        key: 'Home',
        path: '/',
      }, {
        key: 'List',
        path: '/question/list',
      }, {
        key: 'Search',
        path: '/question/search',
      }],
    };
  },
  computed: {
    reloading () {
      return this.$store.state.reload;
    },
    refreshing () {
      return this.$store.state.refresh;
    },
    custMenu () {
      return [this.$route.name || 'Home'];
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
  created () {

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
  @sider-width: 0px;
  // 设置`ant-design`的所有布局元素透明
  div[class^="ant-layout"] {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
  }
  .ant-layout {
    position: relative;
    height: 100vh;
    // 版心居中
    /deep/ .child-view {
      width: 1200px;
      margin-left: auto;
      margin-right: auto;
      transition: all .5s cubic-bezier(.55,0,.1,1);
    }
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
            color: #0097E0;
            width: 168px;
            height: 40px;
            margin: 12px 16px 12px 0;
            cursor: pointer;
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
    .ant-layout-content {
      margin-top: @header-height;
      margin-left: @sider-width;
      transition: margin-left .3s;
      position: relative;
      min-height: calc(100vh - @header-height);
      overflow-x: visible;
    }
    // 底部固定
    .ant-layout-footer {
      width: 100%;
      padding: 8px 0;
      position: fixed;
      bottom: 0;
      z-index: 6000;
    }
  }
</style>
