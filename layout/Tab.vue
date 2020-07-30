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
        <a-menu-item key="0">
          <a @click="closeOther">
            {{ $t('action.close_other') }}
          </a>
        </a-menu-item>
        <a-menu-item key="1">
          <a @click="closeCurrent">
            {{ $t('action.close_current') }}
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <template
      v-for="(tab, index) in tabs"
    >
      <a-tab-pane
        :key="index"
        :tab="tab.name"
        :closable="totalTab > 1"
      >
        <a-spin
          class="app-content-spiner"
          :spinning="$store.state.refresh"
        >
          <transition v-if="!$store.state.refresh">
            <keep-alive v-if="$store.state.config.keep_alive">
              <router-view
                v-if="tab.cachePath === currentTab"
                class="content-child-view"
                @destory="destory(currentTab)"
              />
            </keep-alive>
            <router-view
              v-else-if="tab.cachePath === currentTab"
              class="content-child-view"
              @destory="destory(currentTab)"
            />
          </transition>
        </a-spin>
      </a-tab-pane>
    </template>
    <a-tab-pane
      v-if="totalTab <= 0"
      key="404"
      style="background: white;"
      tab="404"
      :closable="false"
    >
      <result-404></result-404>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
// import { uniqWith } from 'ramda';
import config from '~/config.js';

const { THEME = {} } = config;
const { TAB_TYPE = 0 } = THEME;

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
      tabs: {},
      currentTab: '404',
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
        if (module && module.url) {
          const moduleFullPath = TAB_TYPE === 2 ? fullPath : module.fullPath;
          if (!this.tabs[moduleFullPath]) {
            const tabKeys = Object.keys(this.tabs);
            const component = matched.components.default;
            this.tabs[moduleFullPath] = { ...module, closable: !!tabKeys.length, component };
          }
          this.tabs[moduleFullPath].cachePath = moduleFullPath;
          this.tabs[moduleFullPath].name = this.currentDirectory[this.currentDirectory.length - 1].name;
          this.currentTab = moduleFullPath;
          this.totalTab = Object.keys(this.tabs).length;
          // this.$forceUpdate();
        }
      },
    },
    // currentTab (value) {
    //   console.log('watch crrentTab', value);
    //   const catchPath = this.tabs[value].cachePath || value;
    //   console.log(catchPath);
    //   // if (!this.$store.state.config.keep_alive) {
    //   //   this.$router.push({ path: catchPath });
    //   // }
    //   // this.$router.push({ path: catchPath });
    // },
  },
  methods: {
    destory (currentTab) {
      const tabKeys = Object.keys(this.tabs);
      if (tabKeys.length > 1) {
        this.onTabEdit(currentTab, 'remove');
      }
    },
    onTabChange (activeKey) {
      this.currentTab = activeKey;
      const catchPath = this.tabs[activeKey].cachePath || activeKey;
      if (!this.$store.state.config.keep_alive) {
        this.$router.push({ path: catchPath });
      }
    },
    onTabEdit (targetKey, action) {
      if (action === 'remove') {
        this.$delete(this.tabs, targetKey);
        this.$nextTick(() => {
          const tabKeys = Object.keys(this.tabs);
          this.totalTab = tabKeys.length;
          if (!Object.hasOwnProperty.call(this.tabs, this.currentTab)) {
            this.currentTab = tabKeys[tabKeys.length - 1];
            if (!this.$store.state.config.keep_alive) {
              const catchPath = this.tabs[this.currentTab].cachePath || this.currentTab;
              this.$router.push({ path: catchPath });
            }
          }
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
