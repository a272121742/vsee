<template>
  <span>这里写页面</span>
</template>

<script>
export default {
  created () {
    const user = this.$store.getters.getUser();
  }
};
</script>
