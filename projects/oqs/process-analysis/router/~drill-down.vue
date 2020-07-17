<template>
  <div class="drill-downn">
    <div class="form box mgb-0 mgt-0">
      <a-form
        class="form-column-split-compact form-column-action-right"
        :form="form"
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

          <!-- 日期 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('date')">
              <a-range-picker
                v-decorator="['date']"
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 车间 -->
          <a-col
            v-if="IS_FTQ"
            :span="formItemSpan"
          >
            <a-form-item
              :label="$t('ftq.ftq_workshop_nm')"
            >
              <single-net-select
                v-decorator="['ftq_workshop_cd']"
                url="/oqs/sqlquery/queryData?code=filter_ftq_workshop"
                :placeholder="$t('form.select')"
                value-by="code"
                :label-of="(item)=>item.name"
                allow-clear
                show-search
                delay
              />
            </a-form-item>
          </a-col>

          <!-- 查询 + 重置 -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <a-button
              type="primary"
              :loading="spinning1 || loading"
              @click="query"
            >
              {{ $t('action.find') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="spinning1 || loading"
              @click="resetHandle"
            >
              {{ $t('action.reset') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 报表 -->
    <div
      class="box mgb-0 pdb-0"
    >
      <!-- 天 周 月 年 -->
      <a-row
        type="flex"
        justify="center"
      >
        <a-col :span="7">
          <a-radio-group
            v-model="dateCode"
            @change="query"
          >
            <a-radio-button
              value="day"
              :disabled="spinning1"
            >
              {{ $t('day') }}
            </a-radio-button>
            <a-radio-button
              value="week"
              :disabled="spinning1"
            >
              {{ $t('week') }}
            </a-radio-button>
            <a-radio-button
              value="month"
              :disabled="spinning1"
            >
              {{ $t('month') }}
            </a-radio-button>
            <a-radio-button
              value="year"
              :disabled="spinning1"
            >
              {{ $t('year') }}
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <!-- drillDownGraph + echarts表格数据 -->
      <a-spin
        :spinning="spinning1"
        class="drillSpin"
      >
        <drill-down-graph
          v-if="IS_DR || IS_FTQ || IS_PDIDDR"
          :params="echartsLineParams"
          @spingFn="eSpingFn1"
        />
        <drill-down-graph-int
          v-else
          :params="echartsLineParams"
          @spingFn="eSpingFn1"
        />
      </a-spin>

      <!-- drillDownGraphFTQ + echarts表格数据 -->
      <a-spin
        v-if="IS_DR"
        :spinning="spinning2"
        class="drillSpin"
      >
        <drill-down-graph-ftq
          :params="echartsLineParamsFTQ"
          @spingFn="eSpingFn2"
        />
        <div class="radio">
          <a-radio-group
            v-model="station_id"
            @change="onChange"
          >
            <a-radio
              :style="radioStyle"
              value="1"
            >
              {{ $t('finalInstall') }}
            </a-radio>
            <a-radio
              :style="radioStyle"
              value="2"
            >
              {{ $t('rain') }}
            </a-radio>
            <a-radio
              :style="radioStyle"
              value="3"
            >
              {{ $t('roadTest') }}
            </a-radio>
            <a-radio
              :style="radioStyle"
              value="4"
            >
              {{ $t('testing') }}
            </a-radio>
          </a-radio-group>
        </div>
      </a-spin>
    </div>

    <!-- 表格 -->
    <a-table
      class="box table-cell-ellipsis"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{y:426}"
      row-key="id"
      :loading="loading"
      @change="handleTableChange"
    >
      <template v-for="(col,index) in columns">
        <a-table-column
          :key="index"
          v-bind="col"
        >
          <span slot="title">
            {{ $t(`${colGlobal}.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text ,row">
            <a-tooltip v-if="['nmrtr_value'].includes(col.dataIndex)">
              <template #title>
                {{ text }}
              </template>
              <a
                style="text-decoration:underline"
                href="javascript:;"
                @click="handleFn(row,isDefect=true)"
              >
                {{ text }}
              </a>
            </a-tooltip>
            <a-tooltip v-else-if="['dnmtr_value'].includes(col.dataIndex)">
              <template #title>
                {{ text }}
              </template>
              <a
                style="text-decoration:underline"
                href="javascript:;"
                @click="handleFn(row,isDefect=false)"
              >
                {{ text }}
              </a>
            </a-tooltip>
            <a-tooltip v-else>
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
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import formRecordMix from '@mix/form-record-mix.js';
import {
  DAY_RANGE, YEAR_WEEK_RANGE, MONTH_RANGE, YEAR_RANGE,
  GET_MOMENT, RANGE_TO_MAP_BY_FIELD, GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import qs from 'qs';
import {
  drColumns, drlColumns, ftqColumns, auditColumns, pdiDdrColumns, pdiFdrColumns,
} from '~~/model/analyze.js';


const { project } = process.env;
const fileds = ['plant_id_list', 'vhcl_model_list', 'date', 'ftq_workshop_cd'];


export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    DrillDownGraph: () => import('../view/drill-down-graph.vue'),
    DrillDownGraphInt: () => import('../view/drill-down-graph-int.vue'),
    DrillDownGraphFtq: () => import('../view/drill-down-graph-ftq.vue'),
  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix(),
    storeModuleMix({
      name: 'process-analysis',
      action: ['getTablePage', 'getSrcGateList'],
    }),
  ],
  data () {
    return {
      formItemSpan: 6,
      spinning1: false,
      spinning2: false,
      tableData: [],
      pagination: {},
      dateCode: 'day',
      loading: false,
      columns: drColumns,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      station_id: '1',
      echartsLineParams: {},
      echartsLineParamsFTQ: {},
      IS_DR: false,
      IS_FTQ: false,
      IS_PDIDDR: false,
      DRILL_TYPE: '',
      colGlobal: 'dr',
      urlCode: 'online-defect',
      urlParams: {},
      isDefect: false,
      IS_PDI_DDR: 'ddr', // 用来判断pdi入库直行率 及 pdi  缺陷数的参数的
      formRecord: {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
        ftq_workshop_cd: null,
      },
    };
  },
  created () {
    this.$store.commit('setConfig', { menu_type: false });
    this.$store.commit('setConfig', { content_head: false });
    const TRQ = JSON.parse(JSON.stringify(this.$route.query));
    console.log('TRQ', TRQ);
    this.form.set({
      plant_id_list: TRQ.plant_id_list !== 'null' ? [+TRQ.plant_id_list] : null,
      vhcl_model_list: TRQ.vhcl_model_list !== 'null' ? [TRQ.vhcl_model_list] : null,
      date: TRQ.check_start_time_star !== 'null' ? [GET_MOMENT(TRQ.check_start_time_star), GET_MOMENT(TRQ.check_start_time_end)] : [],
      ftq_workshop_cd: TRQ.ftq_workshop_cd !== 'null' ? TRQ.ftq_workshop_cd : null,

    }, true);
    console.log('内容', this.formRecord);

    // 是否显示第二个echarts表格
    this.IS_DR = TRQ.DRILL_TYPE === 'oqs_dr_l1' && TRQ.IS_DR;
    this.IS_FTQ = TRQ.DRILL_TYPE === 'oqs_ftq_l2';
    // pdi入库直行率是百分比 「IS_PDIDDR」用来显示百分比那个组件的
    this.IS_PDIDDR = TRQ.DRILL_TYPE === 'oqs_pdi_ddr_l1';

    // 是否显示车间下拉框
    // this.IS_FTQ = TRQ.DRILL_TYPE === 'oqs_ftq_l2' && TRQ.IS_DR;

    // 渲染不同的 code
    this.DRILL_TYPE = TRQ.DRILL_TYPE;

    // 表格渲染 columns 、 国际化 、点击跳转
    if (TRQ.DRILL_TYPE.startsWith('oqs_dr_l1')) {
      this.urlCode = 'online-defect';
      this.columns = drColumns;
      this.colGlobal = 'dr';
    } else if (TRQ.DRILL_TYPE.startsWith('oqs_drl_l1')) {
      this.urlCode = 'online-defect';
      this.columns = drlColumns;
      this.colGlobal = 'drl';
    } else if (TRQ.DRILL_TYPE.startsWith('oqs_audit_l1')) {
      this.urlCode = 'audit-defect';
      this.columns = auditColumns;
      this.colGlobal = 'audit';
    } else if (TRQ.DRILL_TYPE.startsWith('oqs_pdi_fdr_l1')) {
      this.IS_PDI_DDR = 'dfr';
      this.urlCode = 'pdi-trace';
      this.columns = pdiFdrColumns;
      this.colGlobal = 'pdiFdr';
    } else if (TRQ.DRILL_TYPE.startsWith('oqs_pdi_ddr_l1')) {
      this.IS_PDI_DDR = 'ddr';
      this.urlCode = 'pdi-trace';
      this.columns = pdiDdrColumns;
      this.colGlobal = 'pdiDdr';
    } else {
      this.urlCode = 'online-defect';
      this.columns = ftqColumns;
      this.colGlobal = 'ftq';
    }
    // dr 页面点击下  FTQ 单选
    this.station_id = TRQ.stationId;

    // 年 月 周 日
    this.dateCode = TRQ.dateCode;

    this.query();
  },
  methods: {
    // 图表的loading
    eSpingFn1 (data) {
      this.spinning1 = data;
    },
    eSpingFn2 (data) {
      this.spinning2 = data;
    },
    query () {
      // 表格渲染
      const params = this.requestParams();
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.requestTable(params);

      // 渲染 DR 折线图
      this.echartsLineParams = this.requestParams();
      const lineParams = { ...this.echartsLineParams };
      this.$store.commit('process-analysis/set', { lineParams });

      // 渲染 FTQ  折线图
      this.echartsLineParamsFTQ = this.requestParams();
      this.echartsLineParamsFTQ.code = `oqs_dr_ftq_l1_${this.dateCode}`;
      this.echartsLineParamsFTQ.station_id = this.station_id;
      const ftqLineParams = { ...this.echartsLineParamsFTQ };
      this.$store.commit('process-analysis/set', { ftqLineParams });
    },
    // 参数
    requestParams () {
      const params = this.filterParams(this.formRecord);
      params.vhcl_model_list || (params.vhcl_model_list = null);
      params.plant_id_list || (params.plant_id_list = null);
      params.ftq_workshop_cd || (params.ftq_workshop_cd = null);
      params.check_start_time_star || (params.check_start_time_star = null);
      params.check_start_time_end || (params.check_start_time_end = null);
      // 图表的code
      params.code = `${this.DRILL_TYPE}_${this.dateCode}`;
      // 工厂权限
      params.data_power = 'data_power_plant-plant_id_list';
      return params;
    },
    // 表格
    async requestTable (request) {
      // 请求表格
      const params = JSON.parse(JSON.stringify(request));
      params.page = this.pagination.current;
      params.limit = this.pagination.pageSize;
      params.code = `${this.DRILL_TYPE}_${this.dateCode}_list`;
      this.loading = true;
      const tableData = await this.getTablePage(params)
        .then((data) => data)
        .catch(() => {
          this.$message.error(`error-${this.$t('info.table-data-error')}`);
          return false;
        });
      this.loading = false;
      if (tableData === false) {
        return;
      }
      this.tableData = tableData.list.filter(((item) => {
        if (item.percentage !== 0) {
          if (item.percentage === 1) {
            item.percentage = '100%';
          } else {
            item.percentage = `${Math.round(item.percentage * 100)}%`;
          }
        }
        if (item.target !== 0) {
          if (item.target === 1) {
            item.target = '100%';
          } else {
            item.target = `${`${(item.target - 0).toFixed(2)}`.substr(-2, 2)}%`;
          }
        }
        return item;
      }));
      this.pagination.total = tableData.total;
    },
    handleTableChange () {
      const params = this.requestParams();
      this.requestTable(params);
    },
    // 点击跳转到对应页面
    handleFn (row) {
      this.getSrcGateList({ ftq_workshop_cd: row.ftq_workshop_cd || null }).then((res) => {
        const params = {
          vhcl_model_list: row.vhcl_model || 'null',
          plant_id_list: row.plant_id || 'null',
          gate_cd_list: row.gate_cd || 'null',
          ftq_workshop_cd: row.ftq_workshop_cd || 'null',
          defect_status_list: this.isDefect ? '1' : 'null',
          IS_PDI_DDR: this.IS_PDI_DDR,
        };
        if (row.date_id && this.dateCode === 'day') {
          params.dateTimeStart = DAY_RANGE(row.date_id)[0];
          params.dateTimeEnd = DAY_RANGE(row.date_id)[1];
        } else if (row.date_id && this.dateCode === 'week') {
          params.dateTimeStart = YEAR_WEEK_RANGE(row.date_id)[0];
          params.dateTimeEnd = YEAR_WEEK_RANGE(row.date_id)[1];
        } else if (row.date_id && this.dateCode === 'month') {
          params.dateTimeStart = MONTH_RANGE(row.date_id)[0];
          params.dateTimeEnd = MONTH_RANGE(row.date_id)[1];
        } else if (row.date_id && this.dateCode === 'year') {
          params.dateTimeStart = YEAR_RANGE(row.date_id)[0];
          params.dateTimeEnd = YEAR_RANGE(row.date_id)[1];
        } else {
          params.dateTimeStart = 'null';
          params.dateTimeEnd = 'null';
        }
        // 根据车间拿到源质量门 只有 ftq跳过来 才可以进行进行遍历其他直接设为null
        if (this.IS_FTQ) {
          params.src_gate_cd_list = res !== null ? res.map((item) => item.id) : 'null';
        } else {
          params.src_gate_cd_list = 'null';
        }
        // 拼接参数
        const queryStr = qs.stringify(params);
        window.open(
          this.$store.state.isDev ? `/process-trace/${this.urlCode}?${queryStr}` : `/${project}/process-trace/${this.urlCode}?${queryStr}`,
        );
      });
    },
    // 重置
    resetHandle () {
      this.formRecord = {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
        ftq_workshop_cd: null,
      };
      this.$nextTick(() => {
        this.query();
      });
    },
    // 时间处理
    filterParams (params) {
      RANGE_TO_MAP_BY_FIELD(this.formRecord, 'date');
      const val = JSON.parse(JSON.stringify(params));
      val.check_start_time_star = this.formRecord.dateStart || null;
      val.check_start_time_end = this.formRecord.dateEnd || null;
      delete val.dateStart;
      delete val.dateEnd;
      return val;
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_model_list = null;
    },
    // 单选框
    onChange (e) {
      // 渲染 FTQ  折线图
      this.echartsLineParamsFTQ = this.requestParams();
      this.echartsLineParamsFTQ.code = `oqs_dr_ftq_l1_${this.dateCode}`;
      const ftqLineParams = { ...this.echartsLineParamsFTQ };
      ftqLineParams.station_id = e.target.value;
      this.$store.commit('process-analysis/set', { ftqLineParams });
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
  },
};
</script>

<style lang="less" scoped>
.drill-downn {
  position: relative;
  display: flex;
  flex-direction: column;

  /deep/ .ant-row-flex-center{
    margin-bottom: 15px;
  }
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
  .ant-col-7 {
    text-align: center;
  }
  .radio {
    position: absolute;
    top: 35px;
    left: 0;
  }
  .drillSpin{
    /deep/ .ant-spin-dot-spin{
      top: calc(10vh + 2*0px);
    }
  }
}
</style>
