<template>
  <div class="root">
    <!-- 报告操作按钮 -->
    <div>
      <a-button
        type="primary"
        :disabled="rowSelection.selectedRowKeys.length !== 1"
        style="margin-right: 8px;"
        @click="create('single')"
      >
        <a-icon type="icon-single-dccj-outlined"></a-icon>
        {{ $t('action.single_report') }}
      </a-button>
      <a-button
        type="primary"
        :disabled="rowSelection.selectedRowKeys.length <= 1"
        @click="create('batch')"
      >
        <a-icon type="icon-single-plcj-outlined"></a-icon>
        {{ $t('action.batch_report') }}
      </a-button>
    </div>
    <a-alert
      class="vehicle-info-alert"
      type="info"
      show-icon
    >
      <template #message>
        已选 ： <span style="color: #0097E0;">{{ rowSelection.selectedRowKeys.length }} 条</span>
      </template>
    </a-alert>
    <!-- 表格 -->
    <a-table
      class="table-container-fixed table-cell-ellipsis"
      row-key="claimNo"
      :data-source="list"
      :pagination="pagination"
      :row-selection="rowSelection"
      :loading="loading"
      :scroll="{x: 2500}"
      @change="tableChangeHandle"
    >
      <template v-for="(col, index) in columns">
        <a-table-column
          :key="index"
          v-bind="col"
        >
          <span slot="title">
            {{ $t(`order.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text">
            <a-tooltip placement="topLeft">
              <template #title>
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import { clearObserver } from '@util/datahelper.js';
import { orderListColumns } from '~~/model/order.js';

export default {
  mixins: [
    paginationMix(),
    tableRowSelectionMix(),
    storeModuleMix({
      name: 'order',
      action: ['getClaimOrderaPage', 'getClaimOrderaAllPage'],
    }),
  ],
  data () {
    return {
      // columns: orderListColumns,
      list: [],
      total: 0,
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      rowSelection: {
        columnWidth: 68,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'cur-data',
            text: '选本页',
            onSelect: (changableRowKeys) => {
              this.onSelectCurret(changableRowKeys);
            },
          }, {
            key: 'all-data',
            text: '选全部',
            onSelect: (changableRowKeys) => {
              this.onSelectAll(changableRowKeys);
            },
          }],
      },
      orderFlag: false,
      keys: [],
      sorter: {},
    };
  },
  computed: {
    columns () {
      const orderData = this.sorter;
      return orderListColumns.map((col) => {
        const newCol = clearObserver(col);
        if (newCol.dataIndex === orderData.field) {
          newCol.sortOrder = orderData.order;
        } else {
          newCol.sortOrder = void 0;
        }
        return newCol;
      });
    },
  },
  watch: {
    '$store.state.order.claimOrderFormSearch': function (value) {
      Object.assign(this.$route.query, { asqIssueRptId: '' });
      window.history.pushState(null, null, window.location.href.split('?')[0]);
      this.rowSelection.selectedRowKeys = [];
      this.pagination.current = 1;
      this.fetch(value);
    },
    'rowSelection.selectedRowKeys': function (value) {
      if (this.orderFlag) {
        if (value.length < this.pagination.total) {
          const that = this;
          this.showConfirm(that);
        }
      }
    },
  },
  created () {
    // 批量
    if (this.$route.query.ids !== undefined) {
      Object.assign(this.$route.query, { asqIssueRptId: '' });
      this.pagination.pageSize = 100;
      this.serverPagination.limit = 100;
      this.pagination.showSizeChanger = false;
    }
    const { ids } = this.$route.query;
    const idsSearch = ids ? { ids } : void 0;
    this.fetch(idsSearch);
  },
  methods: {

    // 选本页
    onSelectCurret (data) {
      this.orderFlag = false;
      this.rowSelection.selectedRowKeys = data;
    },
    // 选全页
    onSelectAll () {
      if (this.pagination.total <= 5000) {
        this.orderFlag = true;
        this.rowSelection.selectedRowKeys = this.keys;
        this.rowSelection.selectedRowKeys.length = this.pagination.total;
      } else {
        this.$message.error('条数请少于5000条');
      }
    },
    fetch (ids) {
      this.loading = true;
      if (Object.keys(this.$route.query).length !== 0 && this.$route.query.asqIssueRptId !== '') {
        this.getClaimOrderaAllPage({ ...ids, asqIssueRptId: this.$route.query.asqIssueRptId, ...this.serverPagination }).then(this.load).finally(this.reset);
      } else {
        this.getClaimOrderaPage({ ...ids, ...this.serverPagination }).then(this.load).finally(this.reset);
      }
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      if (Object.keys(this.$route.query).length !== 0 && this.$route.query.asqIssueRptId !== '') {
        this.list = res.resultData.list;
        this.pagination.total = res.resultData.total;
      } else {
        this.list = res.list;
        this.keys = this.list.map((item) => item.claimNo);
        if (this.orderFlag) {
          this.onSelectAll();
        }
        this.pagination.total = res.total;
      }
    },
    tableChangeHandle (pagination, filters, sorter) {
      this.sorter = sorter;
      if (!this.orderFlag) {
        this.rowSelection.selectedRowKeys = [];
      }

      if (sorter !== undefined) {
        const { ids } = this.$route.query;
        this.fetch({
          ids, ...this.$store.state.order.claimOrderFormSearch, order: sorter.order === 'ascend' ? 'asc' : 'desc', orderField: sorter.field,
        });
      } else {
        this.fetch({ ...this.$store.state.order.claimOrderFormSearch });
      }
    },
    create (type) {
      const num = this.rowSelection.selectedRowKeys.length;
      const resListNo = this.rowSelection.selectedRowKeys;
      if (type === 'batch') {
        if (this.orderFlag) {
          // 全
          this.$router.push({
            path: '/order/create-batch',
            query: {
              asqIssueRptType: '3', num, ...this.$store.state.order.claimOrderFormSearch, orderFlag: this.orderFlag, isHandmade: '0',
            },
          });
        } else {
          // 非全选
          this.$router.push({
            path: '/order/create-batch',
            query: {
              ids: resListNo, asqIssueRptType: '2', num, orderFlag: this.orderFlag, isHandmade: '0',
            },
          });
        }
      } else {
        this.$router.push({
          path: '/order/create-single',
          query: {
            ids: resListNo, asqIssueRptType: '1', num, orderFlag: this.orderFlag, isHandmade: '0',
          },
        });
      }
    },
    showConfirm (that) {
      this.rowSelection.selectedRowKeys.length = this.pagination.total;
      this.$confirm({
        title: '提示: 不能对选全部进行操作',
        content: '是否取消选择全部？',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        centered: true,
        zIndex: 6000,
        onOk () {
          that.rowSelection.selectedRowKeys = [];
          that.orderFlag = false;
        },
        onCancel () {
          that.rowSelection.selectedRowKeys = that.keys;
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .root {
    .vehicle-info-alert {
      margin-top: 12px;
    }
  }
  .ant-table-wrapper {
    padding-top: 16px;
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 8px;
      margin-bottom: 4px;
    }
  }
</style>
