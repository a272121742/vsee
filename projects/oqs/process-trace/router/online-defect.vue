<template>
  <div
    class="od-box"
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
            <a-form-item :label="$t('auditDefect.vin')">
              <a-input
                v-decorator="['vin']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

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

          <!-- 车型  -->
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

          <!-- 车间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('auditDefect.workshop_nm')">
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
                :cache="false"
              />
            </a-form-item>
          </a-col>

          <!-- 责任部门 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.rspns_area')">
              <multiple-net-select
                v-decorator="['rspns_area_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_defect_rspn_dept"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="1"
              />
            </a-form-item>
          </a-col>

          <!-- 检测部位-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.inspt_section')">
              <multiple-net-select
                v-decorator="['inspt_section_id_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_inspt_section"
                :query="{ limit: 100}"
                value-by="id"
                :label-of="(item)=>item.name"
                allow-clear
                show-search
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷等级 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.defect_level')">
              <multiple-net-select
                v-decorator="['defect_level_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_defect_info_level"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷状态-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.defect_status')">
              <multiple-net-select
                v-decorator="['defect_status_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_defect_info_status"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷日期 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.defect_input_time')">
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

          <!-- 缺陷区域 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.insptArea')">
              <a-input
                v-decorator="['inspt_area']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷项(L3) -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.insptItem')">
              <a-input
                v-decorator="['inspt_item']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷位置 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.defectTpst')">
              <a-input
                v-decorator="['defect_pst']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷类型 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.defectType')">
              <a-input
                v-decorator="['defect_type']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 源质量门-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.src_gate_nm')">
              <multiple-net-select
                v-decorator="['src_gate_cd_list']"
                :placeholder="$t('form.select')"
                :url="`/oqs/sqlquery/queryData?code=filter_src_gate&ftq_workshop_cd=${formRecord.ftq_workshop_cd || ''}`"
                value-by="id"
                :query="{ limit: 100}"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="0"
              />
            </a-form-item>
          </a-col>

          <!-- 质量门-->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('od.gate_nm')">
              <multiple-net-select
                v-decorator="['gate_cd_list']"
                :placeholder="$t('form.select')"
                url="/oqs/sqlquery/queryData?code=filter_gate_cd"
                value-by="id"
                :label-of="(item) => item.name"
                allow-clear
                show-search
                delay
                :max-tag-count="2"
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
      <!-- 报告操作按钮 -->
      <div>
        <a-button
          type="primary"
          style="margin-bottom: 12px;"
          :disabled="rowSelection.selectedRowKeys.length === 0"
          @click="create()"
        >
          <a-icon type="icon-single-dccj-outlined"></a-icon>
          {{ $t('od.create_report') }}
        </a-button>
      </div>
      <!-- 提示信息 -->
      <a-alert
        class="vehicle-info-alert"
        type="info"
        show-icon
      >
        <template #message>
          {{ $t('info.infoSelect') }} ： <span style="color: #0097E0;">{{ rowSelection.selectedRowKeys.length }} {{ $t('info.article') }}</span>
        </template>
      </a-alert>
      <a-table
        class="table-cell-ellipsis"
        :data-source="tableData"
        :pagination="pagination"
        :row-selection="rowSelection"
        row-key="id"
        :scroll="{x:2700,y:426}"
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
              {{ $t(`od.${col.dataIndex}`) }}
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
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import formRecordMix from '@mix/form-record-mix.js';
import {
  GET_MOMENT, GET_DATETIME_FORMAT,
  GET_END_OF_DAY,
} from '@util/datetime-helper.js';
import { onlineDefectColumns } from '~~/model/onlineDefect.js';

const fileds = ['vin', 'plant_id_list', 'vhcl_model_list', 'workshop_id_list', 'inspt_section_id_list', 'inspt_item_id_list', 'defect_pst', 'defect_level_list', 'defect_level_list', 'defect_status_list', 'rspns_area_list', 'date', 'inspt_area', 'inspt_item', 'defect_pst', 'defect_type', 'src_gate_cd_list', 'gate_cd_list', 'ftq_workshop_cd'];

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
    tableRowSelectionMix(),
  ],
  props: {
    href: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      columns: onlineDefectColumns,
      pagination: {},
      tableData: [],
      loading: false,
      formItemSpan: 6,
      shift_list: undefined,
      formRecord: {
        vin: null,
        plant_id_list: null,
        vhcl_model_list: null,
        workshop_id_list: null,
        shift_list: null,
        inspt_section_id_list: null,
        inspt_item_id_list: null,
        defect_level_list: null,
        defect_status_list: null,
        rspns_area_list: null,
        date: null,
        inspt_area: null,
        inspt_item: null,
        defect_pst: null,
        defect_type: null,
        ftq_workshop_cd: null,
        src_gate_cd_list: null,
        gate_cd_list: null,
      },
      rowSelection: {
        columnWidth: 68,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'cur-data',
            text: '选本页',
            onSelect: (changableRowKeys) => {
              this.onSelectCurret(changableRowKeys);
            },
          }, {
            key: 'all-data',
            text: '选全部',
            onSelect: (changableRowKeys) => {
              console.log('changableRowKeys', changableRowKeys);
              this.onSelectAll(changableRowKeys);
            },
          }],
      },
      keys: [],
      isAll: false,
    };
  },
  watch: {
    'rowSelection.selectedRowKeys': function (value) {
      if (this.isAll) {
        if (value.length < this.pagination.total) {
          const self = this;
          this.showConfirm(self);
        }
      }
    },
  },
  activated () {
    if (window.location.href.indexOf('?') > 0 && this.$route.query.vin === undefined) {
      const TRQ = JSON.parse(JSON.stringify(this.$route.query));
      // 从缺陷统计分析-帕累托分析  「工厂车型会有可能是多选」
      if (TRQ.plant_id_list !== 'null' && Array.isArray(TRQ.plant_id_list)) {
        this.formRecord.plant_id_list = TRQ.plant_id_list;
      } else {
        this.formRecord.plant_id_list = TRQ.plant_id_list !== 'null' ? [+TRQ.plant_id_list] : null;
      }
      if (TRQ.vhcl_model_list !== 'null' && Array.isArray(TRQ.vhcl_model_list)) {
        this.formRecord.vhcl_model_list = TRQ.vhcl_model_list;
      } else {
        this.formRecord.vhcl_model_list = TRQ.vhcl_model_list !== 'null' ? [TRQ.vhcl_model_list] : null;
      }

      this.formRecord.date = TRQ.dateTimeStart !== 'null' ? [GET_MOMENT(TRQ.dateTimeStart), GET_MOMENT(TRQ.dateTimeEnd)] : null;
      this.formRecord.gate_cd_list = (TRQ.gate_cd_list && TRQ.gate_cd_list !== 'null') ? [TRQ.gate_cd_list] : null;
      this.formRecord.src_gate_cd_list = (TRQ.src_gate_cd_list && TRQ.src_gate_cd_list !== 'null') ? TRQ.src_gate_cd_list : null;
      this.formRecord.ftq_workshop_cd = (TRQ.ftq_workshop_cd && TRQ.ftq_workshop_cd !== 'null') ? [TRQ.ftq_workshop_cd] : null;
      this.formRecord.defect_status_list = TRQ.defect_status_list !== 'null' ? [TRQ.defect_status_list] : null;
      this.formRecord.defect_nm = TRQ.defect_nm !== 'null' ? TRQ.defect_nm : null;
      if (this.formRecord.defect_nm !== undefined) {
        const splitStr1 = this.formRecord.defect_nm.split('|');
        this.formRecord.inspt_area = splitStr1[0];
        this.formRecord.inspt_item = splitStr1[1];
        this.formRecord.defect_pst = splitStr1[2].split('-')[0];
        this.formRecord.defect_type = splitStr1[2].split('-')[1];
      } else {
        this.formRecord.inspt_area = null;
        this.formRecord.inspt_item = null;
        this.formRecord.defect_pst = null;
        this.formRecord.defect_type = null;
      }
      this.$nextTick(() => {
        this.fetch();
        this.$router.push('/process-trace/online-defect');
      });
    }
  },
  created () {
    // if (JSON.stringify(this.$route.query) === '{}' || this.$route.query.vin !== undefined) {
    //   this.formRecord.vin = this.$route.query.vin || null;
    //   this.fetch();
    // }
  },
  methods: {
    // 点击创建报告
    create () {
      console.log('selectedRowKeys', this.rowSelection.selectedRowKeys);
      let params = {};
      if (this.isAll) {
        params = {
          backData: JSON.stringify(this.filterParams(this.formRecord)),
          occurFrq: this.pagination.total,
          isAll: 'true',
        };
      } else {
        params = {
          backData: null,
          idList: this.rowSelection.selectedRowKeys.join(','),
          occurFrq: this.rowSelection.selectedRowKeys.length,
          isAll: 'false',
        };
      }
      this.$router.push({
        path: '/process-issue/issue-definition-list/report/',
        query: { ...params, ...this.tableData.filter((item) => item.id === this.rowSelection.selectedRowKeys[0])[0] },
      });
    },
    // 选本页
    onSelectCurret (data) {
      this.isAll = false;
      this.rowSelection.selectedRowKeys = data;
    },
    // 选全页
    onSelectAll () {
      if (this.pagination.total <= 5000) {
        this.isAll = true;
        this.rowSelection.selectedRowKeys = this.keys;
        this.rowSelection.selectedRowKeys.length = this.pagination.total;
      } else {
        this.$message.error(this.$t('info.allErrInfo'));
      }
    },
    showConfirm (self) {
      this.rowSelection.selectedRowKeys.length = this.pagination.total;
      this.$confirm({
        title: self.$t('info.confirmTitle'),
        content: self.$t('info.confirmContent'),
        okText: self.$t('info.confirmOk'),
        okType: 'primary',
        cancelText: self.$t('info.confirmCancel'),
        centered: true,
        zIndex: 6000,
        onOk () {
          self.rowSelection.selectedRowKeys = [];
          self.isAll = false;
        },
        onCancel () {
          self.rowSelection.selectedRowKeys = self.keys;
        },
      });
    },
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
        vin: null,
        plant_id_list: null,
        vhcl_model_list: null,
        workshop_id_list: null,
        shift_list: null,
        inspt_section_id_list: null,
        inspt_item_id_list: null,
        defect_level_list: null,
        defect_status_list: null,
        rspns_area_list: null,
        date: null,
        inspt_area: null,
        inspt_item: null,
        defect_pst: null,
        defect_type: null,
        ftq_workshop_cd: null,
        src_gate_cd_list: null,
        gate_cd_list: null,
      };
      this.shift_list = undefined;
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
        className: 'OnlineDefectExcel',
        fileName: this.$route.meta.title,
      }).then();
    },
    /**
     * 渲染
     */
    fetch () {
      this.loading = true;
      this.rowSelection.selectedRowKeys = [];
      this.keys = [];
      this.isAll = false;
      const params = this.filterParams(this.formRecord);
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(() => {
        this.loading = false;
      });
    },
    load (res) {
      this.tableData = res.list;
      this.pagination.total = res.total;
      this.keys = this.tableData.map((item) => item.id);
    },
    // 分页
    tableChangeHandle () {
      this.fetch();
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate = this.formRecord.date !== null && this.formRecord.date.length > 0;
      val.check_start_time_star = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[0]) : null;
      val.check_start_time_end = isDate ? GET_DATETIME_FORMAT(this.formRecord.date[1]) : null;
      val.code = 'oqs_online_defect_query';
      val.data_power = 'data_power_plant-plant_id_list';
      return val;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_model_list = null;
    },
    /**
     *  @FIXME: 跳转vin
     */
    handleVIN (vin) {
      window.open(this.$store.state.isDev ? `/process-trace/vehicledetail?vin=${vin}` : `/${project}/process-trace/vehicledetail?vin=${vin}`);
    },
  },
};
</script>

<style lang="less" scoped>
.od-box {
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
  .vehicle-info-alert{
    margin-bottom: 8px;
  }
}
</style>
