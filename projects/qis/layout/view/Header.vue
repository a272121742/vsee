<template>
  <a-layout-header>
    <div class="header-index-wide">
      <div class="header-index-left">
        <div class="logo">
        </div>
        <a-divider
          type="vertical"
          style="height: 17px; margin: 25px 0; background: #0C9CE0"
        ></a-divider>
        <banner
          title="质量问题分析解决平台"
        ></banner>
        <!-- <a-menu
          :selected-keys="defaultActiveMenu"
          mode="horizontal"
        >
          <template v-for="item in menus">
            <a-menu-item
              v-if="!item.children"
              :key="item.id"
              @click="jump(item.url)"
            >
              <a-icon
                v-if="item.icon"
                :type="item.icon"
              ></a-icon>
              <span>{{ item.name }}</span>
            </a-menu-item>
            <sub-menu
              v-else
              :key="item.id"
              :menus-info="item"
            />
          </template>
        </a-menu> -->
        <a-menu
          :selected-keys="defaultActiveMenu"
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
      </div>
      <div class="header-index-right user-wrapper">
        <div class="content-box">
          <a-dropdown :trigger="['click', 'hover']">
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
    </div>
  </a-layout-header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    Banner: () => import('@comp/head/Banner.vue')
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
    // menus () {
    //   return this.$store.state.menus;
    // },
    defaultActiveMenu () {
      return [this.$route.name || 'Home'];
    },
    user () {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    jump (path) {
      const resolved = this.$router.resolve(path).resolved;
      if (resolved.name === '404') {
        this.$message.warning('前端未配置的路由');
      } else {
        this.$router.push({ path: resolved.path });
        this.$store.dispatch('refresh');
      }
    },
    logoutHandle () {
      this.$store && this.$store.dispatch('layout/logout');
      // TODO: 做好多应用重定向
      window.location.href = '/portal';
    }
  }
}
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
        width: 168px;
        height: 40px;
        margin: 12px 16px 12px 0;
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
