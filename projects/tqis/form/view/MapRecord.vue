<template>
  <div>
    <MapFrom />
    <MapTo />
  </div>
</template>

<script>
export default {
  components: {
    MapFrom: () => import('./MapRecord/MapFrom.vue'),
    MapTo: () => import('./MapRecord/MapTo.vue'),
  },
};
</script>
