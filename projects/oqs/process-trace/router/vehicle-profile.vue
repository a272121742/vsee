<template>
  <div class="vehiclepr">
    <div class="form box mgb-0 mgt-0">
      <a-form
        :form="form"
        class="form-column-split-compact form-column-action-right"
        layout="vertical"
        self-update
      >
        <a-row :gutter="24">
          <!-- VIN -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.vin')">
              <a-input
                v-decorator="['vin']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

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
                @change="plantChange"
              />
            </a-form-item>
          </a-col>

          <!-- 车型 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('model')">
              <multiple-net-select
                v-decorator="['vhcl_model_list']"
                :max-tag-count="1"
                :placeholder="$t('form.select')"
                :url="`/oqs/sqlquery/queryData?code=filter_model&plant_id_list=${formRecord.plant_id_list || ''}`"
                value-by="id"
                :label-of="(item) => item.name"
                delay
                allow-clear
                show-search
                :cache="false"
              />
            </a-form-item>
          </a-col>

          <!-- 车型代码 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.vhcl_model_code')">
              <single-net-select
                v-decorator="['vhcl_model_code']"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/vehicle/modelAndCode"
                value-by="vhclModelCode"
                :label-of="(item) => item.vhclModelCode"
                delay
                allow-clear
                show-search
              />
            </a-form-item>
          </a-col>

          <!-- 订单号 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.sales_order_no')">
              <a-input
                v-decorator="['sales_order_no']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 总装下线时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.prod_date')">
              <a-range-picker
                v-decorator="['prod_date']"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              >
              </a-range-picker>
            </a-form-item>
          </a-col>

          <!-- 报交时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.out_stock_date')">
              <a-range-picker
                v-decorator="['out_stock_date']"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 物料编码 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('vehProfile.material_code')">
              <a-input
                v-decorator="['material_code']"
                :placeholder="$t('form.input')"
                allow-clear
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
        :data-source="list"
        :pagination="pagination"
        row-key="id"
        :scroll="{x:1500,y:426}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`vehProfile.${col.dataIndex}`) }}
            </span>
            <template slot-scope="text">
              <!-- @FIXME:vin跳转在过程质量关闭，可能在其他模块还要复用 -->
              <!-- <a-tooltip v-if="['vin'].includes(col.dataIndex)">
                <template #title>
                  {{ text }}
                </template>
                <a
                  href="javascript:;"
                  @click="handleVIN(row.vin)"
                >
                  {{ row[col.dataIndex] }}
                </a>
              </a-tooltip> -->
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
import { vehProfileColumns } from '~~/model/vehProfile.js';

const { project } = process.env;

const fileds = ['vin', 'vhcl_model_list', 'vhcl_model_code', 'plant_id_list', 'sales_order_no', 'material_code', 'prod_date', 'out_stock_date',
];

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),

  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix({ current: 'page', pageSize: 'limit' }),
    storeModuleMix({
      name: 'process-trace',
      action: ['getTableList', 'getExportData'],
    }),
  ],
  data () {
    return {
      columns: vehProfileColumns,
      selectedKeys: [],
      list: [],
      loading: false,
      filesKeys: [],
      filesValue: [],
      isShow: '',
      formRecord: {
        vin: null, // vin码 模糊
        sales_order_no: null,
        vhcl_model_list: null,
        vhcl_model_code: null,
        plant_id_list: null,
        prod_date_start: null,
        prod_date_end: null,
        out_stock_date_start: null,
        out_stock_date_end: null,
        material_code: null,
        out_stock_date: null,
        prod_date: null,
      },
      formItemSpan: 6,
    };
  },
  created () {
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
        className: 'VehicleExcel',
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
      this.getTableList(params).then(this.load).finally(this.reset);
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    // 表格分页器
    tableChangeHandle () {
      this.fetch();
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_model_list = null;
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate1 = this.formRecord.prod_date !== null && this.formRecord.prod_date.length > 0;
      const isDate2 = this.formRecord.out_stock_date !== null && this.formRecord.out_stock_date.length > 0;

      val.prod_date_start = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.prod_date[0]) : null;
      val.prod_date_end = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.prod_date[1]) : null;

      val.out_stock_date_start = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.out_stock_date[0]) : null;
      val.out_stock_date_end = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.out_stock_date[1]) : null;

      val.data_power = 'data_power_plant-plant_id_list';
      val.code = 'vehicle_query';
      return val;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
    /**
     *  @FIXME:跳转vin
     */
    handleVIN (vin) {
      window.open(this.$store.state.isDev ? `/process-trace/vehicledetail?vin=${vin}` : `/${project}/process-trace/vehicledetail?vin=${vin}`);
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
