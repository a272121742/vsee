<template>
  <div
    class="vehicle-battery-status-record-container"
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
          <!-- vin -->
          <a-col :span="10">
            <a-form-model-item :label="$t('cp.vin')">
              <a-textarea
                v-model="record.vin"
                :placeholder="$t('form.input')"
                :row="2"
              />
            </a-form-model-item>
          </a-col>

          <!-- 查询 + 重置 -->
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
        :scroll="{x:1200,y:426}"
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
              {{ $t(`vehicleBatteryStatusRecord.${col.dataIndex}`) }}
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
import formModelRecordMix from '@mix/form-model-record.js';
import { vehicleBatteryStatusRecord } from '~~/model/vehicleBatteryStatusRecord.js';

const moduleName = 'process-trace';

export default {
  mixins: [
    formModelRecordMix(),
    paginationMix(),
    storeModuleMix({
      name: moduleName,
      action: ['getBatteryRecordTableList'],
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
      columns: vehicleBatteryStatusRecord,
      list: [],
      loading: false,
      formItemSpan: 6,
      // btnShow: false,
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
      this.record.reset();
      this.pagination.current = 1;
      this.fetch();
    },
    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      this.getBatteryRecordTableList({ ...this.record.valueOf(), ...this.serverPagination }).then(this.load).finally(() => {
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
  },
};
</script>

<style lang="less" scoped>
.vehicle-battery-status-record-container{
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
    /deep/ .ant-table-placeholder{
      top:65px
    }
  }
}

</style>
