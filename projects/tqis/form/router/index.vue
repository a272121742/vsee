<template>
  <a-tabs
    :active-key="selectedTab"
    class="content-tab"
    @change="changeTab"
  >
    <a-tab-pane
      key="FormItemList"
      tab="表单项"
    >
      <!-- <FormItemList /> -->
    </a-tab-pane>
    <a-tab-pane
      key="LinkageCombination"
      tab="联动"
    >
      <LinkageCombination />
    </a-tab-pane>
    <a-tab-pane
      key="QuerySelect"
      tab="搜索"
    >
      <QuerySelect />
    </a-tab-pane>
    <a-tab-pane
      key="FormLayout"
      tab="布局"
    >
      <FormLayout />
    </a-tab-pane>
    <a-tab-pane
      key="BindRecord"
      tab="绑值"
    >
      <BindRecord />
    </a-tab-pane>
    <a-tab-pane
      key="MapRecord"
      tab="映射"
    >
      <MapRecord />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  components: {
    // FormItemList: () => import('../view/FormItemList.vue'),
    LinkageCombination: () => import('../view/LinkageCombination.vue'),
    QuerySelect: () => import('../view/QuerySelect.vue'),
    FormLayout: () => import('../view/FormLayout.vue'),
    BindRecord: () => import('../view/BindRecord.vue'),
    MapRecord: () => import('../view/MapRecord.vue'),
  },
  data () {
    return {
      // code: '<template>123</template>',
      selectedTab: 'FormItemList',
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
