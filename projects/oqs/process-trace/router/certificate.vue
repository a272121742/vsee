<template>
  <div
    class="vehiclepr"
    :class="{'href':!href}"
  >
    <!-- 筛选条件 -->
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
            <a-form-item :label="$t('eol.vin')">
              <a-input
                v-decorator="['vin']"
                :placeholder="$t('form.input')"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <!-- 合格证 -->
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('certif.cert_no')">
              <a-input
                v-decorator="['certNo']"
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
        :scroll="{x:1400,y:426}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            v-if="href?!(col.dataIndex === 'vin'|| col.dataIndex === 'vhcl_model'):true"
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`certif.${col.dataIndex}`) }}
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
import { GET_END_OF_DAY, GET_MOMENT } from '@util/datetime-helper.js';
import { certifiColumns } from '~~/model/certificate.js';

const fileds = ['vin', 'certNo'];


const { project } = process.env;

export default {
  components: {
    // MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
    // SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
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
      columns: certifiColumns,
      showDialog: false,
      selectedKeys: [],
      list: [],
      loading: false,
      filesKeys: [],
      filesValue: [],
      isShow: '',
      formRecord: {
        vin: null, // vin码 模糊
        certNo: null, // 车身号 模糊
      },
      formItemSpan: 6,
    };
  },
  computed: {
  },
  watch: {
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
      this.form.reset();
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
        className: 'CertificateExcel',
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
      this.getTableList({ ...params, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    reset () {
      this.loading = false;
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    // 表格分页器
    tableChangeHandle () {
      this.fetch();
    },
    // 时间
    filterParams (params) {
      const val = JSON.parse(JSON.stringify(params));
      val.code = 'oqs_certficate_query';
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
</template>
