<template>
  <div
    class="issue-box"
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
          <!-- 报告编码 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('issue.code')">
              <a-input
                v-decorator="['code']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 车型 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('model')">
              <multiple-net-select
                v-decorator="['vhclModelId']"
                :max-tag-count="0"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/vehicleproject?isLeaf=1"
                value-by="id"
                :label-of="(item) => item.vhclProjectNameZh"
                delay
                allow-clear
                show-search
                :cache="false"
              />
            </a-form-item>
          </a-col>

          <!-- 祸首件 -->
          <a-col :span="formItemSpan">
            <a-form-model-item
              prop="firstCausePart"
              :label="$t('report.firstCausePart')"
            >
              <single-net-select
                v-decorator="['firstCausePart']"
                :placeholder="$t('form.select')"
                url="/masterdata/v1/part/partList"
                value-by="id"
                label-of="name"
                :query="{}"
                search-by="all"
                allow-clear
                :cache="false"
              />
            </a-form-model-item>
          </a-col>

          <!-- 发布时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('report.date1')">
              <a-range-picker
                v-decorator="['date1']"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:100%"
                show-time
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>

          <!-- 缺陷时间 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('report.date2')">
              <a-range-picker
                v-decorator="['date2']"
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
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格 -->
    <div class="box">
      <a-table
        class="table-cell-ellipsis"
        :data-source="tableData"
        :pagination="pagination"
        row-key="id"
        :scroll="{x: 900,y:426}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`issue.${col.dataIndex}`) }}
            </span>
            <template slot-scope="text,row">
              <!-- 操作列 -->
              <template v-if="col.dataIndex === 'operate'">
                <template
                  v-if="[null,''].includes(row.issueStatus)"
                >
                  <router-link
                    :to="{ path: `/process-issue/issue-definition-list/report/${row.id}` }"
                  >
                    {{ $t('action.edit') }}
                  </router-link>
                  <a-divider
                    type="vertical"
                  />
                  <a-popconfirm
                    :title="$t('feedback.sure2Delete')"
                    @confirm="() => deleteReport(row.id)"
                  >
                    <a href="javascript:;">
                      {{ $t('action.delete') }}
                    </a>
                  </a-popconfirm>
                </template>
              </template>
              <!-- 跳到 IRS -->
              <a-tooltip v-else-if="['issueId'].includes(col.dataIndex)&& row.issueStatus!==null">
                <template #title>
                  {{ text }}
                </template>
                <a
                  :href="`/qis/question/question-create/edit/${row.issueNo}`"
                  target="_blank"
                >
                  {{ row[col.dataIndex] }}
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
  </div>
</template>

<script>
import tableRowSelectionMix from '@mix/table-row-selection.js';
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import formRecordMix from '@mix/form-record-mix.js';
import { GET_DATETIME_FORMAT, GET_MOMENT, GET_END_OF_DAY } from '@util/datetime-helper.js';
import { issueColumns } from '~/common/model/issue.js';


const { project } = process.env;
const fileds = ['code', 'vhclModelId', 'firstCausePart', 'date1', 'date2'];


export default {
  components: {
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    formRecordMix('form', fileds),
    paginationMix(),
    tableRowSelectionMix(),
    storeModuleMix({
      name: 'process-issue',
      action: ['getTableList', 'getExportData', 'deleteList'],
    }),
  ],
  data () {
    return {
      columns: issueColumns,
      showDialog: false,
      selectedKeys: [],
      tableData: [],
      loading: false,
      filesKeys: [],
      filesValue: [],
      isShow: '',
      formRecord: {
        vhclModelId: null, // 车型
        firstCausePart: null, // 车间
        code: null,
        date1: null,
        date2: null,
      },
      formItemSpan: 6,
    };
  },
  created () {
    // this.fetch();
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandle);
  },
  activated () {
    this.fetch();
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
      this.pagination.reset();
      this.form.reset();
      this.$nextTick(() => this.fetch());
    },
    /**
    * 表格渲染
    */
    fetch () {
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    load (res) {
      console.log('内容', res.list);
      this.tableData = res.list;
      console.log('表格数据', this.tableData);
      this.pagination.total = res.total;
    },
    reset () {
      this.loading = false;
    },
    tableChangeHandle () {
      this.fetch();
    },
    // 工厂车型联动
    plantChange () {
      this.formRecord.vhcl_year_name = null;
    },
    // 参数
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      const isDate1 = this.formRecord.date1 !== null && this.formRecord.date1.length > 0;
      val.createDateStart = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.date1[0]) : null;
      val.createDateEnd = isDate1 ? GET_DATETIME_FORMAT(this.formRecord.date1[1]) : null;
      const isDate2 = this.formRecord.date2 !== null && this.formRecord.date2.length > 0;
      val.defectDateStart = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.date2[0]) : null;
      val.defectDateEnd = isDate2 ? GET_DATETIME_FORMAT(this.formRecord.date2[1]) : null;
      return val;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
    /**
     * 点击删除
     */
    deleteReport (id) {
      console.log('点击删除');
      this.deleteList({ ids: id }).then(() => {
        const list = [...this.tableData];
        this.tableData = list.filter((item) => item.id !== id);
        this.fetch();
      });
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
.issue-box {
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
