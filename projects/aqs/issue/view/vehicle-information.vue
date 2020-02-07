<template>
  <div class="root">
    <!-- 标题 -->
    <h2 class="title">
      <v-icon
        type="iconbs_filled"
      ></v-icon>
      {{ $t('issue.vehicleInformation') }}
    </h2>
    <!-- 操作按钮 -->
    <div
      class="operate-buttons"
      style="margin:16px 0;"
    >
      <!-- 车辆查询 -->
      <a-button
        v-if="isShown"
        type="primary"
        style="margin-right:10px;"
        @click="() => (showVechicleSearchModal = true)"
      >
        <v-icon type="icondccj_outlined1"></v-icon>
        {{ $t('action.vehicleSearch') }}
        <vehicle-search-dialog
          :visible.sync="(showVechicleSearchModal)"
          :multiple-select="asqIssueRptType !== '1'"
        />
      </a-button>
      <!-- 删除 -->
      <a-button
        @click="deleteOption(rowSelection.selectedRowKeys)"
      >
        {{ $t('action.delete') }}
      </a-button>
    </div>
    <!-- 信息提示 -->
    <a-alert
      class="vehicle-info-alert"
      type="info"
      show-icon
    >
      <template #message>
        共计： <span style="color: #0097E0;">{{ rowSelection.selectedRowKeys.length }} 条</span>
      </template>
    </a-alert>
    <div>
      <!-- 车辆查询表格 -->
      <a-table
        :data-source="list"
        row-key="vin"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="{x: 1400}"
        size="small"
        class="ellipsis-table"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`issue.${col.dataIndex}`) }}
            </span>
            <template slot-scope="text, row">
              <!-- 里程输入框 -->
              <span v-if="col.dataIndex === 'latestMileage'">
                <a-input-number
                  v-model="row.latestMileage"
                  class="inputNumber"
                  :min="0"
                  placeholder="输入数字"
                  autocomplete="off"
                  allow-clear
                  style="width:110px"
                  @change="(value) => setRowLatestMileage(row, value)"
                />
              </span>
              <!-- 城市做下拉框 -->
              <span v-else-if="col.dataIndex === 'dealerCityId'">
                <single-net-select
                  v-model="row.dealerCityId"
                  style="width: 140px;"
                  url="/masterdata/v1/area/province"
                  :placeholder="$t('form.select')"
                  value-by="id"
                  label-of="areaNameZh"
                  :delay="false"
                  :disabled="!isShown"
                  allow-clear
                  @change="(value) => setRowCity(row, value)"
                />
              </span>
              <!-- 服务站下拉框 -->
              <span v-else-if="col.dataIndex === 'serviceStationId'">
                <single-net-select
                  v-model="row.serviceStationId"
                  style="width: 160px;"
                  url="/masterdata/v1/servicestation/stationList"
                  :placeholder="$t('form.select')"
                  value-by="id"
                  label-of="serviceStationShortName"
                  :delay="false"
                  :disabled="!isShown"
                  search-by="all"
                  allow-clear
                  @change="(value) => setRowDealerCityId(row, value)"
                />
              </span>
              <a-tooltip
                v-else
                placement="topLeft"
              >
                <template #title>
                  {{ text }}
                </template>
                {{ text }}
              </a-tooltip>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <!-- 环境与数据信息 -->
      <enter-vehicle-information
        ref="enterVehicleInformation"
        :env-and-ifo-data="envAndIfoData"
      />
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import { vehicleInformationColumns } from '~~/model/vehicleInformation';

const { mapActions } = createNamespacedHelpers('issue');

// 根据对象id去重
// const uniqById = uniqWith((left, right) => left.vhclId === right.vhclId);

export default {
  name: 'VehicleInformation',
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    'vehicle-search-dialog': () => import('./vehicle-search-dialog.vue'),
    'enter-vehicle-information': () => import('./enter-vehicle-information.vue'),
  },
  mixins: [tableRowSelectionMix(), paginationMix()],
  props: {
    vehicleMergeData: {
      type: Array,
      default: () => [],
    },
    envAndIfo: {
      type: Object,
      default: () => ({}),
    },
    mergeData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      list: [],
      total: 0,
      visible: false,
      showVechicleSearchModal: false,
      enterData: {},
      enterVehicleList: {},
      envAndIfoData: {},
      asqIssueRptType: '',
      isHandmade: '',
      pagination: {},
      selectedKeys: [],
    };
  },
  computed: {
    hasSelected () {
      return this.rowSelection.selectedRowKeys.length > 0;
    },
    columns () {
      return vehicleInformationColumns;
    },
    isShown () {
      const isShown = (this.$route.path === '/issue/definition-list/create-single'
            || this.$route.path === '/issue/definition-list/create-batch'
            || this.mergeData.isHandmade === '1');
      return isShown;
    },
  },
  watch: {
    '$store.state.issue.selectedVehicleRowKeys': function (selectedKeys) {
      if (selectedKeys.length > 0) {
        this.fetch({ vin: selectedKeys });
      } else {
        this.list = [];
      }
    },
    '$store.state.issue.enterVehicleList': function (value) {
      this.enterVehicleList = value;
    },
    /**
    * 点击编辑按钮进来渲染车辆信息页面
    */
    vehicleMergeData: {
      immediate: true,
      handler (vehicleMergeData = {}) {
        this.asqIssueRptType = this.mergeData.asqIssueRptType ? this.mergeData.asqIssueRptType : this.asqIssueRptType;
        this.isHandmade = this.mergeData.isHandmade;
        this.list = [...this.list, ...vehicleMergeData];
        this.$store.commit('issue/set', { selectedVehicleRowKeys: this.list.map((item) => item.vin) });
        this.pagination.showSizeChanger = false;
        // 编辑的时候只需拿到车辆信息的第一行的环境和数据信息即可
        if (this.vehicleMergeData.length > 0) {
          this.envAndIfoData = { ...this.envAndIfoData, ...this.vehicleMergeData[0] };
        }
      },
    },
  },
  /**
     * 售后工单进来的渲染车辆信息页面
     */
  created () {
    if (this.$route.path.startsWith('/order')) {
      this.getReporterData({ ids: this.$route.query.ids }).then((res) => {
        this.list = [...this.list, ...res];
        // this.selectedKeys = this.list.map((item) => item.vin);
        this.pagination.showSizeChanger = false;
      });
    }
    this.asqIssueRptType = this.$route.query.asqIssueRptType ? this.$route.query.asqIssueRptType : this.asqIssueRptType;
  },
  methods: {
    ...mapActions([
      'deleteVehicleInformation',
      'getVehicleSearchDialogPage',
      'getReporterData',
    ]),
    /**
     * 通过网络获取数据列表
     */
    fetch (vin) {
      this.getVehicleSearchDialogPage({ ...vin }).then(this.load);
      return vin;
    },
    /**
     * 装载数据
     */
    load (res) {
      /**
       * 防止新渲染的list将原先的list替换掉
       */
      res.list.forEach((item, index, input) => this.list.forEach((item1) => {
        if (item.vin === item1.vin) {
          input[index] = item1;
        }
      }));
      this.list = res.list;
      this.pagination.total = this.selectedKeys.length;
      this.pagination.showSizeChanger = false;
    },
    /**
     * 分页方法
     */
    tableChangeHandle (selectedKeys) {
      this.fetch(selectedKeys);
    },
    /**
     * 删除已经选择的数据行
     */
    deleteOption (key) {
      this.list = this.list.filter((item) => !key.includes(item.vin));
      this.rowSelection.selectedRowKeys = this.list.filter((item) => key.includes(item.vin));
      // 拿到删除后的keys
      const listKeys = this.list.map((item) => item.vin);
      this.selectedKeys = listKeys;
      this.$store.commit('issue/set', { selectedVehicleRowKeys: listKeys });
    },
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return this.$refs.enterVehicleInformation.getEnvAndInfoData().then((enterVehicleList) => {
        const asqVchList = this.list.map((item) => Object.assign(item, enterVehicleList));
        // 判断车辆选择数量是否正确
        if (this.asqIssueRptType === '2' && asqVchList.length > 1) {
          return Promise.resolve({ asqVchList });
        }
        if (this.asqIssueRptType === '1' && asqVchList.length === 1) {
          return Promise.resolve({ asqVchList });
        }
        return Promise.reject(this.$message.info('请选择对应的车辆信息！'));
      });
    },

    /**
     * 设置表格行的城市信息
     */
    setRowCity (row, value) {
      row.dealerCityId = value;
    },
    /**
     * 设置表格行的服务站信息
     */
    setRowDealerCityId (row, value) {
      row.serviceStationId = value;
    },
    /**
     *设置里程
     */
    setRowLatestMileage (row, value) {
      row.latestMileage = value;
    },
  },
};
</script>
<style lang="less" scoped>
.root {
  margin-bottom: 16px;
  .title {
    margin: 16px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    /deep/ .anticon {
      color: @primary-color;
    }
  }
  .vehicle-info-alert {
    margin-bottom: 8px;
  }
  .operate-buttons {
    margin: 0 0 16px;
  }
  /deep/ .ant-table-fixed {
    // thead tr {
    //   height: 45px;
    // }
    tbody tr {
      height: 65px!important;
    }
    // tr > th,
    // tr > td {
    //   padding: 12px 0;
    // }
  }
  /deep/  .ant-select-dropdown-menu-root{
      overflow:visible ;
 .ant-select-dropdown-menu-item{
      overflow:visible ;
  }
}
}
</style>
