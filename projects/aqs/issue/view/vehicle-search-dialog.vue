<template>
  <a-modal
    :visible="visible"
    centered
    :mask-closable="false"
    :z-index="6000"
    :title="$t('issue.dialogTitle')"
    :width="1200"
    :body-style="{padding: '16px 24px'}"
    style="margin-top:10vh"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
      <!-- 表格 -->
      <a-form-model
        :model="dialogForm"
        class="form-column-split-compact form-column-action-right"
        layout="vertical"
      >
        <!-- {{ record }} -->
        <a-row :gutter="24">
          <!-- 车型 -->
          <a-col :span="formItemSpan">
            <a-form-model-item
              :label="$t('issue.vhclSeriesCode')"
            >
              <multiple-net-select
                v-model="dialogForm.vhclSeriesCode"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/vehicleseries/seriesCodeList"
                value-by="id"
                :label-of="(item) => item.vhclSeriesCode"
                allow-clear
                search-by="name"
                :max-tag-count="1"
              />
            </a-form-model-item>
          </a-col>
          <!-- VIN -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.vinTit')">
              <a-input
                v-model="dialogForm.vin"
                placeholder="请输入"
                autocomplete="off"
                allow-clear
              />
            </a-form-model-item>
          </a-col>
          <!-- 电池 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.batteryCode')">
              <multiple-net-select
                v-model="dialogForm.batteryCode"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/vehicle/batteryAndCode"
                value-by="id"
                :max-tag-count="0"
                :label-of="(item) => item.batteryCode"
                allow-clear
                search-by="code"
              />
            </a-form-model-item>
          </a-col>
          <!-- 下线工厂 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.factoryName')">
              <single-net-select
                v-model="dialogForm.factoryName"
                :placeholder="$t('form.select')"
                url="/sys/dict?dictType=factory_code"
                value-by="dictName"
                :label-of="(item) => item.dictName"
                allow-clear
                close-search
              />
            </a-form-model-item>
          </a-col>
          <!-- 生产日期 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.prodDate')">
              <a-range-picker
                v-model="dialogForm.prodDate"
                :get-calendar-container="e => e.parentNode"
                :format="DATE_FORMAT"
              />
            </a-form-model-item>
          </a-col>
          <!-- 销售日期 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.salesDate')">
              <a-range-picker
                v-model="dialogForm.warrantyBeginDate"
                :get-calendar-container="e => e.parentNode"
                :format="DATE_FORMAT"
              />
            </a-form-model-item>
          </a-col>
          <!-- 车辆用途 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('issue.carUsageCode')">
              <multiple-net-select
                v-model="dialogForm.carUsageCode"
                :placeholder="$t('form.select')"
                url="/sys/dict?dictType=car_usage_code"
                value-by="dictValue"
                :label-of="(item) => item.dictName"
                allow-clear
                close-search
              />
            </a-form-model-item>
          </a-col>

          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <a-button
              type="primary"
              @click="getDialogSearch"
            >
              {{ $t('action.find') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="dialogRest"
            >
              {{ $t('action.reset') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- 信息提示 -->
      <a-alert
        class="vehicle-info-alert"
        type="info"
        show-icon
      >
        <template #message>
          已选: <span style="color: #0097E0;">{{ rowSelection.selectedRowKeys.length }} 条</span>
        </template>
      </a-alert>
      <!-- 表格 -->
      <a-table
        :data-source="list"
        row-key="vin"
        :pagination="pagination"
        :row-selection="rowSelection"
        :loading="loading"
        size="small"
        class="table-cell-ellipsis"
        :scroll="{x: 1000}"
        :disabled="true"
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
  </a-modal>
</template>
<script>
import { omit } from 'ramda';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import { RANGE_TO_MAP_BY_FIELD } from '@util/datetime-helper.js';
import { dialogColumns } from '~~/model/VehicleSearchDialog.js';

// const fileds = ['vin', 'batteryCode', 'factoryName', 'prodDate', 'warrantyBeginDate', 'carUsageCode', 'vhclSeriesCode'];

const omitSearchFields = omit(['prodDate', 'warrantyBeginDate']);
export default {
  mixins: [
    tableRowSelectionMix(),
    paginationMix(),
    tableRowSelectionMix(),
    storeModuleMix({
      name: 'issue',
      action: ['getVehicleSearchDialogPage'],
    }),
  ],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    asqIssueRptType: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      dialogForm: {},
      selectedKeys: [],
      formItemSpan: 6,
      columns: dialogColumns,
      list: [],
      total: 0,
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      rowSelection: {
        columnWidth: 68,
        hideDefaultSelections: true,
        selections: this.sFn(),
        getCheckboxProps: () => ({
          props: {
            disabled: this.isEdit && this.asqIssueRptType === '3',
          },
        }),
      },
      handAllFlag: false,
      keys: [],
    };
  },
  computed: {
    isEdit () {
      return JSON.stringify(this.$route.query) === '{}';
    },
  },
  watch: {
    visible (value) {
      if (value) {
        this.selectedKeys = [];
        this.$set(this, 'dialogForm', {});
        this.rowSelection.selectedRowKeys = [];
        this.handAllFlag = false;
        this.fetch();
      }
    },
    // 全选时不可以再进行操作
    'rowSelection.selectedRowKeys': function (value) {
      if (this.handAllFlag) {
        if (value.length < this.pagination.total) {
          const that = this;
          this.showConfirm(that);
        }
      } else {
        this.selectedKeys = value;
      }
    },
  },
  created () {
    if (this.$route.query.asqIssueRptType !== undefined) {
      this.$store.commit('issue/set', { selectedVehicleRowKeys: [] });
    }
    this.rowSelection.type = this.asqIssueRptType !== '1' ? 'checkbox' : 'radio';
    this.fetch({ selectedKeys: [] });
  },
  methods: {
    // 判断筛选内容
    sFn () {
      if (this.isEdit && this.asqIssueRptType === '3') {
        return [{
          key: 'all-data',
          text: '选全部',
          onSelect: (changableRowKeys) => {
            this.onSelectAll(changableRowKeys);
          },
        }];
      }
      if (this.isEdit && this.asqIssueRptType === '2') {
        return [{
          key: 'cur-data',
          text: '选本页',
          onSelect: (changableRowKeys) => {
            this.onSelectCurret(changableRowKeys);
          },
        }];
      }
      return [
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
        }];
    },
    // 表单
    getDialogSearch () {
      RANGE_TO_MAP_BY_FIELD(this.dialogForm, 'prodDate');
      RANGE_TO_MAP_BY_FIELD(this.dialogForm, 'warrantyBeginDate');
      this.pagination.current = 1;
      this.fetch(omitSearchFields({ ...this.dialogForm }));
    },
    dialogRest () {
      this.dialogForm.reset();
      this.pagination.current = 1;
      this.fetch();
    },
    /**
     * 表格
     */
    // 选本页
    onSelectCurret (data) {
      this.handAllFlag = false;
      this.rowSelection.selectedRowKeys = data;
      this.selectedKeys = data;
    },
    // 选全量
    onSelectAll () {
      if (this.pagination.total <= 5000) {
        this.handAllFlag = true;
        this.rowSelection.selectedRowKeys = this.keys;
        this.selectedKeys = this.keys;
        this.rowSelection.selectedRowKeys.length = this.pagination.total;
        this.$route.query.asqIssueRptType = '3';
      } else {
        this.$message.error('条数请少于5000条');
      }
    },
    fetch (config = {}) {
      this.loading = true;
      this
        .getVehicleSearchDialogPage({ ...config, ...this.serverPagination })
        .then(this.load)
        .finally(this.loading = false);
    },
    load (res) {
      this.list = res.list;
      this.keys = this.list.map((item) => item.vin);
      if (this.handAllFlag) {
        this.onSelectAll();
      }
      this.pagination.total = res.total;
    },
    tableChangeHandle () {
      if (!this.handAllFlag) {
        this.rowSelection.selectedRowKeys = [];
      }
      this.fetch(omitSearchFields({ ...this.dialogForm }));
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
          that.handAllFlag = false;
          that.$route.query.asqIssueRptType = '2';
        },
        onCancel () {
          that.rowSelection.selectedRowKeys = that.keys;
        },
      });
    },
    handleOk () {
      if (this.selectedKeys.length > 0) {
        this.$store.commit('issue/set', { selectedVehicleRowKeys: this.selectedKeys });
        this.$store.commit('issue/set', { isFlag: true });
      }
      this.$emit('update:visible', false);
      this.$emit('fn', this.handAllFlag);
      this.$set(this, 'selectedKeys', []);
      this.$store.commit('issue/set', { vehicleInforSearch: omitSearchFields({ ...this.dialogForm }) });
    },
    handleCancel () {
      this.$emit('update:visible', false);
      this.$set(this, 'selectedKeys', []);
    },
  },
};
</script>
<style lang="less" scoped>
  .vehicle-info-alert {
    margin-top: 12px;
  }
  .ant-table-wrapper {
    .table-container-fixed-defined(38px; 38px; 10; 16px);
    padding-top: 16px;
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 8px;
      margin-bottom: 4px;
    }
  }
</style>
