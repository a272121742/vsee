<template>
  <a-menu
    mode="horizontal"
    :selected-keys="openKeys"
    :open-keys.sync="openKeys"
    :theme="theme"
    @select="jump"
    @openChange="openChange"
  >
    <template
      v-for="menu in menus"
    >
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
    theme () {
      return this.$store.state.config.dark ? 'dark' : 'light';
    },
    menus () {
      return this.$store.state.appMenus.map((item) => ({ ...item }));
    },
    menuKeys () {
      // return this.$store.state.routers.map((item) => item.path);
      return this.menus.map((item) => item.fullPath);
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
      return this.currentDirectory.map((item) => item.fullPath).reverse();
    },
    openChange (openKeys) {
      const latestOpenKey = openKeys.find((key) => !this.openKeys.includes(key));
      if (!this.menuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys;
      } else {
        const index = openKeys.findIndex((item) => this.menuKeys.includes(item) && item !== latestOpenKey);
        if (openKeys.length > 1) {
          this.openKeys = openKeys;
          if (this.$store.state.config.menu_current && index !== -1) {
            this.openKeys.splice(index, 1);
          }
        } else if (latestOpenKey) {
          this.openKeys.push(latestOpenKey);
        }
      }
    },
  },
};
</script>
