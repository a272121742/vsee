<template>
  <a-row
    :gutter="16"
    style="background:transparent; height: 100%;"
  >
    <a-col
      :span="8"
      style="width: 300px; height: 100%;"
    >
      <fault-tree
        style="background: white; height: 100%;"
      ></fault-tree>
    </a-col>
    <a-col
      :span="16"
      style="width: calc(100% - 300px)"
    >
      <a-row style="margin-bottom: 16px;">
        <node-detail style="background: white;"></node-detail>
      </a-row>
      <a-row>
        <fault-table
          style="background: white;"
        ></fault-table>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
export default {
  components: {
    FaultTree: () => import('../view/FaultTree.vue'),
    NodeDetail: () => import('../view/NodeDetail.vue'),
    FaultTable: () => import('../view/FaultTable.vue'),
  },
};
</script>

<style lang="less" scoped>

</style>
