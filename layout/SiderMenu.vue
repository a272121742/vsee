<template>
  <a-menu
    mode="inline"
    :selected-keys="openKeys"
    :open-keys.sync="openKeys"
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
export default {
  components: {
    SubMenu: () => import('./SubMenu.vue'),
  },
  props: {
    currentDirectory: {
      type: Array,
      default: () => [],
    },
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
    menuKeys () {
      return this.$store.state.routers.map((item) => item.fullPath);
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
      // const { matched } = this.$route;
      // let openKeys = [matched[matched.length - 1].path];
      // const last = matched[matched.length - 1];
      // if (last) {
      //   const splitList = last.path.split('/').reduce((arr, item) => {
      //     const len = arr.length;
      //     if (/^https?%3A%2F%2F/.test(item)) {
      //       if (arr._added_) {
      //         arr[len - 1] = `${arr[len - 1]}/${item}`;
      //       } else {
      //         arr.push(item);
      //         arr._added_ = true;
      //       }
      //     } else {
      //       arr.push(item);
      //     }
      //     return arr;
      //   }, []);
      //   const result = splitList.map((item, index, arr) => arr.slice(0, 1 + index).join('/')).slice(1);
      //   openKeys = [...result];
      //   if (result.length === 3 && !(/\?\/$/.test(result[2]))) {
      //     openKeys[2] = result[2].replace(result[1], result[0]);
      //     openKeys.splice(1, 1);
      //   }
      // }
      // return openKeys;
      return this.currentDirectory.map((item) => item.path);
    },
    openChange (openKeys) {
      const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1);
      if (!this.menuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys;
      } else {
        const index = openKeys.findIndex((item) => this.menuKeys.includes(item));
        if (index >= 0 && openKeys.length > 2) {
          this.openKeys = openKeys;
        } else {
          this.openKeys.push(latestOpenKey);
        }
      }
    },
  },
};
</script>
