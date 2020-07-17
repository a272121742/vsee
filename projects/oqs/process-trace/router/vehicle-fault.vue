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
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`pdiTra.${col.dataIndex}`) }}
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
    // MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),

  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix(),
    storeModuleMix({
      name: 'process-trace',
      action: ['getVFaultTableList', 'getExportData'],
    }),
  ],
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
      this.getVFaultTableList({ ...params, ...this.serverPagination }).then(this.load).finally(() => {
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
