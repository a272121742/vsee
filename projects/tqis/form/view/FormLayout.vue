<template>
  <div>
    <ColumnSplit />
    <ColumnCompact />
    <ColumnAlign />
  </div>
</template>

<script>
export default {
  components: {
    ColumnCompact: () => import('./FormLayout/ColumnCompact.vue'),
    ColumnSplit: () => import('./FormLayout/ColumnSplit.vue'),
    ColumnAlign: () => import('./FormLayout/ColumnAlign.vue'),
  },
};
</script>
