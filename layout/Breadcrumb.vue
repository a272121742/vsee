<template>
  <a-breadcrumb>
    <template v-for="(dir, index) in currentDirectory">
      <a-breadcrumb-item :key="dir.id">
        <!-- <router-link
          v-if="(index < currentDirectory.length - 1 && index) || (index === 0 && dir.meta.link && currentDirectory.length > 1)"
          :to="dir.path"
        >
          {{ dir.meta.title }}
        </router-link>
        <span v-else>
          {{ dir.meta.title }}
        </span> -->
        <router-link
          v-if="index < currentDirectory.length - 1 && ![true, void 0].includes(dir.dir)"
          :to="dir.fullPath"
        >
          {{ dir.name }}
        </router-link>
        <span v-else>
          {{ dir.name }}
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
