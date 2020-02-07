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
        <v-icon type="icondccj_outlined1"></v-icon>
        {{ $t('action.single_report') }}
      </a-button>
      <a-button
        type="primary"
        :disabled="rowSelection.selectedRowKeys.length <= 1"
        @click="create('batch')"
      >
        <v-icon type="iconplcj_outlined1"></v-icon>
        {{ $t('action.batch_report') }}
      </a-button>
    </div>
    <!-- 表格 -->
    <a-table
      class="ellipsis-table"
      row-key="id"
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
import { omit } from 'ramda';

import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import { createNamespacedHelpers } from 'vuex';
import { orderListColumns } from '~~/model/order.js';

const { mapActions } = createNamespacedHelpers('order');
const omitSearchFields = omit(['prodDate', 'repairDate', 'warrantyBeginDate']);

export default {
  mixins: [tableRowSelectionMix(), paginationMix()],
  data () {
    return {
      columns: orderListColumns,
      list: [],
      total: 0,
      loading: false,
    };
  },

  watch: {
    '$store.state.order.claimOrderFormSearch': function (value) {
      this.pagination.current = 1;
      this.fetch(omitSearchFields(value));
    },
  },
  created () {
    const { ids } = this.$route.query;
    const idsSearch = ids ? { ids } : void 0;
    this.fetch(idsSearch);
  },
  methods: {
    ...mapActions(['getClaimOrderaPage', 'getReporterData']),
    fetch (ids) {
      this.loading = true;
      this.getClaimOrderaPage({ ...ids, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    tableChangeHandle () {
      this.fetch(this.$store.state.order.claimOrderFormSearch);
    },
    create (type) {
      const num = this.rowSelection.selectedRowKeys.length;
      const resList = [...this.selectedRows];
      const resListNo = resList.map((item) => item.claimNo);
      if (type === 'single') {
        this.$router.push({
          path: '/order/create-single',
          query: { ids: resListNo, asqIssueRptType: '1', num },
        });
      } else {
        this.$router.push({
          path: '/order/create-batch',
          query: { ids: resListNo, asqIssueRptType: '2', num },
        });
      }
    },
    // create (type) {
    //   const num = this.rowSelection.selectedRowKeys.length;
    //   const resList = [...this.selectedRows];
    //   const resListNo = resList.map((item) => item.claimNo);
    //   if (type === 'single') {
    //     this.$router.push({
    //       path: '/order/create-single',
    //       query: { ids: resListNo, asqIssueRptType: '1', num },
    //     });
    //   } else {
    //     const infoList = this.selectedRows.map((record) => record.vhclModelSaleCode + record.partCode);
    //     if (uniq(infoList).length !== 1) {
    //       this.$message.error(<span style="fontSize:18px;lineHeight:2">请选择相同车型和祸首件！</span>);
    //     } else {
    //       this.$router.push({
    //         path: '/order/create-batch',
    //         query: { ids: resListNo, asqIssueRptType: '2', num },
    //       });
    //     }
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
  .root {
    padding-top: 16px;
    .vehicle-info-alert {
      margin-top: 12px;
    }
  }

  @table-height: 554px;
  @table-head-height: 54px;
  .ant-table-wrapper {
    padding-top: 16px;
    /deep/ .ant-spin-nested-loading {
      min-height: @table-height;
    }
    /deep/ .ant-table-placeholder {
      min-height: calc(@table-height - @table-head-height);
      .ant-empty-normal {
        margin-top: calc(@table-height / 2 - @table-head-height);
      }
    }
    /deep/ .ant-table-pagination.ant-pagination {
      margin-bottom: 4px;
    }
  }
</style>
