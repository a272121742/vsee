<template>
  <div>
    <a-table
      :data-source="list"
      row-key="vin"
      :pagination="pagination"
      :row-selection="rowSelection"
      :loading="loading"
      size="small"
      @change="tableChangeHandle"
    >
      <template v-for="(col,index) in columns">
        <a-table-column
          :key="index"
          v-bind="col"
        >
          <span
            slot="title"
          >
            {{ $t(`issue.${col.dataIndex}`) }}
          </span>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script>
import { omit } from 'ramda';
import { createNamespacedHelpers } from 'vuex';
import paginationMix from '@mix/pagination.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import { dialogColumns } from '~~/model/VehicleSearchDialog.js';

const { mapActions } = createNamespacedHelpers('issue');
const omitSearchFields = omit(['prodDate', 'warrantyBeginDate']);
export default {
  mixins: [paginationMix(), tableRowSelectionMix()],
  props: {
    selectedKeys: {
      type: Array,
      default: () => [],
    },
    multipleSelect: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      columns: dialogColumns,
      list: [],
      total: 0,
      loading: false,
    };
  },
  watch: {
    '$store.state.issue.vehicleInforSearch': function (value) {
      this.pagination.current = 1;
      this.fetch(omitSearchFields(value));
    },
    selectedKeys (value) {
      this.rowSelection.selectedRowKeys = value;
    },
  },
  created () {
    this.rowSelection.multipleSelect = this.multipleSelect;
    this.rowSelection.selectedRowKeys = this.selectedKeys;
    this.fetch({ selectedKeys: [] });
  },
  methods: {
    ...mapActions(['getVehicleSearchDialogPage']),
    fetch (config = {}) {
      this.loading = true;
      this
        .getVehicleSearchDialogPage({ ...config, ...this.serverPagination })
        .then(this.load)
        .finally(this.reset);
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    tableChangeHandle () {
      this.fetch(this.$store.state.issue.vehicleInforSearch);
    },
  },
};
</script>

<style lang="less" scoped>
  @table-height: 460px;
  @table-head-height: 54px;
  .ant-table-wrapper {
    padding-top: 12px;
    /deep/ .ant-spin-nested-loading {
      height: @table-height;
    }
    /deep/ .ant-table-placeholder {
      height: calc(@table-height - @table-head-height);
      .ant-empty-normal {
        margin-top: calc(@table-height / 2 - @table-head-height);
      }
    }
    /deep/ .ant-table-pagination {
      margin-bottom: 0;
    }
  }
</style>
