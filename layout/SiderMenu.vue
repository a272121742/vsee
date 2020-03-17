<template>
  <a-menu
    v-model="openKeys"
    mode="inline"
    :open-keys="openKeys"
    @select="jump"
    @openChange="openChange"
  >
    <template v-for="menu in menus">
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
    return {
      openKeys: [],
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
    $route: {
      immediate: true,
      handler () {
        this.openKeys = this.getOpenKeys();
      },
    },
  },
  methods: {
    jump ({ key }) {
      this.$router.push({ path: key });
    },
    getOpenKeys () {
      const { matched } = this.$route;
      let openKeys = [matched[matched.length - 1].path];
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
        const result = splitList.map((item, index, arr) => arr.slice(0, 1 + index).join('/')).slice(1);
        openKeys = [...result];
        if (result.length === 3 && !(/\?\/$/.test(result[2]))) {
          openKeys[2] = result[2].replace(result[1], result[0]);
          openKeys.splice(1, 1);
        }
      }
      return openKeys;
    },
    openChange (openKeys) {
      this.openKeys = openKeys;
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
