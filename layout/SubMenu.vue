<template functional>
  <a-sub-menu :key="props.menuInfo.fullPath">
    <span slot="title">
      <a-icon
        v-if="props.menuInfo.icon"
        class="anticon"
        style="font-size: 16px;"
        :type="props.menuInfo.icon"
      />
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-if="props.menuInfo.children && props.menuInfo.children.length">
      <template v-for="menu in props.menuInfo.children">
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
    </template>
  </a-sub-menu>
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
