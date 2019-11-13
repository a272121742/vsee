<template>
  <a-card :title="'新增'">
    <template #extra>
      <a-button type="primary">
        新增
      </a-button>
    </template>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
    >
    </a-table>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' },
        },
        {
          title: '中文名称',
          dataIndex: 'nameCN',
        },
        {
          title: '英文名称',
          dataIndex: 'nameEN',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
        },
      ],
      data: [],
      pagination: {}
    };
  }
};
</script>