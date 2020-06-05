<template>
  <a-tabs
    :active-key="selectedTab"
    class="content-tab"
    @change="changeTab"
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
  data () {
    return {
      // code: '<template>123</template>',
      selectedTab: 'FixedTable',
    };
  },
  beforeRouteEnter (to, from, next) {
    if (to.query.key) {
      next((vm) => {
        vm.selectedTab = to.query.key;
      });
    }
    next();
  },
  methods: {
    changeTab (key) {
      this.selectedTab = key;
    },
  },
};
</script>
