<template>
  <div
    class="dr"
  >
    <!-- 搜索框 -->
    <div class="form box mgb-0 mgt-0">
      <a-form
        class="form-column-split-compact form-column-action-right"
        :form="form"
        layout="vertical"
        self-update
      >
        <a-row :gutter="24">
          <!-- DR 工厂 -->
          <a-col :span="formItemSpan">
            <a-form-item
              :label="$t('plant')"
            >
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

          <!-- DR : 车型  -->
          <a-col :span="formItemSpan">
            <a-form-item
              :label="$t('model')"
            >
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

          <!-- DR：日期 -->
          <a-col :span="formItemSpan">
            <a-form-item
              :label="$t('date')"
            >
              <a-range-picker
                v-decorator="['date']"
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 查询  -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <!-- 查询 -->
            <a-button
              type="primary"
              :loading="spinning1 || spinning2 || loading"
              @click="query"
            >
              {{ $t('action.find') }}
            </a-button>
            <!-- 重置 -->
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="spinning1 || spinning2 || loading"
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
      style="height: 702px"
    >
      <!-- 天 周 月 年 -->
      <a-row
        type="flex"
        justify="center"
      >
        <a-col
          :span="7"
        >
          <a-radio-group
            v-model="dateCode"
            @change="query"
          >
            <a-radio-button
              value="day"
              :disabled="spinning1 || spinning2"
            >
              {{ $t('day') }}
            </a-radio-button>
            <a-radio-button
              value="week"
              :disabled="spinning1 || spinning2"
            >
              {{ $t('week') }}
            </a-radio-button>
            <a-radio-button
              value="month"
              :disabled="spinning1 || spinning2"
            >
              {{ $t('month') }}
            </a-radio-button>
            <a-radio-button
              value="year"
              :disabled="spinning1 || spinning2"
            >
              {{ $t('year') }}
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-spin
        :spinning="spinning1"
      >
        <!-- DR + echarts表格数据 -->
        <dr-graph
          :params="echartsParamsDR"
          :legend-arr.sync="legendArr"
          :station-id="station_id"
          @spingFn="eSpingFn1"
        />
      </a-spin>
      <a-spin
        :spinning="spinning2"
      >
        <!-- FTQ + echarts表格数据 -->
        <ftq-graph
          :params="echartsParamsFTQ"
          :legend-arr.sync="legendArr"
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
      :scroll="{y:410}"
      row-key="id"
      :loading="loading"
      :style="{wordBreak: 'break-all'}"
      @change="handleTableChange"
    >
      <template v-for="(col,index) in columns">
        <a-table-column
          :key="index"
          v-bind="col"
        >
          <span slot="title">
            {{ $t(`dr.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text ,row">
            <!-- 缺陷数 -->
            <a-tooltip v-if="['nmrtr_value'].includes(col.dataIndex)">
              <template #title>
                {{ text }}
              </template>
              <a
                style="text-decoration:underline"
                href="javascript:;"
                @click="handleNoOK(row,isDefect=true)"
              >
                {{ text }}
              </a>
            </a-tooltip>

            <!-- 过站车辆数 -->
            <a-tooltip v-else-if="['dnmtr_value'].includes(col.dataIndex)">
              <template #title>
                {{ text }}
              </template>
              <a
                style="text-decoration:underline"
                href="javascript:;"
                @click="handleNoOK(row,isDefect=false)"
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
import formRecordMix from '@mix/form-record-mix.js';
import paginationMix from '@mix/pagination.js';
import storeModuleMix from '@mix/store-module.js';
import {
  DAY_RANGE, YEAR_WEEK_RANGE, MONTH_RANGE, YEAR_RANGE,
  GET_MOMENT, RANGE_TO_MAP_BY_FIELD, GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import { drColumns } from '~~/model/analyze.js';

const fileds = ['plant_id_list', 'vhcl_model_list', 'date'];

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    DrGraph: () => import('../view/dr-graph-dr.vue'),
    FtqGraph: () => import('../view/dr-graph-ftq.vue'),
  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix(),
    storeModuleMix({
      name: 'process-analysis',
      action: ['getTablePage'],
    }),
  ],
  data () {
    return {
      tableData: [],
      pagination: {},
      loading: false,
      spinning1: false,
      spinning2: false,
      dateCode: 'day',
      columns: drColumns,
      echartsParamsDR: {},
      echartsParamsFTQ: {},
      legendArr: [],
      formItemSpan: 6,
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      station_id: '1',
      formRecord: {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
      },
      isDefect: false,
    };
  },
  activated () {
    // 看板跳转过来的
    if (window.location.href.indexOf('?') > 0) {
      const TRQ = this.$route.query;
      this.formRecord.check_start_time_star = TRQ.check_start_time_star !== null ? TRQ.check_start_time_star : null;
      this.formRecord.check_start_time_end = TRQ.check_start_time_end !== null ? TRQ.check_start_time_end : null;
      this.formRecord.date = TRQ.check_start_time_star !== null ? [GET_MOMENT(TRQ.check_start_time_star), GET_MOMENT(TRQ.check_start_time_end)] : [];
      this.formRecord.vhcl_model_list = TRQ.vhcl_year_name_list !== null ? [TRQ.vhcl_year_name_list] : null;
      this.formRecord.plant_id_list = TRQ.plant_id_list !== null ? [+TRQ.plant_id_list] : null;
      this.query();
      this.$router.push('/process-analysis/dr');
    }
  },
  created () {
    if (window.location.href.indexOf('?') <= 0) {
      this.formRecord = {
        date: null,
        vhcl_model_list: null,
        plant_id_list: null,
      };
      this.formRecord.date = [GET_MOMENT(new Date()).add(-1, 'months'), GET_MOMENT(new Date())];
      this.query();
    }
  },
  methods: {
    // 图表的loading
    eSpingFn1 (data) {
      this.spinning1 = data;
    },
    eSpingFn2 (data) {
      this.spinning2 = data;
    },
    // 表格渲染
    query () {
      const params = this.requestParams();
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.requestTable(params);

      // 渲染DR echarts表格
      this.legendArr = [];
      this.echartsParamsDR = this.requestParams();
      this.echartsParamsDR.dateCode = this.dateCode;
      const drParams = { ...this.echartsParamsDR };
      this.$store.commit('process-analysis/set', { drParams });

      // 渲染 FTQ  echarts表格
      this.echartsParamsFTQ = this.requestParams();
      this.echartsParamsFTQ.code = `oqs_dr_ftq_l1_${this.dateCode}`;
      this.echartsParamsFTQ.station_id = this.station_id;
      this.echartsParamsFTQ.dateCode = this.dateCode;
      const drParamsFTQ = { ...this.echartsParamsFTQ };
      this.$store.commit('process-analysis/set', { drParamsFTQ });
    },
    // 参数
    requestParams () {
      const params = this.filterParams(this.formRecord);
      params.vhcl_model_list || (params.vhcl_model_list = null);
      params.plant_id_list || (params.plant_id_list = null);
      params.check_start_time_star || (params.check_start_time_star = null);
      params.check_start_time_end || (params.check_start_time_end = null);
      // 图表的code
      params.code = `oqs_dr_l1_${this.dateCode}`;
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
      params.code = `oqs_dr_l1_${this.dateCode}_list`;
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
    // 点击跳转到缺陷
    handleNoOK (row) {
      const params = {
        vhcl_model_list: row.vhcl_model || 'null',
        plant_id_list: row.plant_id || 'null',
        gate_cd_list: row.gate_cd || 'null',
        defect_status_list: this.isDefect ? '1' : 'null',
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

      console.log('params', params);
      this.$router.push({
        path: '/process-trace/online-defect',
        query: params,
      });
    },
    // 工厂车型联动
    plantChange () {
      console.log('plant_id_list', this.formRecord.plant_id_list);
      this.formRecord.vhcl_model_list = '';
    },
    // 重置
    resetHandle () {
      this.formRecord = {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
      };
      this.$nextTick(() => {
        this.query();
      });
    },
    // 单选框
    onChange (e) {
      this.station_id = e.target.value;
      this.echartsParamsFTQ = this.requestParams();
      this.echartsParamsFTQ.code = `oqs_dr_ftq_l1_${this.dateCode}`;
      this.echartsParamsFTQ.station_id = e.target.value;
      this.echartsParamsFTQ.dateCode = this.dateCode;
      const drParamsFTQ = { ...this.echartsParamsFTQ };
      this.$store.commit('process-analysis/set', { drParamsFTQ });
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
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
  },
};
</script>

<style lang="less" scoped>
.dr{
  position: relative;
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
  /deep/ .ant-row-flex-center{
    margin-bottom: 15px;
  }
  .ant-col-7{
    text-align: center;
  }
  .radio{
    position: absolute;
    top: 30px;
    left: 0;
}
}

</style>
