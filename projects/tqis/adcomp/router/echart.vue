<template>
  <h1>echart 高级组件</h1>
</template>
<template>
  <a-tabs
    :active-key="selectedTab"
    class="content-tab"
    @change="changeTab"
  >
    <a-tab-pane
      key="TableEchart"
      tab="表格图表"
    >
      <TableEchart></TableEchart>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  components: {
    TableEchart: () => import('../view/TableEchart.vue'),
  },
  data () {
    return {
      selectedTab: 'TableEchart',
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
      this.$route.query.key = key;
    },
  },
};
</script>
