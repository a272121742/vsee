<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-layout-header">
      <Header />
    </a-layout-header>
    <a-layout class="app-layout-content">
      <a-layout-sider
        v-if="[void 0, 'anchor', 'cust'].includes($store.state.config.menu_type)"
        v-model="collapsed"
        theme="light"
        class="app-content-sider"
        collapsible
        :trigger="collapsible ? void 0 : null"
      >
        <component :is="isSider"></component>
      </a-layout-sider>
      <a-layout-header
        v-if="false"
        class="app-content-header"
      >
        <!-- <Breadcrumb v-if="false" />
        <Tab v-else /> -->
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
    <component :is="isHelper"></component>
  </a-layout>
</template>

<script>
export default {
  components: {
    Header: () => import('~/layout/view/Header.vue'),
    AnchorContent: () => import('./AnchorContent.vue'),
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
    isSider () {
      if ([void 0, 'anchor'].includes(this.$store.state.config.menu_type)) {
        return () => import('./AnchorMenu.vue');
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
        this.blocking = false;
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
