<template>
  <div
    class="vehiclepr"
    :class="{'href':!href}"
  >
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
            <a-form-item :label="$t('auditDefect.vin')">
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

          <!-- 车间 多选-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.workshop_nm')">
              <multiple-net-select
                v-decorator="['workshop_id_list']"
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

          <!-- 样车来源 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.sample_src')">
              <multiple-net-select
                v-decorator="['sample_src_list']"
                :placeholder="$t('form.select')"
                url="oqs/sqlquery/queryData?code=filter_audit_sample_src"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 审计日期 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.audit_date')">
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

          <!-- 审计部位  多选 模糊搜索-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.audit_pst')">
              <multiple-net-select
                v-decorator="['audit_pst_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_audit_pst"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="1"
              />
            </a-form-item>
          </a-col>

          <!-- 审计零件 多选 模糊搜索-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.part_nm')">
              <multiple-net-select
                v-decorator="['audit_part_id_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_audit_part_nm"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷等级 多选-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.defect_level')">
              <multiple-net-select
                v-decorator="['defect_level_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_defect_level"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
              />
            </a-form-item>
          </a-col>

          <!-- 责任部门 多选-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.rspns_dept_nm')">
              <multiple-net-select
                v-decorator="['rspns_dept_nm_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_rspns_dept_nm"
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
        :scroll="{x: 1800,y:426}"
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
              {{ $t(`auditDefect.${col.dataIndex}`) }}
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
import {
  GET_MOMENT, GET_DATETIME_FORMAT,
  GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import { auditDefectColumns } from '~~/model/auditDefect.js';

const { project } = process.env;
const fileds = ['vin', 'sample_src_list', 'vhcl_model_list', 'plant_id_list', 'date', 'defect_level_list', 'rspns_dept_nm_list', 'workshop_id_list', 'audit_pst_list', 'audit_part_id_list'];

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
      pagination: {},
      tableData: [],
      loading: false,
      columns: auditDefectColumns,
      formRecord: {
        vin: null,
        plant_id_list: null,
        vhcl_model_list: null,
        workshop_id_list: null,
        sample_src_list: null,
        date: null,
        defect_level_list: null,
        rspns_dept_nm_list: null,
        audit_pst_list: null,
        audit_part_id_list: null,
      },
      formItemSpan: 6,
    };
  },
  computed: {
    local () {
      return this.$store.state.local;
    },
  },
  activated () {
    if (window.location.href.indexOf('?') > 0 && this.$route.query.vin === undefined) {
      const TRQ = JSON.parse(JSON.stringify(this.$route.query));
      console.log('TRQ', TRQ);
      this.formRecord.date = TRQ.dateTimeStart !== 'null' ? [GET_MOMENT(TRQ.dateTimeStart), GET_MOMENT(TRQ.dateTimeEnd)] : null;
      this.formRecord.plant_id_list = TRQ.plant_id_list !== 'null' ? [+TRQ.plant_id_list] : null;
      this.formRecord.vhcl_model_list = TRQ.vhcl_model_list !== 'null' ? [TRQ.vhcl_model_list] : null;
      this.fetch();
      this.$router.push('/process-trace/audit-defect');
    }
  },
  created () {
    // if (JSON.stringify(this.$route.query) === '{}' || this.$route.query.vin !== undefined) {
    //   this.fetch();
    // }
  },
  methods: {
    // 查询
    searchHandle () {
      this.pagination.reset();
      this.fetch();
    },
    // 重置
    resetHandle () {
      this.formRecord = {
        vin: null,
        plant_id_list: null,
        vhcl_model_list: null,
        workshop_id_list: null,
        sample_src_list: null,
        date: null,
        defect_level_list: null,
        rspns_dept_nm_list: null,
        audit_pst_list: null,
        audit_part_id_list: null,
      };
      this.fetch();
    },
    //  导出
    exportHandle () {
      const params = this.filterParams(this.formRecord);
      this.getExportData({
        ...params,
        className: 'AuditDefectExcel',
        fileName: this.$route.meta.title,
      }).then();
    },
    // 渲染页面
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
    // 表格change
    tableChangeHandle () {
      this.fetch();
    },
    // 过滤时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.check_start_time_star = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.check_start_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;
      val.code = 'oqs_audit_query';
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
