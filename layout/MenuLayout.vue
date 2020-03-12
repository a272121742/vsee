<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-layout-header">
      <Header />
    </a-layout-header>
    <a-layout class="app-layout-content">
      <a-layout-sider
        v-if="[void 0, 'sider', 'cust'].includes($store.state.config.menu_type)"
        v-model="collapsed"
        theme="light"
        class="app-content-sider"
        collapsible
        :trigger="collapsible ? void 0 : null"
      >
        <component :is="isSider"></component>
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
          <transition v-if="!refreshing">
            <keep-alive v-if="$store.state.config.keey_alive">
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
</template>

<script>
export default {
  components: {
    Header: () => import('~/layout/view/Header.vue'),
  },
  data () {
    const collapsible = this.$store.state.config.menu_collapsible;
    return {
      collapsible,
    };
  },
  computed: {
    collapsed: {
      get () {
        return this.$store.state.config.menu_collapsed;
      },
      set (value) {
        this.$store.commit('setConfig', {
          ...this.$store.state.config,
          menu_collapsed: value,
        });
      },
    },
    refreshing () {
      return this.$store.state.refresh;
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
    isSider () {
      if ([void 0, 'sider'].includes(this.$store.state.config.menu_type)) {
        return () => import('./SiderMenu.vue');
      }
      if (['cust'].includes(this.$store.state.config.menu_type)) {
        return () => import('~/layout/view/Menu.vue');
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
  created () {
    this.init();
  },
  methods: {
    init () {
      this.$store.dispatch('fetchUser').then(() => {
      }).catch((err) => {
        err && this.$message.error(this.$t(err));
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "layout.less";
</style>
