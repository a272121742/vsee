<template>
  <a-table
    v-water-mark
    :class="{ 'table-cell-ellipsis': true, 'table-cintainer-fixed-demo': fixed}"
    row-key="id"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ x: 2500 }"
  >
    <template v-for="(col, index) in columns">
      <a-table-column
        :key="index"
        v-bind="col"
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
</template>

<script>
import paginationMix from '@mix/pagination.js';
import $ from '@http';
import { vehicleListColumns } from '~~/model/vehicle.js';


export default {
  mixins: [
    paginationMix(),
  ],
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
    empty: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      columns: vehicleListColumns,
      list: [],
      loading: false,
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
    fetch () {
      this.list = [];
      this.loading = true;
      $.get('/masterdata/v1/vehicle/page').then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = this.empty ? [] : res.list;
      this.pagination.total = res.total;
    },
    reset () {
      this.loading = false;
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
