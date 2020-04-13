<template>
  <vue-scroll
    class="app-scroll"
    :ops="$store.state.config.scroll_config"
  >
    <a-layout class="app-layout">
      <a-layout-header class="app-layout-header">
        <Header>
          <template #nav>
            <component :is="isNav"></component>
          </template>
        </Header>
      </a-layout-header>
      <a-layout class="app-layout-content">
        <a-layout-sider
          v-if="false"
          v-model="collapsed"
          theme="light"
          class="app-content-sider"
          collapsible
        >
          <SiderMenu />
        </a-layout-sider>
        <a-layout-header
          v-if="$store.state.config.content_head"
          class="app-content-header"
        >
          <component :is="isContentHeader"></component>
        </a-layout-header>
        <a-layout-content class="app-content-warpper">
          <a-spin
            class="app-content-spiner"
            :spinning="refreshing"
          >
            <transition>
              <keep-alive v-if="$store.state.config.keep_alive">
                <router-view
                  class="content-child-view"
                />
              </keep-alive>
              <router-view
                v-else
                class="content-child-view"
              />
            </transition>
          </a-spin>
        </a-layout-content>
        <a-layout-footer class="app-content-footer">
        </a-layout-footer>
      </a-layout>
      <a-layout-footer class="app-layout-footer">
      </a-layout-footer>
      <component :is="isHelper"></component>
    </a-layout>
  </vue-scroll>
</template>

<script>
import './layout.less';

export default {
  components: {
    Header: () => import('~/layout/view/Header.vue'),
    VueScroll: () => import('vuescroll'),
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
    isNav () {
      if ([void 0, 'nav'].includes(this.$store.state.config.menu_type)) {
        return () => import('./NavMenu.vue');
      }
      if (['cust'].includes(this.$store.state.config.menu_type)) {
        return () => import('~/layout/view/Menu.vue');
      }
      return null;
    },
    isContentHeader () {
      if (this.$store.state.config.content_head === 'bread') {
        return () => import('@layout/Breadcrumb.vue');
      }
      if (this.$store.state.config.content_head === 'tab') {
        return () => import('@layout/Tab.vue');
      }
      if (this.$store.state.config.content_head === 'cust') {
        return () => import('~/layout/view/ContentHeader.vue');
      }
      return null;
    },
    isHelper () {
      if (this.$store.state.isDev) {
        return () => import('@comp/helper/Helper.vue');
      }
      return null;
    },
  },
};
</script>
