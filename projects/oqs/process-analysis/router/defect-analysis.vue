<template>
  <div class="top-defects">
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

          <!-- 排行数 -->
          <a-col :span="formItemSpan">
            <a-form-item
              :label="$t('topNo')"
            >
              <a-select
                v-model="no"
                :placeholder="$t('form.select')"
                allow-clear
                :get-popup-container="trigger => trigger.parentNode"
              >
                <a-select-option value="10">
                  10
                </a-select-option>
                <a-select-option value="20">
                  20
                </a-select-option>
                <a-select-option value="50">
                  50
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- 查询  -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <a-button
              type="primary"
              :loading="spinning1 || spinning2 || loading"
              @click="query"
            >
              {{ $t('action.find') }}
            </a-button>
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

    <div class="box">
      <!-- 左边图表 缺陷帕累托分析 -->
      <div
        style="width: 50%; float: left;"
      >
        <top-graph
          :params="echartsParams"
          :spinning1.sync="spinning1"
        />
      </div>
      <!-- 右边图表 缺陷分析by工厂 -->
      <div
        style="width:50%; float: right;"
      >
        <defect-plant-graph
          :params="rightDefectParams"
          :spinning2.sync="spinning2"
        />
      </div>
    </div>
    <!-- @FIXME: 暂时保留-->
    <!-- <div class="box">
      <a-spin
        style="width: 50%; float: right;"
        :spinning="spinning1"
      >
        <defect-pareto-plant
          :params="rightDefectParams"
          @spingFn2="eSpingFn2"
        />
      </a-spin>
    </div> -->

    <!-- 表格  @FIXME:暂时关闭 -->
    <!-- <a-table
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
            {{ $t(`top.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text,row">
            <a-tooltip v-if="['frequency'].includes(col.dataIndex)">
              <template #title>
                {{ text }}
              </template>
              <a
                style="text-decoration:underline"
                href="javascript:;"
                @click="handleNoOK(row)"
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
    </a-table> -->
  </div>
</template>
<script>
import formRecordMix from '@mix/form-record-mix.js';
import paginationMix from '@mix/pagination.js';
import storeModuleMix from '@mix/store-module.js';
import {
  GET_MOMENT, RANGE_TO_MAP_BY_FIELD, GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import { topColumns } from '~~/model/topDefects.js';

const fileds = ['plant_id_list', 'vhcl_model_list', 'date'];

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    TopGraph: () => import('../view/defect-pareto-graph.vue'),
    // DefectParetoPlant: () => import('../view/defect-pareto-plant.vue'),
    DefectPlantGraph: () => import('../view/defect-plant-graph.vue'),
    // SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
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
      no: '10',
      columns: topColumns,
      paginationFn: false,
      dataTotal: null,
      echartsParams: {},
      formItemSpan: 6,
      formRecord: {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
      },
    };
  },
  created () {
    this.formRecord.date = [GET_MOMENT(new Date()).add(-1, 'months'), GET_MOMENT(new Date())];
    this.query();
  },
  methods: {
    // 图表的loading
    // eSpingFn1 (data) {
    //   this.spinning1 = data;
    // },
    eSpingFn2 (data) {
      this.spinning2 = data;
    },
    // 点击跳转到缺陷信息
    handleNoOK (row) {
      const params = {};
      params.dateTimeStart = row.online_defectconfirmtimestart || 'null';
      params.dateTimeEnd = row.online_defectconfirmtimeend || 'null';
      params.vhcl_model_list = row.online_vhcl_model_id || 'null';
      params.plant_id_list = row.plant_id || 'null';
      this.$router.push({
        path: '/process-trace/online-defect',
        query: params,
      });
    },
    query () {
      // 左边图表 缺陷帕累托分析
      this.echartsParams = this.requestParams();
      const paretoParams = { ...this.echartsParams };
      this.$store.commit('process-analysis/set', { paretoParams });

      // 右边图表
      this.rightDefectParams = this.requestParams();
      this.rightDefectParams.code = `oqs_pareto_defect_plant`;
      const rightDefectData = { ...this.rightDefectParams };
      this.$store.commit('process-analysis/set', { rightDefectData });
    },
    // 参数
    requestParams () {
      const params = this.filterParams(this.formRecord);
      params.vhcl_model_list || (params.vhcl_model_list = null);
      params.check_start_time_star || (params.check_start_time_star = null);
      params.check_start_time_end || (params.check_start_time_end = null);
      params.plant_id_list || (params.plant_id_list = null);
      params.no = this.no === undefined ? null : this.no;
      params.data_power = 'data_power_plant-plant_id_list';
      params.code = `oqs_pareto_defect`;
      return params;
    },
    plantChange () {
      this.formRecord.vhcl_model_list = null;
    },
    // 重置
    resetHandle () {
      this.formRecord = {
        plant_id_list: null,
        vhcl_model_list: null,
        date: null,
      };
      this.no = '';
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
.top-defects{
  display: flex;
  flex-direction: column;
  .echarts{
    height:500px;
    width: auto;
  }
  .ant-table-tbody {
    span {
        display: inline-block;
        width: auto;
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
  }
  .ant-col-7{
    text-align: center;
  }
}
</style>
