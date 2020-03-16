<template>
  <create-vehicle-report
    asq-issue-rpt-type="1"
    is-handmade="1"
  />
</template>

<script>
export default {
  components: {
    'create-vehicle-report': () => import('../../view/create-vehicle-report.vue'),
  },
};
</script>
