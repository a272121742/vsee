<template functional>
  <a-anchor-link
    :key="props.menuInfo.id"
    :href="`#${props.menuInfo.fullPath}`"
  >
    <template #title>
      <a-icon
        v-if="props.menuInfo.icon"
        class="anticon"
        style="font-size: 16px;"
        :type="props.menuInfo.icon"
      />
      {{ props.menuInfo.name }}
    </template>
    <template v-if="props.menuInfo.children && props.menuInfo.children.length && props.menuInfo.dir">
      <a-anchor-link
        v-for="menu in props.menuInfo.children"
        :key="menu.id"
        :href="`#${menu.fullPath}`"
      >
        <sub-anchor
          :key="menu.id"
          :menu-info="menu"
        />
      </a-anchor-link>
    </template>
  </a-anchor-link>
</template>
<script>
export default {
  props: {
    menuInfo: {
      type: Object,
      required: true,
    },
  },
};
</script>
