<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-layout-header">
      <Header />
    </a-layout-header>
    <a-layout class="app-layout-content">
      <a-layout-sider
        v-if="true"
        v-model="collapsed"
        :theme="theme"
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
    theme () {
      return this.$store.state.config.dark ? 'dark' : 'light';
    },
    refreshing () {
      return this.$store.state.refresh;
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
