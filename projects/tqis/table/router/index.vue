<template>
  <a-tabs
    default-active-key="1"
    class="content-tab"
  >
    <a-tab-pane
      key="FixedTable"
      tab="固定"
    >
      <FixedTable />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  components: {
    FixedTable: () => import('../view/FixedTable.vue'),
  },
  // data () {
  //   return {
  //     code: '<template>123</template>',
  //   };
  // },
};
</script>
