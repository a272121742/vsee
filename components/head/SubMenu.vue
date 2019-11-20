<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="!item.children || !item.children.length"
        :key="item.key"
      >
        <span>{{ item.title }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.key"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>