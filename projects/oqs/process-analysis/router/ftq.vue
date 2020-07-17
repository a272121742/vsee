<template>
  <div
    class="ftq"
  >
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

          <!-- 车型 -->
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

          <!-- 日期 -->
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

          <!-- 车间 -->
          <a-col :span="formItemSpan">
            <a-form-item
              :label="$t('ftq.ftq_workshop_nm')"
            >
              <single-net-select
                v-decorator="['ftq_workshop_cd']"
                url="/oqs/sqlquery/queryData?code=filter_ftq_workshop"
                :placeholder="$t('form.select')"
                value-by="id"
                :label-of="(item)=>item.name"
                allow-clear
                show-search
                delay
              />
            </a-form-item>
          </a-col>

          <!-- 按钮  -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <!-- 查询 -->
            <a-button
              type="primary"
              :loading="spinning || loading"
              @click="query"
            >
              {{ $t('action.find') }}
            </a-button>
            <!-- 重置 -->
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="spinning || loading"
              @click="resetHandle"
            >
              {{ $t('action.reset') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 图表 -->
    <a-spin
      :spinning="spinning"
      class="box mgb-0 pdb-0"
      style="height: 375px"
    >
      <!-- 天 周 月 年 -->
      <a-row
        type="flex"
        justify="center"
        class="fff"
      >
        <a-col :span="7">
          <a-radio-group
            v-model="dateCode"
            @change="query"
          >
            <a-radio-button
              value="day"
              :disabled="spinning"
            >
              {{ $t('day') }}
            </a-radio-button>
            <a-radio-button
              value="week"
              :disabled="spinning"
            >
              {{ $t('week') }}
            </a-radio-button>
            <a-radio-button
              value="month"
              :disabled="spinning"
            >
              {{ $t('month') }}
            </a-radio-button>
            <a-radio-button
              value="year"
              :disabled="spinning"
            >
              {{ $t('year') }}
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <!-- echarts图表 -->
      <ftq-graph
        :params="echartsParams"
        :legend-arr.sync="legendArr"
        @spingFn="eSpingFn"
      />
    </a-spin>

    <!-- 表格 -->
    <a-table
      class="box table-cell-ellipsis"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{y:410}"
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
            {{ $t(`ftq.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text,row">
            <!-- 缺陷数  -->
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

            <!-- 过站车辆数-->
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
import { ftqColumns } from '~~/model/analyze.js';

const fileds = ['plant_id_list', 'vhcl_model_list', 'date', 'ftq_workshop_cd'];

export default {
  name: 'FTP',
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    FtqGraph: () => import('../view/ftq-graph.vue'),
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
      tableData: [],
      pagination: {},
      spinning: false,
      dateCode: 'day',
      loading: false,
      columns: ftqColumns,
      echartsParams: {},
      legendArr: [],
      formItemSpan: 6,
      formRecord: {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
        ftq_workshop_cd: null,
      },
      isDefect: false,
    };
  },
  created () {
    this.formRecord.date = [GET_MOMENT(new Date()).add(-1, 'months'), GET_MOMENT(new Date())];
    this.query();
  },
  methods: {
    // 图表的loading
    eSpingFn (data) {
      this.spinning = data;
    },
    query () {
      // 表格渲染
      const params = this.requestParams();
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.requestTable(params);
      // 图表渲染
      this.legendArr = [];
      this.echartsParams = this.requestParams();
      this.echartsParams.dateCode = this.dateCode;
      const ftqParams = { ...this.echartsParams };
      this.$store.commit('process-analysis/set', { ftqParams });
    },
    // 参数
    requestParams () {
      const params = this.filterParams(this.formRecord);
      console.log('内容', params);
      params.vhcl_model_list || (params.vhcl_model_list = null);
      params.plant_id_list || (params.plant_id_list = null);
      params.check_start_time_star || (params.check_start_time_star = null);
      params.check_start_time_end || (params.check_start_time_end = null);
      params.ftq_workshop_cd || (params.ftq_workshop_cd = null);

      // 图表的code
      params.code = `oqs_ftq_l2_${this.dateCode}`;
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
      params.code = `oqs_ftq_l2_${this.dateCode}_list`;
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
    plantChange () {
      this.formRecord.vhcl_model_list = null;
    },
    /**
     *  跳转到缺陷信息 、过点信息
     */
    handleNoOK (row) {
      // 先拿到车间对应的源质量门
      this.getSrcGateList({ ftq_workshop_cd: row.ftq_workshop_cd }).then((res) => {
        const params = {
          vhcl_model_list: row.vhcl_model || 'null',
          plant_id_list: row.plant_id || 'null',
          defect_status_list: this.isDefect ? '1' : 'null',
          // 根据车间拿到源质量门
          src_gate_cd_list: res !== null ? res.map((item) => item.id) : 'null',
          ftq_workshop_cd: row.ftq_workshop_cd || 'null',
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

        this.$router.push({
          path: '/process-trace/online-defect',
          query: params,
        });
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
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
  },
};
</script>
<style lang="less" scoped>
.ftq{
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
  .ant-col-7{
    text-align: center;
  }
  .echarts-box{
    margin-top: 15px;
  }
}
</style>
