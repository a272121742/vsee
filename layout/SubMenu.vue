<template functional>
  <a-sub-menu :key="props.menuInfo.fullPath">
    <span slot="title">
      <a-icon
        v-if="props.menuInfo.icon"
        class="anticon"
        style="font-size: 16px;"
        :type="props.menuInfo.icon"
      />
      <span>{{ props.menuInfo.meta.title }}</span>
    </span>
    <template v-if="props.menuInfo.children && props.menuInfo.children.length">
      <template v-for="item in props.menuInfo.children">
        <a-menu-item
          v-if="!item.children || !item.children.length"
          :key="item.fullPath"
          :title="item.meta.title"
        >
          <a-icon
            v-if="item.icon"
            class="anticon"
            style="font-size: 16px;"
            :type="item.icon"
          />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu
          v-else
          :key="item.fullPath"
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
      required: true,
    },
  },
};
</script>
