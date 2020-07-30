<template>
  <a-menu
    mode="inline"
    :selected-keys="openKeys"
    :open-keys.sync="openKeys"
    :theme="theme"
    @select="jump"
    @openChange="openChange"
  >
    <template v-for="menu in menus">
      <a-menu-item
        v-if="(!menu.children || !menu.children.length || !menu.dir) && !menu.hide"
        :key="menu.fullPath"
        :title="menu.name"
      >
        <a-icon
          v-if="menu.icon"
          class="anticon"
          style="font-size: 16px;"
          :type="menu.icon"
        />
        <span>{{ menu.name }}</span>
      </a-menu-item>
      <sub-menu
        v-else-if="!menu.hide"
        :key="menu.fullPath"
        :menu-info="menu"
      />
    </template>
  </a-menu>
</template>

<script>
export default {
  components: {
    'sub-menu': () => import('./SubMenu.vue'),
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
    theme () {
      return this.$store.state.config.dark ? 'dark' : 'light';
    },
    menus () {
      return this.$store.state.appMenus.map((item) => ({ ...item }));
    },
    menuKeys () {
      return this.$store.state.routers.map((item) => item.path);
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
  // beforeCreate () {
  //   const listen = this.$store.watch((state) => state.isLogin, (isLogin) => {
  //     if (isLogin) {
  //       this.$store.dispatch('fetchMenus');
  //       listen && listen();
  //     }
  //   }, { immediate: true });
  // },
  methods: {
    jump ({ key }) {
      this.$router.push({ path: key });
    },
    getOpenKeys () {
      return this.currentDirectory.map((item) => item.fullPath);
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
