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
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import { vehicleListColumns } from '~~/model/vehicle.js';


export default {
  mixins: [
    paginationMix(),
    storeModuleMix({
      name: 'vehicle',
      action: ['getVehiclePage', 'getVehicleAllPage'],
    }),
  ],
  data () {
    return {
      columns: vehicleListColumns,
      list: [],
      total: 0,
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '50', '100'],
      },
    };
  },
  watch: {
    '$store.state.vehicle.vehicleSearchList': function (value) {
      Object.assign(this.$route.query, { asqIssueRptId: '' });
      window.history.pushState(null, null, window.location.href.split('?')[0]);
      this.pagination.current = 1;
      this.fetch(value);
    },
  },
  created () {
    // 批量
    if (this.$route.query.vin !== undefined) {
      Object.assign(this.$route.query, { asqIssueRptId: '' });
      this.pagination.pageSize = 100;
      this.serverPagination.limit = 100;
      this.pagination.showSizeChanger = false;
    }
    const { vin } = this.$route.query;
    const vinSearch = vin ? { vin } : void 0;
    this.fetch(vinSearch);
  },
  methods: {
    fetch (vin) {
      this.loading = true;
      if (Object.keys(this.$route.query).length !== 0 && this.$route.query.asqIssueRptId !== '') {
        this.getVehicleAllPage({ asqIssueRptId: this.$route.query.asqIssueRptId, ...this.serverPagination }).then(this.load).finally(this.reset);
      } else {
        this.getVehiclePage({ ...vin, ...this.serverPagination }).then(this.load).finally(this.reset);
      }
    },
    load (res) {
      if (Object.keys(this.$route.query).length !== 0 && this.$route.query.asqIssueRptId !== '') {
        console.log('工单', res);
        this.list = res.list;
        this.pagination.total = res.total;
      } else {
        this.list = res.list;
        this.pagination.total = res.total;
      }
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
