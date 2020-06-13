<template>
  <div>
    <Location />
    <CloseSearch />
    <Remote />
    <Complete />
  </div>
</template>

<script>
export default {
  components: {
    Location: () => import('./QuerySelect/Location.vue'),
    CloseSearch: () => import('./QuerySelect/CloseSearch.vue'),
    Remote: () => import('./QuerySelect/Remote.vue'),
    Complete: () => import('./QuerySelect/Complete.vue'),
  },
};
</script>
