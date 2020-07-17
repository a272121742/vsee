<template>
  <div
    class="cp-box"
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
            <a-form-item :label="$t('cp.vin')">
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
            <a-form-item :label="$t('cp.workshop_nm')">
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

          <!-- 站点编号 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('cp.workstation_cd')">
              <multiple-net-select
                v-decorator="['workstation_id_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_station_code"
                :query="{ limit: 1000}"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 站点名称 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('cp.workstation_nm')">
              <multiple-net-select
                v-decorator="['workstation_name_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_station_name"
                :query="{ limit: 1000}"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 入站时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('cp.check_start_time')">
              <a-range-picker
                v-decorator="['check_start_time']"
                :format="DATETIME_FORMAT"
                style="width:100%"
                :disabled-date="disabledDate"
                show-time
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 出站时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('cp.check_end_time')">
              <a-range-picker
                v-decorator="['check_end_time']"
                show-time
                :disabled-date="disabledDate"
                :format="DATETIME_FORMAT"
                style="width:100%"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 下线标志 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('cp.down_flg')">
              <multiple-net-select
                v-decorator="['down_flg_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_down_flag"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
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
        :scroll="{x:1300,y:426}"
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
              {{ $t(`cp.${col.dataIndex}`) }}
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
import { checkpointColumns } from '~~/model/checkpoint.js';

const { project } = process.env;
const fileds = ['vin', 'plant_id_list', 'vhcl_model_list', 'workstation_id_list', 'workstation_name_list', 'check_start_time', 'check_end_time', 'workshop_id_list', 'down_flg_list',
];

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
      columns: checkpointColumns,
      list: [],
      loading: false,
      manual_flg_list: undefined, // 是否手工补录
      shift_list: undefined, // 班次
      formRecord: {
        vin: null, // vin码 模糊
        vhcl_model_list: null, // 车型
        plant_id_list: null, // 工厂
        workstation_id_list: null, // 站点编号
        workstation_name_list: null, // 站点名称
        workshop_id_list: null, // 车间
        out_begin_time: null, // 出站开始时间
        out_end_time: null, // 出站结束时间
        down_flg_list: null, // 下线标志
        check_start_time: null,
        check_end_time: null,
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
      this.formRecord = {
        vin: null, // vin码 模糊
        vhcl_model_list: null, // 车型
        plant_id_list: null, // 工厂
        workstation_name_list: null,
        workstation_id_list: null, // 站点
        workshop_id_list: null, // 车间
        out_begin_time: null, // 出站开始时间
        out_end_time: null, // 出站结束时间
        check_start_time: null,
        check_end_time: null,
        down_flg_list: null,

      };
      this.shift_list = undefined;
      this.manual_flg_list = undefined;
      this.pagination.current = 1;
      this.fetch();
    },
    /**
     * 导出数据
     */
    exportHandle () {
      const params = this.filterParams(this.formRecord);
      this.getExportData({
        ...params,
        className: 'CheckpointExcel',
        fileName: this.$route.meta.title,
      }).then();
    },
    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      params.manual_flg_list = this.manual_flg_list || null;
      params.shift_list = this.shift_list || null;
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(() => {
        this.loading = false;
      });
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    // 表单分页器
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
      const isDate1 = this.formRecord.check_start_time !== null && this.formRecord.check_start_time.length > 0;
      const isDate2 = this.formRecord.check_end_time !== null && this.formRecord.check_end_time.length > 0;
      // 入站时间
      val.in_begin_time = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.check_start_time[0]) : null;
      val.in_end_time = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.check_start_time[1]) : null;
      // 出战时间
      val.out_begin_time = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.check_end_time[0]) : null;
      val.out_end_time = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.check_end_time[1]) : null;

      val.code = 'oqs_checkpoint_query';
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
.cp-box {
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
  /deep/ .ant-select-selection--multiple {
    height: 32px;
  }
}
</style>
