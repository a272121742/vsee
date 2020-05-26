<template>
  <div class="root">
    <!-- 标题 -->
    <h2 class="title">
      <a-icon
        type="iconbs_filled"
      ></a-icon>
      {{ $t('issue.vehicleInformation') }}
    </h2>
    <!-- 操作按钮 -->
    <div
      class="operate-buttons"
      style="margin:16px 0;"
    >
      <!-- 车辆查询 -->
      <a-button
        v-if="isHandmade==='1'"
        type="primary"
        style="margin-right:10px;"
        @click="() => (showVechicleSearchModal = true)"
      >
        <a-icon type="icondccj_outlined1"></a-icon>
        {{ $t('action.vehicleSearch') }}
        <vehicle-search-dialog
          :visible.sync="(showVechicleSearchModal)"
          :asq-issue-rpt-type="asqIssueRptType"
          @fn="flagFn"
        />
      </a-button>
      <!-- 删除 -->
      <a-button
        v-if="(isHandmade!=='0') || (!isEdit )|| (asqIssueRptType!=='1')"
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
        已选： <span style="color: #0097E0;">{{ rowSelection.selectedRowKeys.length }} 条</span>
      </template>
    </a-alert>
    <div>
      <!-- 售后工单 + 编辑是工单 的 车辆查询表格 -->
      <a-table
        v-if="isHandmade==='0'"
        :data-source="list"
        row-key="claimNo"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="{x: 1400,y:670}"
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
                  :disabled="true"
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
                  :disabled="true"
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
                  :disabled="true"
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
      <!-- 手工创建 + 编辑是手工 的 车辆查询表格 -->
      <a-table
        v-else
        :data-source="list"
        row-key="vin"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="list.length>4?{x: 1400,y:670}:{x: 1400}"
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
                  :disabled="false"
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
                  :disabled="false"
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
                  :disabled="false"
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
import storeModuleMix from '@mix/store-module.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import { vehicleInformationColumns } from '~~/model/vehicleInformation';

export default {
  name: 'VehicleInformation',
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    'vehicle-search-dialog': () => import('./vehicle-search-dialog.vue'),
    'enter-vehicle-information': () => import('./enter-vehicle-information.vue'),
  },
  mixins: [
    tableRowSelectionMix(),
    paginationMix(),
    storeModuleMix({
      name: 'issue',
      action: ['getVehicleSearchDialogPage', 'getReporterData', 'getAllReporterData', 'paginationHandle', 'getEditAllOrderList', 'deleteAllEditData', 'getAllHandsPage', 'deleteHandAll'],
    }),
  ],
  props: {
    vehicleMergeData: {
      type: Array,
      default: () => [],
    },
    envAndIfo: {
      type: Object,
      default: () => ({}),
    },
    // 从编辑页面 获取到的数据
    mergeData: {
      type: Object,
      default: () => ({}),
    },
    // 工单创建的时候 获取的数据  全选
    resultData: {
      type: Array,
      default: () => [],
    },
    // 工单创建的时候 获取的数据  非全选
    noResultData: {
      type: Array,
      default: () => [],
    },
    // 工单页面穿过来的 查询参数 全选
    paramsMap: {
      type: Object,
      default: () => ({}),
    },
    total: {
      type: Number,
      default: 0,
    },
    asqIssueRptId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      list: [],
      visible: false,
      showVechicleSearchModal: false,
      enterData: {},
      enterVehicleList: {},
      envAndIfoData: {},
      isHandmade: '',
      pagination: {},
      selectedKeys: [],
      totalKeys: [],
      asqIssueRptType: '',
      num: 0,
      resultParams: {},
      handAllFlag: false,
      orderFlag: false,
      isScroll: false,
    };
  },
  computed: {
    isEdit () {
      return JSON.stringify(this.$route.query) === '{}';
    },
    hasSelected () {
      return this.rowSelection.selectedRowKeys.length > 0;
    },
    columns () {
      return vehicleInformationColumns;
    },
  },
  watch: {
    // 工单 + 全量 + 编辑 ：删除时需要的总量
    total: {
      immediate: true,
      handler (total) {
        this.num = total;
      },
    },
    // 用来判断关闭弹框后 是否立即渲染列表
    '$store.state.issue.isFlag': function (value) {
      if (value) {
        if (this.$store.state.issue.selectedVehicleRowKeys.length > 0) {
          this.fetch({ vin: this.$store.state.issue.selectedVehicleRowKeys });
          this.$store.commit('issue/set', { isFlag: false });
        } else {
          this.list = [];
        }
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
        this.pagination.showSizeChanger = false;
        if (this.asqIssueRptType === '3') {
          this.pagination.total = this.total;
          this.pagination.pageSize = 10;
        } else {
          this.pagination.pageSize = 100;
        }
        // 编辑的时候只需拿到车辆信息的第一行的环境和数据信息即可
        if (this.vehicleMergeData.length > 0) {
          this.envAndIfoData = { ...this.envAndIfoData, ...this.vehicleMergeData[0] };
        }
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  全量
     */
    resultData: {
      immediate: false,
      handler (resultData = []) {
        this.list = resultData;
        this.pagination.pageSize = 10;
        this.pagination.total = Number(this.$route.query.num);
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用于回显  非全量
     */
    noResultData: {
      immediate: false,
      handler (noResultData = []) {
        this.list = noResultData;
        const orderKeys = noResultData.map((item) => item.claimNo);
        this.$store.commit('issue/set', { orderRowKeys: orderKeys });
        this.pagination.showSizeChanger = false;
        this.pagination.pageSize = 100;
      },
    },
  },
  created () {
    // 先将这两个初始化
    this.$store.commit('issue/set', { vehicleInforSearch: {} });
    // 判断 单车/批量/全量
    this.asqIssueRptType = this.$route.query.asqIssueRptType ? this.$route.query.asqIssueRptType : this.asqIssueRptType;
    // 判断是 手工 ？工单
    if (this.$route.query.isHandmade !== undefined) {
      this.isHandmade = this.$route.query.isHandmade;
    }
    // 判断工单全量？
    if (this.$route.query.orderFlag !== undefined) {
      this.orderFlag = this.$route.query.orderFlag;
    }
  },
  methods: {
    // 子传父
    flagFn (data) {
      this.handAllFlag = data;
    },
    /**
     * 通过网络获取数据列表
     */
    fetch (config = {}) {
      // 手工全量渲染
      if (this.handAllFlag) {
        this.getAllHandsPage({ asqIssueRptType: '3', ...this.$store.state.issue.vehicleInforSearch, ...this.serverPagination }).then(this.load);
        return config;
      }
      // 手工 批量/单车渲染
      this.getVehicleSearchDialogPage({ ...config, ...this.serverPagination }).then(this.load);
      return config;
    },
    /**
     * 装载数据
     */
    load (res) {
      if (this.handAllFlag) {
        this.list = res.resultData.list;
        this.resultParams = res.resultParams;
        this.pagination.total = res.resultData.total;
        // 故障频次
        this.$store.commit('issue/set', { faultFrequency: res.resultData.total });
        this.num = res.resultData.total;
        this.pagination.showSizeChanger = false;
        this.pagination.pageSize = 10;
      } else {
        this.list = res.list;
        this.pagination.total = res.total;
        // 故障频次
        this.$store.commit('issue/set', { faultFrequency: res.total });
        this.pagination.showSizeChanger = false;
        this.pagination.pageSize = 100;
      }
    },
    /**
     * 分页方法
     */
    tableChangeHandle () {
      if (this.orderFlag) {
        // 工单 + 全量 + 创建
        this.getAllReporterData({ claimNoTwo: this.totalKeys, ...this.paramsMap, ...this.serverPagination }).then((res) => {
          this.pagination.pageSize = 10;
          this.list = res.resultData;
        });
      } else if (this.handAllFlag) {
        // 手工 + 全量 + 创建
        this.getAllHandsPage({ notInVin: this.totalKeys, ...this.resultParams, ...this.serverPagination }).then((res) => {
          this.list = res.resultData.list;
          this.pagination.pageSize = 10;
        });
      } else {
        // 手工 /工单 + 全量 + 编辑
        this.getEditAllOrderList({ asqIssueRptId: this.asqIssueRptId, ...this.serverPagination }).then((res) => {
          this.list = res.resultData.list;
        });
      }
    },
    /**
     * 删除已经选择的数据行
     */
    deleteOption (key) {
      if (key.length === 0) {
        this.$message.info('请选择删除项！！', 1);
      } else {
        const newKeys = this.totalKeys.concat(this.rowSelection.selectedRowKeys);
        this.totalKeys = newKeys;
        if (this.asqIssueRptType !== '3' && !this.handAllFlag) {
          // 手工/工单 + 批量/单车
          this.list = this.list.filter((item) => !key.includes(this.isHandmade === '1' ? item.vin : item.claimNo));
          this.pagination.total = this.list.length;
          this.$store.commit('issue/set', { faultFrequency: this.list.length });
          if (this.isEdit) {
            this.deleteAllEditData({ ids: this.rowSelection.selectedRowKeys, asqIssueRptId: this.asqIssueRptId });
          }
          this.rowSelection.selectedRowKeys = [];
        } else if (this.isHandmade === '0' && this.orderFlag) {
        // 工单 + 创建 + 全量
          this.rowSelection.selectedRowKeys = [];
          this.pagination.total = Number(this.paramsMap.num) - this.totalKeys.length;
          this.$store.commit('issue/set', { faultFrequency: Number(this.paramsMap.num) - this.totalKeys.length });
          this.pagination.pageSize = 10;
          this.getAllReporterData({
            claimNoTwo: this.totalKeys, ...this.paramsMap, ...this.resultParams, ...this.serverPagination,
          }).then((res) => {
            this.list = res.resultData;
          });
        } else if (this.isHandmade === '1' && this.handAllFlag) {
        // 手工 + 创建 + 全量
          this.rowSelection.selectedRowKeys = [];
          this.pagination.total = this.num - this.totalKeys.length;
          this.$store.commit('issue/set', { faultFrequency: this.num - this.totalKeys.length });
          this.deleteHandAll({
            notInVin: this.totalKeys, ...this.resultParams, ...this.serverPagination,
          }).then((res) => {
            this.list = res.resultData.list;
          });
        } else {
        // 手工/工单 + 编辑 + 全量
          this.pagination.total = Number(this.num) - this.totalKeys.length;
          this.$store.commit('issue/set', { faultFrequency: Number(this.num) - this.totalKeys.length });
          this.deleteAllEditData({ ids: this.rowSelection.selectedRowKeys, asqIssueRptId: this.asqIssueRptId }).then((res) => {
            this.list = res;
            this.rowSelection.selectedRowKeys = [];
          });
        }
      }
    },
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return this.$refs.enterVehicleInformation.getEnvAndInfoData().then((enterVehicleList) => {
        const asqVchList = this.list.map((item) => Object.assign(item, enterVehicleList));
        // 判断车辆选择数量是否正确
        if (this.handAllFlag && asqVchList.length > 1) {
          // 手工全量+创建
          return Promise.resolve({ asqVchList, params: { ...this.resultParams, notInVin: this.totalKeys }, handAllFlag: this.handAllFlag });
        }
        if (this.orderFlag && asqVchList.length > 1) {
          // 工单全量+创建
          return Promise.resolve({ asqVchList, params: { claimNoTwo: this.totalKeys } });
        }
        if (!this.orderFlag && !this.handAllFlag && this.asqIssueRptType !== '1' && asqVchList.length > 1) {
          // 编辑 +全量
          return Promise.resolve({ asqVchList });
        }
        if (this.asqIssueRptType === '1' && asqVchList.length === 1) {
          // 单车
          return Promise.resolve({ asqVchList });
        }
        // return Promise.reject(this.$message.info('请选择对应的车辆数量！'));
        return Promise.reject(this.$message.show({
          type: 'info',
          duration: 3,
          content: '请选择对应的车辆数量！！！',
        }));
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
    tbody tr {
      height: 65px!important;
    }
  }
  // /deep/  .ant-select-dropdown-menu-root{
  //     overflow:visible ;
  //   .ant-select-dropdown-menu-item{
  //     overflow:visible ;
  //   }
  // }
}
</style>
