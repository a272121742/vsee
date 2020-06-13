<template>
  <div>
    <Trible />
    <Double />
  </div>
</template>

<script>
export default {
  components: {
    Trible: () => import('./LinkageCombination/Trible.vue'),
    Double: () => import('./LinkageCombination/Double.vue'),
  },
};
</script>
