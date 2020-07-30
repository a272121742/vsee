<template>
  <div
    class="vehicle-fault-record"
  >
    <div
      v-if="!hideSearch"
      class="form box mgb-0 mgt-0"
    >
      <a-form-model
        ref="form"
        :model="record"
        class="form-column-split-compact form-column-action-right"
        layout="vertical"
      >
        <a-row :gutter="24">
          <!-- VIN -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('vehicleFaultRecord.vin')">
              <a-input
                v-model="record.vin"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-model-item>
          </a-col>

          <!-- 故障码 -->
          <!-- <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('vehicleFaultRecord.faultCode')">
              <single-net-select
                v-model="record.faultCode"
                :max-tag-count="1"
                url="field-q/v1/claimactivity/queryList?filedName=faultCd"
                :placeholder="$t('form.select')"
                value-by="faultCd"
                :label-of="(item) => item.faultCd"
                delay
                allow-clear
                show-search
              />
            </a-form-model-item>
          </a-col> -->

          <!-- 故障名称 -->
          <!-- <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('vehicleFaultRecord.faultName')">
              <single-net-select
                v-model="record.faultName"
                :max-tag-count="1"
                url="/oqs/v1/faulttemp/queryfaultname"
                :placeholder="$t('form.select')"
                value-by="id"
                :label-of="(item) => item.faultName"
                delay
                allow-clear
                show-search
              />
            </a-form-model-item>
          </a-col> -->
          <!-- 开始时间 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('vehicleFaultRecord.startTime')">
              <a-date-picker
                v-model="record.startTime"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-model-item>
          </a-col>

          <!-- 结束时间 -->
          <a-col :span="formItemSpan">
            <a-form-model-item :label="$t('vehicleFaultRecord.endTime')">
              <a-date-picker
                v-model="record.endTime"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-model-item>
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
            <!-- <a-button
              :style="{ marginLeft: '8px' }"
              @click="exportHandle"
            >
              {{ $t('action.export') }}
            </a-button> -->
          </a-col>
        </a-row>
      </a-form-model>
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
          <!-- v-if="href?!(col.dataIndex === 'vin' || col.dataIndex === 'vhcl_model'):true" -->
          <a-table-column
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`vehicleFaultRecord.${col.dataIndex}`) }}
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
import { GET_MOMENT, GET_END_OF_DAY } from '@util/datetime-helper.js';

import formModelRecord, { map2Datetime } from '@mix/form-model-record.js';
import { seq } from '@util/fnhelper.js';
import { vehicleFaultRecordColumns } from '~~/model/vehicleFaultRecord.js';

const moduleName = 'process-trace';

const recordMapTo = seq(
  map2Datetime('startTime'),
  map2Datetime('endTime'),
);

export default {
  components: {
    // SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
  },
  mixins: [
    formModelRecord(),
    paginationMix(),
    storeModuleMix({
      name: moduleName,
      action: ['getFaultTableList', 'getExportData'],
    }),
  ],
  props: {
    hideSearch: {
      type: Boolean,
      default: false,
    },
    vin: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      columns: vehicleFaultRecordColumns,
      list: [],
      loading: false,
      formItemSpan: 6,
    };
  },
  created () {
    const { vin } = this;
    this.record.vin = { vin }.vin;
    if (vin) {
      this.fetch(this.record.vin);
    }
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
      this.record.reset();
      this.$nextTick(() => {
        this.pagination.current = 1;
        this.fetch();
      });
    },

    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      this.getFaultTableList({ ...this.record.valueOf(recordMapTo), ...this.serverPagination }).then(this.load).finally(() => {
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

    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
  },
};
</script>

<style lang="less" scoped>
.vehicle-fault-record{
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
