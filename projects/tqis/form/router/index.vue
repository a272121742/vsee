<template>
  <a-tabs
    default-active-key="1"
    class="content-tab"
  >
    <a-tab-pane
      key="FormItemList"
      tab="表单项"
    >
      <FormItemList />
    </a-tab-pane>
    <a-tab-pane
      key="LinkageCombination"
      tab="联动"
    >
      <LinkageCombination />
    </a-tab-pane>
    <a-tab-pane
      key="QuerySearch"
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
  </a-tabs>
</template>

<script>
export default {
  components: {
    FormItemList: () => import('../view/FormItemList.vue'),
    LinkageCombination: () => import('../view/LinkageCombination.vue'),
    QuerySelect: () => import('../view/QuerySelect.vue'),
    FormLayout: () => import('../view/FormLayout.vue'),
    BindRecord: () => import('../view/BindRecord.vue'),
  },
};
</script>

<style lang="less" scoped>
  .content-tab {
    /deep/ .ant-tabs-tabpane {
      min-height: calc(100vh - 228px);
    }
  }
</style>
