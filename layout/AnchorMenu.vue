<template>
  <a-anchor
    ref="anchor"
    wrapper-class="anchor-menu-wrapper"
    :bounds="80"
    :offset-top="80"
  >
    <template v-for="menu in menus">
      <a-anchor-link
        :key="menu.id"
        :href="`#${menu.fullPath}`"
      >
        <template #title>
          <a-icon type="desktop"></a-icon>
          {{ menu.meta.title }}
        </template>
        <template v-if="menu.children && menu.children.length && menu.leaf">
          <!-- eslint-disable vue/no-template-shadow -->
          <a-anchor-link
            v-for="menu in menu.children"
            :key="menu.id"
            :href="`#${menu.fullPath}`"
          >
            <template #title>
              <a-icon type="desktop"></a-icon>
              {{ menu.meta.title }}
            </template>
          </a-anchor-link>
        </template>
      </a-anchor-link>
    </template>
  </a-anchor>
</template>

<script>
export default {
  computed: {
    menus () {
      return this.$store.state.routers.map((item) => ({ ...item }));
    },
  },
  mounted () {
    const vm = this;
    const { anchor } = this.$refs;
    if (anchor && anchor.$watch) {
      anchor.$watch('activeLink', (value) => {
        // window.location.hash = value || '#';
        vm.$emit('change', value);
      });
    }
  },
};
</script>

<style lang="less" scoped>
  /deep/ .anchor-menu-wrapper {
    max-height: unset!important;
  }
</style>
