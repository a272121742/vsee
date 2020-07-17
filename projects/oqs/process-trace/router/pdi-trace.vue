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
          <!-- VIN -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('pdiTra.vin')">
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

          <!-- 检查时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('pdiTra.inspt_time')">
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

          <!-- 故障系统 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('pdiTra.fault_system')">
              <multiple-net-select
                v-decorator="['fault_system_list']"
                :max-tag-count="1"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_pdi_fault_sys"
                value-by="id"
                :label-of="(item) => item.name"
                delay
                allow-clear
                show-search
              />
            </a-form-item>
          </a-col>

          <!-- 问题类别 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('pdiTra.problem_type')">
              <multiple-net-select
                v-decorator="['problem_type_list']"
                :max-tag-count="1"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_pdi_problem_type"
                value-by="id"
                :label-of="(item) => item.name"
                delay
                allow-clear
                show-search
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
              {{ $t(`pdiTra.${col.dataIndex}`) }}
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
  GET_MOMENT, GET_DATETIME_FORMAT, GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import { pditraColumns } from '~~/model/pdiTrace.js';

const { project } = process.env;
const fileds = ['vin', 'vhcl_model_list', 'date', 'plant_id_list', 'fault_system_list', 'problem_type_list'];


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
      columns: pditraColumns,
      list: [],
      loading: false,
      checkpoint_type: undefined,
      check_status_list: undefined,
      is_force_flg: undefined,
      shift: undefined,
      formRecord: {
        vin: null,
        vhcl_model_list: null, // vin码 模糊
        plant_id_list: null, // 总装序列号 模糊
        date: null,
        fault_system_list: null,
        problem_type_list: null,
        repair_info_list: null, // 跳转过来的参数
      },
      formItemSpan: 6,
    };
  },
  activated () {
    if (window.location.href.indexOf('?') > 0 && this.$route.query.vin === undefined) {
      const TRQ = JSON.parse(JSON.stringify(this.$route.query));
      console.log('TRQ', TRQ);
      this.formRecord.date = TRQ.dateTimeStart !== 'null' ? [GET_MOMENT(TRQ.dateTimeStart), GET_MOMENT(TRQ.dateTimeEnd)] : null;
      this.formRecord.plant_id_list = TRQ.plant_id_list !== 'null' ? [+TRQ.plant_id_list] : null;
      this.formRecord.vhcl_model_list = TRQ.vhcl_model_list !== 'null' ? [TRQ.vhcl_model_list] : null;

      // 判断是由pdiddr还是pdifdr跳转过来，参数不相同
      if (TRQ.IS_PDI_DDR === 'ddr') {
        this.formRecord.repair_info_list = TRQ.defect_status_list === '1' ? '合格' : null;
      } else {
        this.formRecord.repair_info_list = TRQ.defect_status_list === '1' ? ['确认合格', '让步接收'] : null;
      }
      this.fetch();
      this.$router.push('/process-trace/pdi-trace');
    }
  },
  created () {
    // if (JSON.stringify(this.$route.query) === '{}' || this.$route.query.vin !== undefined) {
    //   this.fetch();
    // }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandle);
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
        vhcl_model_list: null, // vin码 模糊
        plant_id_list: null, // 总装序列号 模糊
        date: null,
        fault_system_list: null,
        problem_type_list: null,
        repair_info_list: null, // 跳转过来的参数
      };
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
        className: 'PdiDtlExcel',
        fileName: this.$route.meta.title,
      }).then();
    },

    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(() => {
        this.loading = false;
      });
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
      this.formRecord.vhcl_model_list = null;
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.check_start_time_star = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.check_start_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;

      val.code = 'oqs_pdi_dtl_query';
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
