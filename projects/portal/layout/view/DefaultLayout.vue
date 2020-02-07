<template>
  <a-layout>
    <a-layout-header>
      <div class="child-view header-index-wide">
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
    Banner: () => import('@comp/head/Banner.vue'),
    UserAvatar: () => import('./UserAvatar.vue'),
    LanguageRadio: () => import('@comp/i18n/LanguageRadio.vue'),
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
        this.$store.dispatch('fetchMenus');
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
