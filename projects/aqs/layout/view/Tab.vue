<template>
  <a-tabs
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
      :get-popup-container="e => e.parentNode"
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
    <a-tab-pane
      v-for="tab in tabs"
      :key="tab.fullPath"
      :tab="tab.meta.title"
      :closable="totalTab > 1"
    >
      <slot v-bind="tab" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { uniqWith } from 'ramda';

export default {
  data () {
    return {
      tabs: {},
      currentTab: '',
      totalTab: 0,
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
  },
  watch: {
    $route: {
      immediate: true,
      handler () {
        const { fullPath } = this.$route;
        const isHideComponent = /~/.test(this.$route.matched[this.$route.matched.length - 1].components.default.__file);
        const len = this.currentDirectory.length;
        const dirs = this.currentDirectory.slice(0, isHideComponent ? len - 1 : len);
        const module = dirs[1] || dirs[0];
        const moduleFullPath = module.fullPath;
        if (!this.tabs[moduleFullPath]) {
          const tabKeys = Object.keys(this.tabs);
          this.tabs[moduleFullPath] = { ...module, closable: !!tabKeys.length };
        }
        this.tabs[moduleFullPath].cachePath = fullPath;
        this.currentTab = moduleFullPath;
        this.totalTab = Object.keys(this.tabs).length;
        this.$forceUpdate();
      },
    },
    currentTab (value) {
      const catchPath = this.tabs[value].cachePath || value;
      this.$router.push({ path: catchPath });
    },
  },
  methods: {
    onTabChange (activeKey) {
      this.currentTab = activeKey;
    },
    onTabEdit (targetKey, action) {
      if (action === 'remove') {
        this.$delete(this.tabs, targetKey);
        this.$nextTick(() => {
          const tabKeys = Object.keys(this.tabs);
          this.totalTab = tabKeys.length;
          this.currentTab = tabKeys[tabKeys.length - 1];
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

<style lang="less" scoped>
  .ant-tabs {
    padding: 0!important;
    background: transparent!important;
    /deep/ .ant-tabs-bar {
      background: #FFF;
      margin-bottom: 0;
      .ant-tabs-extra-content {
        width: 30px;
        height: 40px;
        background: rgba(0, 0, 0, 0.04);
      }
      /deep/ .ant-tabs-tab {
        border: none;
        & > div {
          height: 36px;
          margin-top: 2px;
        }
        &.ant-tabs-tab-active {
          &::after {
            content: '';
            display: block;
            height: 2px;
            margin: auto -16px;
            background: @primary-color;
          }
        }
      }
    }

    .anticon-close {
      color: rgba(0, 0, 0, 0.25);
      font-size: 12px;
      padding: 2px;
      margin-left: 8px;
      margin-right: 0;
      transition: color 0.3s;
      border-radius: 12px;
      &:hover {
        transition: color 0.3s, background 0.3s;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
</style>
