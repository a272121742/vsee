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
          <!-- vin -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('tp.vin')">
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

          <!-- 车间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.workshop_nm')">
              <multiple-net-select
                v-decorator="['workshop_cd_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_workshop"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 产线 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.prod_prodline_nm')">
              <a-input
                v-decorator="['prodline']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 设备厂商名称 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.mfr_nm')">
              <multiple-net-select
                v-decorator="['mfr_nm_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_mfr_nm"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 设备编码 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.eqp_cd')">
              <multiple-net-select
                v-decorator="['eqp_cd_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_eqp_cd"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 设备类型 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.eqp_type')">
              <multiple-net-select
                v-decorator="['eqp_type_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_eqp_type"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 版本号 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.vers_no')">
              <a-input
                v-decorator="['vers_no']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 生产年 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.prod_year')">
              <multiple-net-select
                v-decorator="['prod_year_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_prod_year"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 总测试结果 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.total_result')">
              <multiple-net-select
                v-decorator="['total_result_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_total_result"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 测试所用的release -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.inspt_rls')">
              <a-input
                v-decorator="['inspt_rls']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 测试结果 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.inspt_result')">
              <multiple-net-select
                v-decorator="['inspt_result_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_inspt_result"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 检查时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('isTest.inspt_time')">
              <a-range-picker
                v-decorator="['date']"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                :disabled-date="disabledDate"
                show-time
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
        :data-source="list"
        :pagination="pagination"
        row-key="id"
        :scroll="{x: 2100,y:426}"
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
              {{ $t(`isTest.${col.dataIndex}`) }}
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
import { GET_DATETIME_FORMAT, GET_MOMENT, GET_END_OF_DAY } from '@util/datetime-helper.js';
import { isTestColumns } from '~/common/model/isTest.js';


const { project } = process.env;
const fileds = ['vin', 'vhcl_model_list', 'date', 'plant_id_list', 'workshop_cd_list', 'prodline', 'mfr_nm_list', 'eqp_cd_list', 'eqp_type_list', 'vers_no', 'prod_year_list', 'total_result_list', 'inspt_rls', 'inspt_result_list'];


export default {
  components: {
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
      columns: isTestColumns,
      showDialog: false,
      selectedKeys: [],
      list: [],
      loading: false,
      filesKeys: [],
      filesValue: [],
      isShow: '',
      formRecord: {
        vin: null,
        plant_id_list: null, // 工厂
        vhcl_model_list: null, // 车型
        workshop_cd_list: null, // 车间
        prodline: null,
        mfr_nm_list: null, // 设备厂商名称
        eqp_cd_list: null, // 设备编码
        eqp_type_list: null,
        vers_no: null,
        prod_year_list: null,
        total_result_list: null,
        inspt_rls: null,
        inspt_result_list: null,
        date: null,
      },
      formItemSpan: 6,
    };
  },
  created () {
    // this.formRecord.vin = this.$route.query.vin || null;
    // this.fetch();
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandle);
  },
  methods: {
    /**
     * 查询
     */
    searchHandle () {
      this.pagination.current = 1;
      this.fetch();
    },
    /**
     * 重置
     */
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
        className: 'IsTestExcel',
        fileName: this.$route.meta.title,
      }).then();
    },
    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    tableChangeHandle () {
      this.fetch();
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_year_name = null;
    },
    // 参数
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.inspt_time_start = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.inspt_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;
      val.code = 'oqs_is_test_query';
      val.data_power = 'data_power_plant-plant_id_list';
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
