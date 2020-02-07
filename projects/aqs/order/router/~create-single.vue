<template>
  <create-vehicle-report
    asq-issue-rpt-type="1"
    is-handmade="0"
  />
</template>

<script>
export default {
  components: {
    'create-vehicle-report': () => import('~/issue/view/create-vehicle-report.vue'),
  },
};
</script>
