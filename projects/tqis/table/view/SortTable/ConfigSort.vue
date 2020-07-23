<template>
  <div>
    <a-page-header
      title="排序"
      sub-title="用于进行表格排序"
    >
      <template slot="extra">
        <a-modal
          v-model="showSource"
          centered
          width="80%"
        >
          <SourceCodeView :code="code"></SourceCodeView>
        </a-modal>
        <a-button-group>
          <a-button @click="() => showSource = !showSource">
            源码
          </a-button>
          <a-button
            :disabled="action"
            @click="set"
          >
            加载
          </a-button>
          <a-button
            :disabled="action"
            @click="removeSelected()"
          >
            清空
          </a-button>
        </a-button-group>
      </template>
    </a-page-header>
    <a-table
      :class="{ 'table-cell-ellipsis': true, 'table-cintainer-fixed-demo': true}"
      row-key="id"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template v-for="(col, index) in columns">
        <a-table-column
          :key="index"
          v-bind="{ ...col, ...($options.sortFields.includes(col.dataIndex) ? { sorter: true, sortOrder: sortedInfo.orderField === col.dataIndex && sortedInfo.order } : {})}"
        >
          <span slot="title">
            {{ col.dataIndex }}
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
import paginationMix from '@mix/pagination.js';
import $ from '@http';
import { vehicleListColumns } from '~~/model/vehicle.js';
import code from './ConfigSort.code.js';


export default {
  sortFields: ['dealerCode'],
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    paginationMix(),
  ],
  data () {
    return {
      columns: vehicleListColumns,
      list: [],
      loading: false,
      showSource: false,
      code,
      action: false,
      sortedInfo: {
        order: false,
        orderField: 'dealerCode',
      },
    };
  },
  watch: {
    loading (value) {
      this.pagination.disabled = value;
    },
  },
  created () {
    this.fetch();
  },
  methods: {
    fetch (config = {}) {
      this.list = [];
      this.loading = true;
      $.get('/masterdata/v1/vehicle/page', { ...config, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = this.empty ? [] : res.list;
      this.pagination.total = res.total;
    },
    set () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const data = [this.list[0], this.list[3]];
        const id = setTimeout(() => {
          this.rowSelection.load(data);
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    reset () {
      this.loading = false;
    },
    handleTableChange (pagination, filters, sorter) {
      this.sortedInfo.order = sorter.order;
      this.sortedInfo.orderField = sorter.columnKey;
      this.fetch();
    },
    removeSelected (selected) {
      if (selected) {
        this.rowSelection.shift(selected);
      } else {
        this.rowSelection.clear();
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-table-wrapper {
    padding-top: 0!important;
    &.table-cintainer-fixed-demo {
      .table-container-fixed-defined(67px; 46px);
    }
    padding-top: 16px;
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 8px;
      margin-bottom: 4px;
    }
  }
</style>
