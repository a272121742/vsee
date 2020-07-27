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
            @click="resetSorter"
          >
            重置
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
      <template v-for="(col, index) in $options.columns">
        <a-table-column
          :key="index"
          v-bind="col"
          :sorter="col | sortable"
          :sort-order="col | orderby"
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
import sorterMix from '@mix/sorter.js';
import $ from '@http';
import { vehicleListColumns } from '~~/model/vehicle.js';
import code from './ConfigSort.code.js';


export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    paginationMix(),
    sorterMix(),
  ],
  columns: vehicleListColumns,
  data () {
    return {
      list: [],
      loading: false,
      showSource: false,
      code,
      action: false,
      sortField: ['dealerCode'],
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
      $.get('/masterdata/v1/vehicle/page', { ...config, ...this.serverPagination, ...this.serverSorter }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = this.empty ? [] : res.list;
      this.pagination.total = res.total;
    },
    set () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const id = setTimeout(() => {
          this.sorter.set('custCode', 'ascend');
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    reset () {
      this.loading = false;
    },
    resetSorter () {
      this.sorter.reset();
      this.fetch();
    },
    handleTableChange (pagination, filters, sorter) {
      this.sorter.set(sorter.field, sorter.order);
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
