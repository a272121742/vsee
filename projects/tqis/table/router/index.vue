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
    <a-tab-pane
      key="RowSelection"
      tab="行选择器"
    >
      <RowSelection />
    </a-tab-pane>
    <a-tab-pane
      key="SortTable"
      tab="排序"
    >
      <SortTable />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  components: {
    FixedTable: () => import('../view/FixedTable.vue'),
    RowSelection: () => import('../view/RowSelection.vue'),
    SortTable: () => import('../view/SortTable.vue'),
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
