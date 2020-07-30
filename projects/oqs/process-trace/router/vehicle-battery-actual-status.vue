<template>
  <div
    class="vehicle-battery-actual-status-container"
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
                v-model="record.vinno"
                :placeholder="$t('form.input')"
                :rows="2"
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
      <div class="vehicle-battery-actual-status-table-container">
        <a-row class="dept-table-header">
          <a-col
            :span="6"
          >
            <span class="dept-table-actions">
              <a-button
                type="primary"
                :disabled="rowSelection.selectedRowKeys.length === 0"
                @click="keepRecords(rowSelection)"
              >
                {{ $t('vehicleBatteryActualStatus.saveBtn') }}
              </a-button>
            </span>
          </a-col>
        </a-row>
        <a-table
          class="table-cell-ellipsis"
          :data-source="list"
          :pagination="pagination"
          row-key="id"
          :scroll="{x:1200,y:426}"
          :loading="loading"
          :row-selection="rowSelection"
          @change="tableChangeHandle"
        >
          <template v-for="(col,index) in columns">
            <!-- v-if="href?!(col.dataIndex === 'vin' || col.dataIndex === 'vhcl_model'):true" -->
            <a-table-column
              :key="index"
              v-bind="col"
            >
              <span slot="title">
                {{ $t(`vehicleBatteryActualStatus.${col.dataIndex}`) }}
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
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import formModelRecordMix from '@mix/form-model-record.js';
import { vehicleBatteryActualStatusColumns } from '~~/model/vehicleBatteryActualStatus.js';

const moduleName = 'process-trace';

export default {
  mixins: [
    tableRowSelectionMix(),
    formModelRecordMix(),
    paginationMix(),
    storeModuleMix({
      name: moduleName,
      action: ['getBatteryStatusTableList', 'getExportData', 'postStatusNew'],
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
      columns: vehicleBatteryActualStatusColumns,
      list: [],
      loading: false,
      formItemSpan: 6,
      rowSelection: {},
      // btnShow: false,
    };
  },
  created () {
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandle);
  },
  methods: {
    /**
     * 查询
     */
    searchHandle () {
      if (this.record.vinno) {
        this.pagination.reset();
        this.rowSelection.selectedRowKeys.length = 0;
        this.selectedRows.length = 0;
        this.fetch();
      } else {
        this.$message.error(this.$t('vehicleBatteryActualStatus.requireFill'), 1);
      }
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
      this.getBatteryStatusTableList({ ...this.record.valueOf(), ...this.serverPagination }).then(this.load).finally(() => {
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
    keepRecords () {
      if (this.selectedRows.length) {
        this.postStatusNew(this.selectedRows).then(() => {
          this.rowSelection.selectedRowKeys = [];
          this.selectedRows = [];
          this.$message.success(this.$t('vehicleBatteryActualStatus.saveSuccess'), 1);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.vehicle-battery-actual-status-container{
  display: flex;
  flex-direction: column;
  .ant-table-wrapper {
    .table-container-fixed-defined(46px; 41px;);
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 16px;
      margin-bottom: 4px;
      }
      /deep/ .ant-table-placeholder{
        top: 65px;
      }
      /deep/ .table-cell-ellipsis .ant-table-thead > tr > th{
        padding-top: 0px;
      }
    }
    /deep/.ant-table-scroll .ant-table-body {
      min-height: 410px;
  }
    /deep/ .ant-btn{
      margin-bottom: 14px !important;
    }
}
</style>
