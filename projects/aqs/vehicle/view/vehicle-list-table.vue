<template>
  <a-table
    class="ellipsis-table"
    row-key="id"
    :data-source="list"
    :pagination="pagination"
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
          {{ $t(`vehicle.${col.dataIndex}`) }}
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
import { omit } from 'ramda';
import { createNamespacedHelpers } from 'vuex';
import paginationMix from '@mix/pagination.js';
import { vehicleListColumns } from '~~/model/vehicle.js';

const { mapActions } = createNamespacedHelpers('vehicle');
const omitSearchFields = omit(['prodDate', 'warrantyBeginDate']);

export default {
  mixins: [paginationMix()],
  data () {
    return {
      columns: vehicleListColumns,
      list: [],
      total: 0,
      loading: false,
    };
  },
  watch: {
    '$store.state.vehicle.vehicleSearchList': function (value) {
      this.pagination.current = 1;
      this.fetch(omitSearchFields(value));
    },
  },
  created () {
    const { vin } = this.$route.query;
    const vinSearch = vin ? { vin } : void 0;
    this.fetch(vinSearch);
  },
  methods: {
    ...mapActions(['getVehiclePage']),
    fetch (vin) {
      this.loading = true;
      this.getVehiclePage({ ...vin, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    reset () {
      this.loading = false;
    },
    tableChangeHandle () {
      this.fetch(this.$store.state.vehicle.vehicleSearchList);
    },
  },
};
</script>

<style lang="less" scoped>
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
