<template functional>
  <a-sub-menu :key="props.menuInfo.fullPath">
    <span slot="title">
      <v-icon
        v-if="props.menuInfo.icon"
        class="anticon"
        style="font-size: 16px;"
        :type="props.menuInfo.icon"
      />
      <a-icon
        v-else
        type="desktop"
      />
      <span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-if="props.menuInfo.children && props.menuInfo.children.length">
      <template v-for="menu in props.menuInfo.children">
        <a-menu-item
          v-if="!menu.children || !menu.children.length"
          :key="menu.fullPath"
          :title="menu.meta.title"
        >
          <span>{{ menu.meta.title }}</span>
        </a-menu-item>
        <sub-menu
          v-else
          :key="menu.fullPath"
          :menu-info="item"
        />
      </template>
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
