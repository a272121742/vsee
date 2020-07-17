<template>
  <div
    class="vehiclepr"
    :class="{'href':!href}"
  >
    <!-- 筛选条件 -->
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
          <!-- vin -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('filling.vin')">
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

          <!-- 设备编号 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('filling.eqp_cd')">
              <a-input
                v-decorator="['filling_eqp_cd']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 作业时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('filling.operate_time')">
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

          <!-- 加注结果 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('filling.filling_result')">
              <multiple-net-select
                v-decorator="['filling_result_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_filling_result"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="1"
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
        :scroll="{x: 2600,y:426}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            v-if="href?!(col.dataIndex === 'vin' || col.dataIndex === 'vhcl_model'):true"
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`filling.${col.dataIndex}`) }}
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
import { fillingColumns } from '~~/model/filling.js';

const { project } = process.env;

const fileds = ['vin', 'vhcl_model_list', 'plant_id_list', 'filling_eqp_cd', 'filling_result_list', 'date'];

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix({ current: 'page', pageSize: 'limit' }),
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
      tableData: [],
      loading: false,
      columns: fillingColumns,
      formItemSpan: 6,
      formRecord: {
        vin: null,
        vhcl_model_list: null,
        plant_id_list: null,
        filling_eqp_cd: null,
        date: null,
        filling_time_start: null,
        filling_time_end: null,
        filling_result_list: null,
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
      this.pagination.reset();
      this.form.reset();
      this.$nextTick(() => this.fetch());
    },
    /**
     * 导出数据
     */
    exportHandle () {
      const params = this.filterParams(this.formRecord);
      this.getExportData({
        ...params,
        className: 'FillingExcel',
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
      this.getTableList(params).then((data) => {
        this.tableData = data.list;
        this.pagination.total = data.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 表单分页器
    tableChangeHandle () {
      this.fetch();
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.filling_time_start = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.filling_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;
      val.code = 'oqs_filling_query';
      val.data_power = 'data_power_plant-plant_id_list';
      return val;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_model_list = null;
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
