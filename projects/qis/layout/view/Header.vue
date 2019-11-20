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
          style="height: 17px; margin: 25px 0; background: #0C9CE0"
        ></a-divider>
        <banner
          :title="$t('SystemName')"
        ></banner>
        <a-menu
          :default-selected-keys="defaultActiveMenu"
          mode="horizontal"
          @select="jump"
        >
          <template
            v-for="menu in menus"
          >
            <a-menu-item
              v-if="!menu.children || !menu.children.length"
              :key="menu.key"
              :title="$t(menu.title)"
            >
              {{ $t(menu.title) }}
            </a-menu-item>
            <sub-menu
              v-else
              :key="menu.key"
              :menu-info="menu"
            />
          </template>
        </a-menu>
      </div>
      <div class="header-index-right user-wrapper">
        <div class="content-box">
          <a-dropdown
            :trigger="['click', 'hover']"
            :get-popup-container="getPopupContainer"
            class="user-info"
          >
            <div>
              <a-avatar icon="user">
              </a-avatar>
              {{ user.realName }}
            </div>
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
                <a @click.stop.prevent="toPortal">
                  {{ $t('user_action.to_portal') }}
                </a>
              </a-menu-item>
              <a-menu-item key="3">
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
import { clearObserver, treeTransform, treeFind } from '@util/datahelper.js';
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';
import attachment from '~~/issue-attachment.js';

export default {
  name: 'Header',
  components: {
    Banner: () => import('@comp/head/Banner.vue'),
    SubMenu: () => import('@comp/head/SubMenu.vue'),
    ChangePassword: () => import('./ChangePassword.vue')
  },
  mixins: [attachment],
  data () {
    return {
      menuMap: {
        '/home/home': 'Home',
        '/question/list': 'List',
        '/question/search': 'Search',
        '/question/report': 'Report'
      },
      form: null,
      visible: false,
      record: {},
      showChangePassword: false
      // menus: [{
      //   url: '/',
      //   key: 'Home'
      // }, {
      //   url: '/question/list',
      //   key: 'List'
      // }, {
      //   url: '/question/search',
      //   key: 'Search'
      // }]
    };
  },
  computed: {
    menus () {
      const { menuMap } = this;
      return treeTransform(menu => {
        return {
          id: menu.id,
          url: menu.url,
          key: menuMap[menu.url] || menu.id,
          title: menu.name,
          children: menu.children,
          icon: menu.icon
        };
      }, this.$store.state.menus);
    },
    defaultActiveMenu () {
      const $route = this.$route;
      const $store = this.$store;
      const name = this.$route.name;
      switch (name) {
      case 'QuestionCreate':
      case 'QuestionDetail':
      case 'QuestionSuccess':
        return ['List'];
      case 'Report':
        const parentMenu = $store.state.menus.find(item => item.url === $route.path);
        const selectItem = parentMenu.children.find(item => $route.fullPath.indexOf(item.url));
        return selectItem.id ? [selectItem.id] : ['Report'];
      default:
        return name ? [name] : ['Home'];
      }
    },
    user () {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    // 【策略】监听
    data (data) {
      this.load(clearObserver(data));
    }
  },
  created () {
    const vm = this;
    // 【策略】映射
    vm.mapPropsToFields = mapPropsToFields(vm, ['origin_pd', 'new_pd', 'confirm_pd'], 'record');
    // 【策略】投影
    vm.form = vm.$form.createForm(vm, {
      mapPropsToFields: vm.mapPropsToFields,
      onValuesChange: autoUpdateFileds(vm, 'record')
    });
  },
  methods: {
    toPortal () {
      window.location.replace(this.$store.state.isProd ? '/portal' : '/');
    },
    toChangePd () {
      this.showChangePassword = true;
    },
    jump (selectedMenu) {
      const menu = treeFind(item => item.key === selectedMenu.key ,this.menus);
      const path = menu.url;
      const resolved = this.$router.resolve(path).resolved;
      if (resolved.name === '404') {
        this.$message.warning('前端未配置的路由');
      } else {
        this.$store.commit('question/initState');
        this.$router.push({...resolved, path});
        this.$store.dispatch('refresh');
      }
    },
    getPopupContainer () {
      return document.querySelector('.user-info');
    },
    logoutHandle () {
      this.$store.dispatch('logout');
      // TODO: 做好多应用重定向
      // window.location.href = '/';
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
    /deep/ .ant-menu-submenu {
      top: 2px;
      line-height: 60px;
    }
    .header-index-wide {
      width: 1200px;
      height: 64px;
      margin: auto;
      padding-left: 0;
      display: flex;
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
        background-image: url("/static/logo.svg");
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
