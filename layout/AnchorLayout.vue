<template>
  <vue-scroll
    class="app-root-scroll"
    :ops="$store.state.config.scroll_config"
    @handle-scroll="contentScroll"
  >
    <a-spin
      v-if="this.$store.state.reload"
      class="app-root-loading"
    />
    <template v-else>
      <a-layout class="app-layout">
        <a-layout-header class="app-layout-header">
          <Header />
        </a-layout-header>
        <a-layout class="app-layout-content">
          <a-layout-sider
            v-if="[void 0, 'anchor', 'cust'].includes($store.state.config.menu_type)"
            v-model="collapsed"
            :theme="theme"
            class="app-content-sider"
            collapsible
            :trigger="collapsible ? void 0 : null"
          >
            <vue-scroll class="app-content-sider-scroll">
              <component :is="isSider" />
            </vue-scroll>
          </a-layout-sider>
          <a-layout-header
            v-if="false"
            class="app-content-header"
          >
            <!-- <Breadcrumb v-if="false" />
        <Tab v-else /> -->
          </a-layout-header>
          <a-layout-content
            ref="content"
            class="app-content-wrapper"
          >
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
    <a-back-top
      v-if="$store.state.config.back_top"
      :target="getScrollContainer"
      style="right: 12px; bottom: 12px;"
    />
  </vue-scroll>
</template>

<script>
import Vue from 'vue';
import { BackTop } from 'ant-design-vue';
import './layout.less';

Vue.use(BackTop);

export default {
  components: {
    Header: () => import('~/layout/view/Header.vue'),
    AnchorContent: () => import('./AnchorContent.vue'),
    VueScroll: () => import('vuescroll'),
  },
  data () {
    const collapsible = false; // this.$store.state.config.menu_collapsible;
    return {
      collapsible,
    };
  },
  computed: {
    theme () {
      return this.$store.state.config.dark ? 'dark' : 'light';
    },
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
      if (this.$store.state.isDev || this.$store.state.isDebug) {
        return () => import('@comp/helper/Helper.vue');
      }
      return null;
    },
  },
  methods: {
    contentScroll (vertical, horizontal, event) {
      this.$root.contentScroll && this.$root.contentScroll(event, vertical, horizontal);
    },
    getScrollContainer () {
      return document.querySelector('.app-root-scroll > .__panel');
    },
  },
};
</script>
