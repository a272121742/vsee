<template>
  <div
    class="vehiclepr"
    :class="{'href':!href}"
  >
    <div
      v-show="!href"
      class="form box mgb-0 mgt-0"
    >
      <a-form
        :form="form"
        class="form-column-split-compact form-column-action-right"
        layout="vertical"
        self-update
      >
        <a-row :gutter="24">
          <!-- 工厂 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('plant')">
              <multiple-net-select
                v-decorator="['plant_id_list']"
                :max-tag-count="1"
                url="/oqs/sqlquery/queryData?code=filter_plant&data_power=data_power_plant-plant_id_list"
                :placeholder="$t('form.select')"
                value-by="id"
                :label-of="(item) => item.name"
                delay
                allow-clear
                show-search
              />
            </a-form-item>
          </a-col>

          <!-- 零件代码  -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('tp.part_cd')">
              <net-auto-complete
                v-decorator="['part_cd']"
                :placeholder="$t('form.select')"
                url="masterdata/v1/part/partList"
                value-by="code"
                :label-of="(item) => item.code"
                allow-clear
                search-by="code"
              />
            </a-form-item>
          </a-col>

          <!-- 零件名称 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('tp.part_name')">
              <net-auto-complete
                v-decorator="['part_nm']"
                :placeholder="$t('form.select')"
                url="masterdata/v1/part/partList"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                search-by="name"
              />
            </a-form-item>
          </a-col>

          <!-- 供应商代码 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('tp.supplier_cd')">
              <net-auto-complete
                v-decorator="['supplier_cd']"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/supplier/supplierList"
                value-by="supplierCode"
                :label-of="(item) => item.supplierCode"
                allow-clear
                search-by="code"
              />
            </a-form-item>
          </a-col>

          <!-- 供应商名称-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('tp.supplier_name')">
              <net-auto-complete
                v-decorator="['supplierName']"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/supplier/supplierList"
                value-by="supplierName"
                :label-of="(item) => item.supplierName"
                allow-clear
                search-by="name"
              />
            </a-form-item>
          </a-col>

          <!-- 仓库 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('bpt.warehouse_nm')">
              <multiple-net-select
                v-decorator="['warehouse_cd_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_warehouse"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 库区 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('bpt.dloc_nm')">
              <multiple-net-select
                v-decorator="['dloc_cd_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_dloc"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 批次 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('bpt.batch_no')">
              <a-input
                v-decorator="['batch_no']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 出库时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('bpt.outbound_time')">
              <a-range-picker
                v-decorator="['date']"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 查询 + 重置 + 导出 -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <a-button
              type="primary"
              @click="searchHandle"
            >
              {{ $t('action.find') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="resetHandle"
            >
              {{ $t('action.reset') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="exportHandle"
            >
              {{ $t('action.export') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格 -->
    <div class="box">
      <a-table
        class="table-cell-ellipsis"
        :data-source="tableData"
        :pagination="pagination"
        row-key="id"
        :scroll="{x: 900,y:426}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            v-if="href?!(col.dataIndex === 'vin'|| col.dataIndex === 'vhcl_model'):true"
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`bpt.${col.dataIndex}`) }}
            </span>
            <template slot-scope="text">
              <a-tooltip>
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
  </div>
</template>
<script>
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import formRecordMix from '@mix/form-record-mix.js';
import { GET_DATETIME_FORMAT, GET_END_OF_DAY, GET_MOMENT } from '@util/datetime-helper.js';
import { batchPartTraceColumns } from '~~/model/batchPartTrace.js';

const { project } = process.env;

const fileds = ['plant_id_list', 'part_cd', 'part_nm', 'supplierName', 'supplier_cd', 'warehouse_cd_list', 'dloc_cd_list', 'batch_no', 'date'];

export default {
  components: {
    NetAutoComplete: () => import('@comp/form/NetAutoComplete.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix(),
    storeModuleMix({
      name: 'process-trace',
      action: ['getTableList', 'getExportData'],
    }),
  ],
  props: {
    href: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showDialog: false,
      pagination: {},
      selectedKeys: [],
      tableData: [],
      loading: false,
      filesKeys: [],
      filesValue: [],
      columns: batchPartTraceColumns,
      isShow: '',
      formItemSpan: 6,
      formRecord: {
        plant_id_list: null,
        part_cd: null,
        part_nm: null,
        supplierName: null,
        supplier_cd: null,
        warehouse_cd_list: null,
        dloc_cd_list: null,
        date: null,
        batch_no: null,
      },
    };
  },
  created () {
    // this.formRecord.vin = this.$route.query.vin || null;
    // this.fetch();
  },
  methods: {
    // 查询
    searchHandle () {
      this.pagination.reset();
      this.fetch();
    },
    // 重置
    resetHandle () {
      this.form.reset();
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.fetch();
      });
    },
    /**
     * 导出数据
     */
    exportHandle () {
      const params = this.filterParams(this.formRecord);
      this.getExportData({
        ...params,
        className: 'BatchPartOutExcle',
        fileName: this.$route.meta.title,
      }).then();
    },
    /**
     * 表格渲染
     */
    fetch () {
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      params.page = this.pagination.current;
      params.limit = this.pagination.pageSize;
      params.part_barcd = params.part_barcd ? `%${params.part_barcd}%` : null;
      this.getTableList(params).then((data) => {
        this.tableData = data.list;
        this.pagination.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    tableChangeHandle () {
      this.fetch();
    },
    /**
     * 跳转vin
     */
    handleVIN (vin) {
      window.open(this.$store.state.isDev ? `/process-trace/vehicledetail?vin=${vin}` : `/${project}/process-trace/vehicledetail?vin=${vin}`);
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.outbound_time_start = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.outbound_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;

      val.code = 'oqs_batch_part_out';
      val.data_power = 'data_power_plant-plant_id_list';
      return val;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },

  },
};
</script>

<style lang="less" scoped>
.vehiclepr {
  display: flex;
  flex-direction: column;

  .ant-table-wrapper {
    .table-container-fixed-defined(46px; 41px;);
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 16px;
      margin-bottom: 4px;
    }
    /deep/.ant-table-scroll .ant-table-body {
     min-height: 410px;
   }
  }
}
</style>
