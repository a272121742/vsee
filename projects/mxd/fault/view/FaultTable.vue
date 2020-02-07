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
      data: [
        { id: 1, nameCN: '1', nameEN: '1' },
        { id: 2, nameCN: '2', nameEN: '2' },
        { id: 3, nameCN: '3', nameEN: '3' },
        { id: 4, nameCN: '4', nameEN: '4' },
        { id: 5, nameCN: '5', nameEN: '5' },
        { id: 6, nameCN: '6', nameEN: '6' },
        { id: 7, nameCN: '7', nameEN: '7' },
        { id: 8, nameCN: '8', nameEN: '8' },
        { id: 9, nameCN: '9', nameEN: '9' },
        { id: 10, nameCN: '10', nameEN: '10' },
        { id: 11, nameCN: '11', nameEN: '11' },
        { id: 12, nameCN: '12', nameEN: '12' },
        { id: 13, nameCN: '13', nameEN: '13' },
        { id: 14, nameCN: '14', nameEN: '14' },
        { id: 15, nameCN: '15', nameEN: '15' },
        { id: 16, nameCN: '16', nameEN: '16' },
        { id: 17, nameCN: '17', nameEN: '17' },
        { id: 18, nameCN: '18', nameEN: '18' },
        { id: 19, nameCN: '19', nameEN: '19' },
        { id: 20, nameCN: '20', nameEN: '20' },
      ],
      pagination: {},
    };
  },
};
</script>
