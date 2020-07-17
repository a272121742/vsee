<template>
  <div
    class="vehiclepr"
  >
    <div
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
            <a-form-item :label="$t('torque.vin')">
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
            <a-form-item :label="$t('torque.eqp_cd')">
              <a-input
                v-decorator="['eqp_cd']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 扭矩状态 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('torque.torque_status')">
              <multiple-net-select
                v-decorator="['torque_status_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_atorque_status"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
              />
            </a-form-item>
          </a-col>

          <!-- 角度状态 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('torque.angle_status')">
              <multiple-net-select
                v-decorator="['angle_status_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_angle_status"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
              />
            </a-form-item>
          </a-col>

          <!-- 操作时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('torque.operate_time')">
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
              :loading="spinning || loading"
              @click="searchHandle"
            >
              {{ $t('action.find') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="spinning || loading"
              @click="resetHandle"
            >
              {{ $t('action.reset') }}
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              :disabled="spinning || loading"
              @click="exportHandle"
            >
              {{ $t('action.export') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="box">
      <a-tabs>
        <!-- 表格 -->
        <a-tab-pane key="1">
          <!-- 标题 -->
          <template #tab>
            {{ $t('拧紧表格') }}
          </template>
          <a-table
            class="table-cell-ellipsis"
            :data-source="list"
            :pagination="pagination"
            row-key="id"
            :scroll="{x:1200,y:426}"
            :loading="loading"
            @change="tableChangeHandle"
          >
            <template v-for="(col,index) in columns">
              <a-table-column
                :key="index"
                v-bind="col"
              >
                <span slot="title">
                  {{ $t(`torque.${col.dataIndex}`) }}
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
        </a-tab-pane>

        <!-- 折线图 -->
        <a-tab-pane key="2">
          <template #tab>
            {{ $t('扭矩趋势') }}
          </template>
          <a-spin
            :spinning="spinning"
          >
            <torque-graph
              :params="echartsLineParams"
              :legend-arr.sync="legendArr"
              @spingFn="eSpingFn"
            />
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import formRecordMix from '@mix/form-record-mix.js';
import { GET_DATETIME_FORMAT, GET_END_OF_DAY, GET_MOMENT } from '@util/datetime-helper.js';
import { torqueColumns } from '~~/model/torque.js';

const fileds = ['vin', 'plant_id_list', 'vhcl_model_list', 'eqp_cd', 'torque_status_list', 'angle_status_list', 'date'];

export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    TorqueGraph: () => import('../view/torque-graph.vue'),
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
  },
  data () {
    return {
      columns: torqueColumns,
      list: [],
      loading: false,
      formRecord: {
        vin: null, // vin码 模糊
        plant_id_list: null, // 工厂
        vhcl_model_list: null, // 车型
        eqp_cd: null, // 设备编号
        torque_status_list: null, // 扭矩状态
        angle_status_list: null, // 角度状态
        date: null,
        operate_time_start: null, // 操作开始时间
        operate_time_end: null, // 操作结束时间
      },
      formItemSpan: 6,
      station_id: '1',
      echartsLineParams: {}, // 折线图参数
      spinning: false,
      legendArr: [],
    };
  },
  created () {
    // this.fetch();
  },
  methods: {
    eSpingFn (data) {
      this.spinning = data;
    },
    // 查询
    searchHandle () {
      this.pagination.reset();
      this.fetch();
    },
    // 重置
    resetHandle () {
      this.formRecord = {
        vin: null, // vin码 模糊
        plant_id_list: null, // 工厂
        vhcl_model_list: null, // 车型
        eqp_cd: null, // 设备编号
        torque_status_list: null, // 扭矩状态
        angle_status_list: null, // 角度状态
        date: null,
        operate_time_start: null, // 操作开始时间
        operate_time_end: null, // 操作结束时间
      };
      this.pagination.reset();
      this.$nextTick(() => this.fetch());
    },
    /**
     * 导出数据
     */
    exportHandle () {
      const params = this.filterParams(this.formRecord);
      this.getExportData({
        ...params,
        className: 'TorqueExcel',
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

      // 折线图
      this.legendArr = [];
      this.echartsLineParams = this.filterParams(this.formRecord);
      this.echartsLineParams.code = 'oqs_torque_query_lineChart';
      const torqueParams = { ...this.echartsLineParams };
      this.$store.commit('process-trace/set', { torqueParams });
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
      this.formRecord.vhcl_model_list = null;
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.operate_time_start = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.operate_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;
      val.code = 'oqs_torque_query';
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
  /deep/.ant-tabs-bar{
    width: auto !important;
  }
  .ant-tabs{
    height: 585px;
  }
}
</style>
</template>
