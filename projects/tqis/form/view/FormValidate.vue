<template>
  <div>
    <NumberValidate />
    <StringValidate />
    <TypeValidate />
    <BusinessValidate />
    <OtherValidate />
  </div>
</template>

<script>
export default {
  components: {
    NumberValidate: () => import('./FormValidate/NumberValidate.vue'),
    StringValidate: () => import('./FormValidate/StringValidate.vue'),
    TypeValidate: () => import('./FormValidate/TypeValidate.vue'),
    BusinessValidate: () => import('./FormValidate/BusinessValidate.vue'),
    OtherValidate: () => import('./FormValidate/OtherValidate.vue'),
  },
};
</script>
