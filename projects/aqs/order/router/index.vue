<template>
  <div>
    <order-search-form></order-search-form>
    <order-list-table></order-list-table>
  </div>
</template>

<script>
export default {
  name: 'Order',
  path: '/order',
  components: {
    'order-search-form': () => import('../view/order-search-form.vue'),
    'order-list-table': () => import('../view/order-list-table.vue'),
  },
};
</script>
