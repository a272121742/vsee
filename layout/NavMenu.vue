<template>
  <a-menu
    mode="horizontal"
    :default-selected-keys="defaultSelectedKeys"
    :open-keys="openKeys"
    @select="jump"
    @openChange="openChange"
  >
    <template
      v-for="menu in menus"
    >
      <a-menu-item
        v-if="!menu.children || !menu.children.length || !menu.leaf"
        :key="menu.fullPath"
        :title="menu.meta.title"
      >
        <v-icon
          v-if="menu.icon"
          class="anticon"
          style="font-size: 16px;"
          :type="menu.icon"
        />
        <a-icon
          v-else
          type="desktop"
        />
        <span>{{ menu.meta.title }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="menu.fullPath"
        :menu-info="menu"
      />
    </template>
  </a-menu>
</template>

<script>
import { uniqWith } from 'ramda';

export default {
  components: {
    SubMenu: () => import('./SubMenu.vue'),
  },
  data () {
    const { matched } = this.$route;
    let openKeys = [matched[matched.length - 1].path];
    const last = matched[matched.length - 1];
    // const hasIframeItem = last.path === matched[matched.length - 2].path;
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
      const result = splitList.map((item, index, arr) => arr.slice(0, 1 + index).join('/')).slice(1);
      openKeys = [...result];
      if (result.length === 3 && !/\?\/$/.test(result[2])) {
        openKeys[2] = result[2].replace(result[1], result[0]);
        openKeys.splice(1, 1);
      }
    }
    return {
      openKeys,
    };
  },
  computed: {
    menus () {
      return this.$store.state.routers.map((item) => ({ ...item }));
    },
    defaultSelectedKeys () {
      return this.currentDirectory.map((item) => item.fullPath);
    },
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
    $route () {
      this.$store.dispatch('reload');
    },
  },
  methods: {
    jump ({ key }) {
      this.$router.push({ path: key });
    },
    openChange (openKeys) {
      this.openKeys = openKeys.filter((item, index) => index === openKeys.length - 1);
    },
    fixedMenu (menus = []) {
      return menus.filter((item) => {
        if (item.children && item.children.every((cld) => cld.hide)) {
          delete item.children;
        }
        return !item.hide;
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-menu {
    border: none;
    /deep/ .ant-menu-item, /deep/ .ant-menu-submenu {
      padding-left: 0;
      padding-right: 0;
      line-height: 60px;
      top: 3px;
    }
  }
</style>
