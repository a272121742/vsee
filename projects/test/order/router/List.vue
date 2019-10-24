<!-- Comment -->
<template>
  <div>
    <order-edit
      :id="selectedRowId"
      :data="selectedRow"
      @close="getUpdatedData"
    ></order-edit>
    是否弹窗 <a-switch
      :checked="checked"
      @change="chageEditWay"
    ></a-switch>
    <a-button @click="showAdd">
      新增
    </a-button>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      row-key="id"
    >
      <template
        slot="action"
        slot-scope="row"
      >
        <!-- 弹出编辑框，要传递给编辑框数据 -->
        <a @click="showEdit(row)">编辑</a>
        &nbsp;
        <!-- 弹出删除框，要传递给删除框数据 -->
        <a @click="showDelete(row)">删除</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { clearObserver } from '@util/datahelper.js';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('order');


/**
 * table -> dataRow -> record
 */
const columns = [{
  title: '编号',
  dataIndex: 'id'
}, {
  title: '订单名称',
  dataIndex: 'name'
}, {
  title: '操作',
  scopedSlots: { customRender: 'action' }
}];


export default {
  components: {
    OrderEdit: () => import('../view/Modal.vue')
  },
  data () {
    return {
      columns: columns,
      data: [],
      loading: true,
      selectedRow: {},
      checked: true,
      selectedRowId: undefined
    };
  },
  watch: {
    // 【策略】监听
    data (data) {
      this.load(clearObserver(data));
    }
  },
  created () {
    this.init();
  },
  methods: {
    ...mapActions([
      'getOrderList',
      'orderAdd',
      'orderDel'
    ]),
    /**
     * 获取数据
     */
    fetch () {
      return this.getOrderList();
    },
    /**
     * 初始化组件
     */
    init () {
      this.getOrderList().then(({ list = [], total = 0 }) => {
        console.log(total);
        this.data = list;
        if (list.length) {
          this.loading = false;
        }
      }).catch(err => {
        this.loading = false;
        this.$message.error(err);
        // console.log(err);
      });
    },
    /**
     * 加载数据
     */
    load () {
      return this.getOrderList();
    },
    chageEditWay (checked) {
      this.checked = checked;
    },
    showAdd () {
      this.$set(this, 'selectedRow', clearObserver());
      // this.fetch();
    },
    showEdit (row) {
      if (this.checked) {
        this.$set(this, 'selectedRow', clearObserver(row));
      } else {
        // this.$router.push({ name: 'Form', params: { id: row.id } });
        this.$router.push({ path: `/order/form/${row.id}` });
      }
    },
    showDelete (row) {
      this.orderDel(row.id)
        .then(() => {
          this.init();
        });
    },
    getUpdatedData (data) {
      // console.log(this.data)
      console.log('获取修改后的数据', data);
      this.selectedRowId = undefined;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
