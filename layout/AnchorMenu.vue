<template>
  <a-anchor
    ref="anchor"
    wrapper-class="anchor-menu-wrapper"
    :get-container="getContainer"
    :bounds="16"
    :offset-top="80"
  >
    <template v-for="menu in menus">
      <!-- <a-anchor-link
        :key="menu.id"
        :href="`#${menu.fullPath}`"
      >
        <template #title>
          <a-icon
            v-if="menu.icon"
            class="anticon"
            style="font-size: 16px;"
            :type="menu.icon"
          />
          {{ menu.name }}
        </template>
        <template v-if="menu.children && menu.children.length && menu.dir"> -->
      <sub-anchor
        :key="menu.id"
        :menu-info="menu"
      />
      <!-- </template>
      </a-anchor-link> -->
    </template>
  </a-anchor>
</template>

<script>
export default {
  components: {
    'sub-anchor': () => import('./SubAnchor.vue'),
  },
  computed: {
    menus () {
      return this.$store.state.appMenus.map((item) => ({ ...item }));
    },
  },
  methods: {
    getContainer () {
      return document.querySelector('.app-root-scroll > .__panel');
    },
  },
};
</script>
