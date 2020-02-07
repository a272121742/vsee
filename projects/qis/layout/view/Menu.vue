<template>
  <a-menu
    :default-selected-keys="defaultActiveMenu"
    mode="horizontal"
    @select="jump"
  >
    <template
      v-for="menu in menus"
    >
      <a-menu-item
        v-if="!menu.children || !menu.children.length"
        :key="menu.key"
        :title="$t(menu.title)"
      >
        {{ $t(menu.title) }}
      </a-menu-item>
      <sub-menu
        v-else
        :key="menu.key"
        :menu-info="menu"
      />
    </template>
  </a-menu>
</template>

<script>
import { treeTransform, treeFind } from '@util/datahelper.js';

export default {
  components: {
    SubMenu: () => import('@comp/head/SubMenu.vue'),
  },
  data () {
    return {
      menuMap: {
        '/home/home': 'Home',
        '/question/list': 'List',
        '/question/search': 'Search',
        '/question/report': 'Report',
      },
    };
  },
  computed: {
    menus () {
      const { menuMap } = this;
      return treeTransform((menu) => ({
        id: menu.id,
        url: menu.url,
        key: menuMap[menu.url] || menu.url.split('?path=')[1],
        title: menu.name,
        children: menu.children,
        icon: menu.icon,
      }), this.$store.state.menus);
    },
    defaultActiveMenu () {
      const { $route } = this;
      const { $store } = this;
      const { name } = this.$route;
      switch (name) {
      case 'QuestionCreate':
      case 'QuestionDetail':
      case 'QuestionSuccess':
        return ['List'];
      case 'Report':
        const { fullPath } = $route;
        const url = fullPath.split('?path=')[1];
        console.log(url);
        return url ? [decodeURIComponent(url)] : ['Report'];
      default:
        return name ? [name] : ['Home'];
      }
    },
    user () {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    jump (selectedMenu) {
      console.log('ssss', selectedMenu.selectedKeys);
      const menu = treeFind((item) => item.key === selectedMenu.key, this.menus);
      const path = menu.url;
      const { resolved } = this.$router.resolve(path);
      if (resolved.name === '404') {
        this.$message.warning('前端未配置的路由');
      } else {
        this.$store.commit('question/initState');
        this.$router.push({ ...resolved, path });
        this.$store.dispatch('refresh');
      }
    },
  },
};
</script>
