<template>
  <div v-water-mark>
    <order-search-form></order-search-form>
    <order-list-table></order-list-table>
  </div>
</template>

<script>
export default {
  components: {
    'order-search-form': () => import('../view/order-search-form.vue'),
    'order-list-table': () => import('../view/order-list-table.vue'),
  },
};
</script>
