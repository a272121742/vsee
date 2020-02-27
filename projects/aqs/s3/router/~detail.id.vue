<template>
  <div>动态路由{{ id }}</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
