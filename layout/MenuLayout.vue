<template>
  <vue-scroll
    class="app-scroll"
    :ops="$store.state.config.scroll_config"
  >
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
          <vue-scroll
            class="app-content-sider-scroll"
            :ops="menuScroll"
          >
            <component
              :is="isSider"
              :current-directory="currentDirectory"
            ></component>
          </vue-scroll>
        </a-layout-sider>
        <a-layout-header
          v-if="$store.state.config.content_head"
          :class="{ 'app-content-header': true, 'app-content-tab': !!isTab}"
        >
          <component
            :is="isContentHeader"
            :current-directory="currentDirectory"
          ></component>
        </a-layout-header>
        <a-layout-content
          v-if="!isTab"
          class="app-content-warpper"
        >
          <a-spin
            class="app-content-spiner"
            :spinning="refreshing"
          >
            <transition v-if="!refreshing">
              <keep-alive v-if="$store.state.config.keep_alive">
                <router-view
                  v-if="!isTab"
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
import { uniqWith } from 'ramda';
import './layout.less';

export default {
  components: {
    Header: () => import('~/layout/view/Header.vue'),
    VueScroll: () => import('vuescroll'),
  },
  data () {
    const collapsible = this.$store.state.config.menu_collapsible;
    return {
      collapsible,
      menuScroll: {
        scrollPanel: {
          scrollingX: false,
        },
      },
    };
  },
  computed: {
    currentDirectory () {
      const { matched } = this.$route;
      const last = matched[matched.length - 1];
      if (last) {
        const splitList = last.path.split('/').reduce((arr, item) => {
          const len = arr.length;
          if (/^https?%3A%2F%2F/.test(item)) {
            if (arr._added_) {
              arr[len - 1] = `${arr[len - 1]}/${item}`;
            } else {
              arr.push(item);
              arr._added_ = true;
            }
          } else {
            arr.push(item);
          }
          return arr;
        }, []);
        let result = splitList.map((item, index, arr) => arr.slice(0, 1 + index).join('/')).slice(1);
        result = uniqWith((a, b) => a.meta.title === b.meta.title, result.map((item) => this.$router.matcher.match(item)));
        if (result.length === 1 && result[0].meta.title !== last.meta.title) {
          result.push(last);
        }
        return result.filter((item) => item.meta.title);
      }
      return [];
    },
    collapsed: {
      get () {
        return this.$store.state.config.menu_collapsed;
      },
      set (value) {
        const { config } = this.$store.state;
        this.$store.commit('setConfig', {
          ...config,
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
    isTab () {
      return this.$store.state.config.content_head === 'tab';
    },
  },
};
</script>
