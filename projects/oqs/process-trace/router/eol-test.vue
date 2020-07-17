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
            <a-form-item :label="$t('eol.vin')">
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

          <!-- 检测时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('eol.test_dt')">
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
        :scroll="{x:2000,y:426}"
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
              {{ $t(`eol.${col.dataIndex}`) }}
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
import { GET_DATETIME_FORMAT, GET_END_OF_DAY, GET_MOMENT } from '@util/datetime-helper.js';
import { eolTestColumns } from '~~/model/eoltest.js';


const fileds = ['vin', 'vhcl_model_list', 'date', 'plant_id_list'];


const { project } = process.env;

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
      columns: eolTestColumns,
      list: [],
      loading: false,
      formRecord: {
        vin: null, // vin码 模糊
        vhcl_model_list: null, // 车型
        plant_id_list: null, // 工厂
        date: null,
      },
      formItemSpan: 6,
    };
  },
  created () {
    // this.fetch();
  },
  methods: {
    // 查询
    searchHandle () {
      this.pagination.reset();
      this.fetch();
    },
    // 重置
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
        className: 'EolTestExcel',
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
      val.check_start_time = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.check_end_time = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;

      val.code = 'eol_test_query';
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
