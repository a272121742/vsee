<template>
  <a-tabs
    class="app-tabs"
    hide-add
    :active-key="currentTab"
    :animated="false"
    :tab-bar-gutter="0"
    type="editable-card"
    @change="onTabChange"
    @edit="onTabEdit"
  >
    <a-dropdown
      slot="tabBarExtraContent"
      :trigger="['click']"
      placement="bottomRight"
      :get-popup-container="el => el.parentNode"
    >
      <a-button
        icon="down"
        type="link"
        style="color: rgba(0, 0, 0, 0.45)"
      ></a-button>
      <a-menu slot="overlay">
        <a-menu-item
          v-if="tabs.home"
          key="close-all"
        >
          <a @click="closeAll">
            {{ $t('action.close_all') }}
          </a>
        </a-menu-item>
        <a-menu-item key="close-other">
          <a @click="closeOther">
            {{ $t('action.close_other') }}
          </a>
        </a-menu-item>
        <a-menu-item key="close-current">
          <a @click="closeCurrent">
            {{ $t('action.close_current') }}
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <!-- <a-tab-pane
      v-if="home"
      key="home"
      :tab="$t('app.home')"
      :closable="false"
    >
      <component :is="home" />
    </a-tab-pane> -->
    <template
      v-for="(tab, index) in tabs"
    >
      <a-tab-pane
        :key="tab.home ? 'home' : index"
        :tab="tab.home ? $t(tab.title || tab.name) : (tab.title || tab.name)"
        :closable="!tab.home && totalTab > 1"
      >
        <a-spin
          class="app-content-spiner"
          :spinning="$store.state.refresh"
        >
          <transition v-if="!$store.state.refresh">
            <keep-alive v-if="$store.state.config.keep_alive">
              <router-view
                v-if="tab.cachePath === currentTab || ['home', 'undefined'].includes(currentTab)"
                class="content-child-view"
                @destory="destory(tab.cachePath)"
                @tabTitle="(title) => changeTitle(tab, title)"
              />
            </keep-alive>
            <router-view
              v-else-if="tab.cachePath === currentTab || ['home', 'undefined'].includes(currentTab)"
              class="content-child-view"
              @destory="destory(tab.cachePath)"
              @tabTitle="(title) => changeTitle(tab, title)"
            />
          </transition>
        </a-spin>
      </a-tab-pane>
    </template>
    <a-tab-pane
      v-if="totalTab <= 0"
      key="undefined"
      :tab="$t('app.404')"
      :closable="false"
    >
      <result-404></result-404>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
// import { uniqWith } from 'ramda';
import config from '~/config.js';

const { THEME = {}, ROUTER = {} } = config;
const { TAB_TYPE = 0 } = THEME;
const { HOME_COMP } = ROUTER;

export default {
  components: {
    'result-404': () => import('~/result/view/404.vue'),
  },
  props: {
    currentDirectory: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      tabs: HOME_COMP ? {
        home: {
          home: true,
          title: 'app.home',
          cachePath: 'home',
        },
      } : {},
      currentTab: HOME_COMP ? 'home' : '',
      totalTab: 0,
    };
  },
  watch: {
    // $route: {
    //   immediate: true,
    //   handler () {
    //     const { fullPath } = this.$route;
    //     const isHideComponent = /~/.test(this.$route.matched[this.$route.matched.length - 1].components.default.__file);
    //     const len = this.currentDirectory.length;
    //     const dirs = this.currentDirectory.slice(0, isHideComponent ? len - 1 : len);
    //     const module = dirs[1] || dirs[0];
    //     if (module) {
    //       const moduleFullPath = module.fullPath;
    //       if (!this.tabs[moduleFullPath]) {
    //         const tabKeys = Object.keys(this.tabs);
    //         const matchedCompontents = this.$router.getMatchedComponents(moduleFullPath);
    //         const component = matchedCompontents[matchedCompontents.length - 1];
    //         this.tabs[moduleFullPath] = { ...module, closable: !!tabKeys.length, component };
    //       }
    //       this.tabs[moduleFullPath].cachePath = fullPath;
    //       this.currentTab = moduleFullPath;
    //       this.totalTab = Object.keys(this.tabs).length;
    //       this.$forceUpdate();
    //     }
    //   },
    // },
    $route: {
      immediate: true,
      handler () {
        const { fullPath } = this.$route;
        const module = TAB_TYPE === 0 ? this.currentDirectory[0] : this.currentDirectory[this.currentDirectory.length - 1];
        const matched = this.$route.matched[this.$route.matched.length - 1];
        if (['home'].includes(matched.name)) {
          this.currentTab = matched.name;
          this.tabs[this.currentTab] && (this.tabs[this.currentTab].title = 'app.home');
        } else if ((module && module.url)) {
          const moduleFullPath = TAB_TYPE === 2 ? fullPath : module.fullPath;
          if (!this.tabs[moduleFullPath]) {
            const tabKeys = Object.keys(this.tabs);
            this.tabs[moduleFullPath] = { ...module, closable: !!tabKeys.length };
            this.tabs[moduleFullPath].name = this.currentDirectory[this.currentDirectory.length - 1].name;
          }
          this.tabs[moduleFullPath].cachePath = moduleFullPath;
          // this.tabs[moduleFullPath].title = this.tabs[moduleFullPath].name ? this.tabs[moduleFullPath].name : this.currentDirectory[this.currentDirectory.length - 1].name;
          this.currentTab = moduleFullPath;
          HOME_COMP && (this.tabs.home.title = 'app.home');
          // this.$forceUpdate();
        } else {
          const routerLength = this.$store.state.routers.length;
          if (routerLength) {
            this.currentTab = 'undefined';
            this.tabs[this.currentTab] = {
              ...module, title: '404', closable: true, cachePath: fullPath,
            };
          } else {
            this.tabs[this.currentTab] && (this.tabs[this.currentTab].title = 'app.home');
          }
        }
        this.totalTab = Object.keys(this.tabs).length;
      },
    },
    currentTab (value) {
      if (!['home'].includes(value)) {
        const catchPath = this.tabs[value].cachePath || value;
        // if (!this.$store.state.config.keep_alive) {
        this.$router.push({ path: catchPath });
        // }
        // this.$router.push({ path: catchPath });
      } else {
        this.$router.push({ name: value });
      }
      if (value !== 'undefined' && Object.keys(this.tabs).includes('undefined')) {
        this.$delete(this.tabs, 'undefined');
      }
    },
  },
  methods: {
    changeTitle (tab, title = '') {
      if (tab && tab.cachePath) {
        this.tabs[tab.cachePath].title = title.replace('{{title}}', this.tabs[tab.cachePath].name);
      }
      this.$forceUpdate();
    },
    destory (currentTab) {
      const tabKeys = Object.keys(this.tabs);
      if (tabKeys.length > 1) {
        this.onTabEdit(currentTab, 'remove');
      }
    },
    onTabChange (activeKey) {
      this.currentTab = activeKey;
      // const catchPath = this.tabs[activeKey].cachePath || activeKey;
      // if (!this.$store.state.config.keep_alive) {
      //   this.$router.push({ path: catchPath });
      // }
    },
    onTabEdit (targetKey, action) {
      if (action === 'remove' && targetKey !== 'home') {
        this.$delete(this.tabs, targetKey);
        this.$nextTick(() => {
          const tabKeys = Object.keys(this.tabs);
          this.totalTab = tabKeys.length;
          if (!Object.hasOwnProperty.call(this.tabs, this.currentTab)) {
            this.currentTab = tabKeys[tabKeys.length - 1];
            // if (!this.$store.state.config.keep_alive) {
            //   const catchPath = this.tabs[this.currentTab].cachePath || this.currentTab;
            //   this.$router.push({ path: catchPath });
            // }
          }
        });
      }
    },
    closeAll () {
      const tabKeys = Object.keys(this.tabs).filter((key) => key !== 'home');
      if (tabKeys.length > 0) {
        tabKeys.forEach((key) => {
          this.onTabEdit(key, 'remove');
        });
      }
    },
    closeOther () {
      const tabKeys = Object.keys(this.tabs).filter((key) => key !== this.currentTab);
      if (tabKeys.length > 0) {
        tabKeys.forEach((key) => {
          this.onTabEdit(key, 'remove');
        });
      }
    },
    closeCurrent () {
      const tabKeys = Object.keys(this.tabs);
      if (tabKeys.length > 1) {
        this.onTabEdit(this.currentTab, 'remove');
      }
    },
  },
};
</script>
