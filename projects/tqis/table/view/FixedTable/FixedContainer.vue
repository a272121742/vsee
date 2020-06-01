<template>
  <a-table
    :class="{ 'table-container-fixed': fixed }"
    :columns="columns"
    :data-source="data"
    :loading="loading"
  >
    <a
      slot="name"
      slot-scope="text"
    >{{ text }}</a>
    <span slot="customTitle">
      <a-icon type="smile-o" /> Name</span>
    <span
      slot="tags"
      slot-scope="tags"
    >
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span
      slot="action"
      slot-scope=""
    >
      <a>查看</a>
      <a-divider type="vertical" />
      <a>删除</a>
    </span>
  </a-table>
</template>
<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '4',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '5',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '6',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '7',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '8',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '9',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}, {
  key: '10',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];

export default {
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      data: [],
      columns,
      loading: false,
    };
  },
  created () {
    this.fetch();
  },
  methods: {
    fetch () {
      this.$set(this, 'data', []);
      this.loading = true;
      setTimeout(() => {
        this.data = data;
        this.loading = false;
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
  .table-container-fixed-defined(@table-header-height: 54px; @table-row-height: 56px; @table-row-count: 10) {
    @table-body-height: @table-row-height * @table-row-count;
    @table-height: @table-header-height + @table-body-height;
    @table-empty-margin: (@table-body-height - 103px) / 2;
    height: @table-height;
    // 修改加载区域
    /deep/ .ant-spin-spinning {
      max-height:  @table-height;
      height:  @table-height;
    }
    /deep/ .ant-table-empty .ant-empty.ant-empty-normal{
      margin: @table-empty-margin 0;
    }
    // 加载过程中不显示`暂无数据`
    /deep/ .ant-table-spin-holder .ant-empty.ant-empty-normal{
      opacity: 0;
    }
  }
  .table-container-fixed {
    .table-container-fixed-defined(54px; 56px);
  }
</style>
