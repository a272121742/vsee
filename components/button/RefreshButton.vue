<template>
  <a-button
    style="border: none;"
    ghost
    :loading="loading"
    shape="circle"
    type="primary"
    icon="reload"
    @click="refresh"
  ></a-button>
</template>

<script>
export default {
  methods: {
    refresh () {
      this.$store.dispatch('refresh');
    }
  }
}
</script>
