<template>
  <a-breadcrumb>
    <template v-for="(dir, index) in currentDirectory">
      <a-breadcrumb-item :key="index">
        <router-link
          v-if="(index < currentDirectory.length - 1 && index) || (index === 0 && dir.meta.link && currentDirectory.length > 1)"
          :to="dir.path"
        >
          {{ dir.meta.title }}
        </router-link>
        <span v-else>
          {{ dir.meta.title }}
        </span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
export default {
  props: {
    currentDirectory: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
