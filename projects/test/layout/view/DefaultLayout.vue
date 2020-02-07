<template>
  <a-layout>
    <a-layout-header>
      <div class="child-view header-index-wide">
        <div class="com-info">
          <div class="logo"></div>
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
          <a-menu
            class="menus"
            :selected-keys="custMenu"
            mode="horizontal"
          >
            <a-menu-item
              v-for="menu in menus"
              :key="menu.key"
              :title="$t(menu.key)"
              @click="jump(menu.path)"
            >
              {{ $t(menu.key) }}
            </a-menu-item>
          </a-menu>
          <a-dropdown
            class="options"
            :trigger="['click']"
          >
            <div>
              <a-avatar icon="user">
              </a-avatar>
              {{ user.realName }}
            </div>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a href="javascript:;">
                  {{ $t('user_action.manual') }}
                </a>
              </a-menu-item>
              <a-menu-item key="1">
                <a href="/">
                  {{ $t('user_action.to_portal') }}
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
    </a-layout-header>
    <a-layout-content>
      <a-spin :spinning="refreshing">
        <transition v-if="!refreshing">
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
    // LayoutHeader: () => import('./Header.vue'),
    Banner: () => import('@comp/head/Banner.vue'),
    Helper: () => import('@comp/helper/Helper.vue')
  },
  data () {
    return {
      menus: [{
        key: 'Home',
        path: '/'
      }, {
        key: 'List',
        path: '/question/list'
      }, {
        key: 'Search',
        path: '/question/search'
      }]
    };
  },
  computed: {
    refreshing () {
      return this.$store.state.refresh;
    },
    custMenu () {
      return [this.$route.name || 'Home'];
    },
    user () {
      return this.$store.state.userInfo;
    }
  },
  created () {
    console.log(this);
    
    if (this.$store) {
      // this.$store.dispatch('layout/getMenus');
      // this.$store.dispatch('layout/getPermissions');
      // this.$store.dispatch('layout/getWorkflows');
      // this.$store.dispatch('layout/getUserInfo');
    }
  },
  methods: {
    jump (path) {
      this.$router.push({ path });
      this.$store.dispatch('refresh');
    },
    logoutHandle () {
      this.$store && this.$store.dispatch('logout');
      // TODO: 做好多应用重定向
      window.location.href = '/';
    }
  }
};
</script>

<style lang="less" scoped>
  .ant-layout {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
    // 版心居中
    /deep/ .child-view {
      width: 1200px;
      margin: 0 auto;
    }
    // 顶部固定
    .ant-layout-header {
      width: 100%;
      height: 64px;
      background: #FFF;
      position: fixed;
      top: 0;
      z-index: 6000;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .06);
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
            height: 64px;
          }
        }
        .nav-info {
          display: inline-flex;
          justify-content: flex-end;
          flex: 1 0 720px;
          overflow: hidden;
          .menus {
            height: 64px;
            line-height: 62px;
            margin-right: 32px;
          }
        }
      }
    }
    .ant-layout-content {
      width: 100%;
      margin-top: 64px;
      .child-view {
        margin: 0 auto;
        transition: all .5s cubic-bezier(.55,0,.1,1);
      }
    }
    // 底部固定
    .ant-layout-footer {
      width: 100%;
      padding: 8px 0;    
      position: fixed;
      bottom: 0;
      z-index: 6000;
      background-color: transparent!important;
    }
  }
</style>
