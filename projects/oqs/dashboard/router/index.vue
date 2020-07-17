<template>
  <div class="kb">
    <div
      class="form box mgb-0 mgt-0"
      style="padding-bottom: 8px;"
    >
      <a-form
        class="form-column-split-compact form-column-action-right"
        :form="form"
        layout="vertical"
        self-update
      >
        <a-row :gutter="24">
          <a-col :span="formItemSpan">
            <a-form-item :label="$t('Date')">
              <a-range-picker
                v-decorator="['date']"
                :disabled-date="disabledDate"
                :get-calendar-container="e => e.parentNode"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-if="!isShow"
            :span="7"
          >
            <a-alert
              :message="$t('kb.dateInfo')"
              banner
            />
          </a-col>
          <!-- 查询  -->
          <a-col
            class="form-column-action"
            :span="formItemSpan"
          >
            <a-button
              type="primary"
              :loading="loading"
              @click="query"
            >
              {{ $t('action.find') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="form box mgb-0 box1"
      style="padding-bottom: 0px;"
    >
      <!-- 标题 -->
      <div style="margin-bottom:16px">
        <span style="color: #000;">{{ $t('kb.title') }} </span>:
        <span style="color: #888;">{{ titleTime }} </span>
      </div>
      <dash-board
        :data-source="dataSource"
        :meta-header="metaHeader"
        :loading="loading"
        @cell-click="cellClick"
      />
    </div>
  </div>
</template>
<script>
import formRecordMix from '@mix/form-record-mix.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import storeModuleMix from '@mix/store-module.js';
import {
  GET_MOMENT, RANGE_TO_MAP_BY_FIELD, GET_END_OF_DAY,
} from '@util/datetime-helper.js';

const fileds = ['date'];

export default {
  components: {
    DashBoard: () => import('../view/dashboard.vue'),
  },
  mixins: [
    tableRowSelectionMix(),
    formRecordMix('form', fileds),
    paginationMix(),
    storeModuleMix({
      name: 'dashboard',
      action: ['getBoardList', 'getTime'],
    }),
  ],
  data () {
    return {
      pagination: {},
      formItemSpan: 6,
      titleTime: '',
      loading: false,
      dataSource: [],
      metaHeader: {},
      formRecord: {
        check_start_time_star: null,
        check_start_time_end: null,
      },
      isShow: true,
      btnParams: false,
    };
  },
  watch: {
    'formRecord.date': function (val) {
      this.isShowInfo(val);
    },
  },
  created () {
    this.formRecord.date = [GET_MOMENT(new Date()).add(-1, 'months'), GET_MOMENT(new Date())];
    // this.titleTime = GET_DATETIME_FORMAT(GET_MOMENT(new Date()));
    console.log('shijian', this.titleTime);
    this.isShowInfo(this.formRecord.date);

    this.query();
  },
  methods: {
    query () {
      // 表格渲染
      this.loading = true;
      const params = this.filterParams(this.formRecord);
      this.getTime().then((res) => {
        this.titleTime = res[0].max_data_time;
      });
      this.getBoardList(params).then((res) => {
        if (res) {
          this.dataSource = res.bodyData;
          this.metaHeader = res.metaData;
        } else {
          this.dataSource = null;
          this.metaHeader = null;
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 跳转到对应的页面
    cellClick (e, text, record, meta, level1) {
      // 参数
      const params = this.filterParams(this.formRecord);
      let params1 = '';
      params.vhcl_year_name_list = meta || null;
      params.plant_id_list = level1.split(',')[1] || null;
      if (record.row.includes('DR') && !record.row.includes('DRL')) {
        params1 = 'dr';
      } else if (record.row.includes('DRL')) {
        console.log('drl');
        params1 = 'drl';
      } else if (record.row.includes('AUDIT')) {
        params1 = 'audit';
      } else if (record.row.includes('PDI入库直行率')) {
        params1 = 'pdi-ddr';
      } else if (record.row.includes('PDI功能缺陷数')) {
        params1 = 'pdi-fdr';
      } else {
        params1 = 'PPM';
      }
      console.log('内容', params1);
      this.$router.push({
        path: `/process-analysis/${params1}`,
        query: params,

      });
    },
    // 时间过滤器
    filterParams (params) {
      RANGE_TO_MAP_BY_FIELD(this.formRecord, 'date');
      const val = JSON.parse(JSON.stringify(params));
      val.check_start_time_star = this.formRecord.dateStart || null;
      val.check_start_time_end = this.formRecord.dateEnd || null;
      delete val.dateStart;
      delete val.dateEnd;
      return val;
    },
    // 判断是否显示跨月提醒
    isShowInfo (val) {
      if (val.length) {
        const year1 = GET_MOMENT(val[0]).year();
        const year2 = GET_MOMENT(val[1]).year();
        const month1 = GET_MOMENT(val[0]).month();
        const month2 = GET_MOMENT(val[1]).month();
        this.isShow = year1 === year2 ? month1 === month2 : false;
      } else {
        this.isShow = false;
      }
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
  },
};
</script>
<style lang="less" scoped>
.kb {
  display: flex;
  flex-direction: column;
  /deep/ .ant-spin-blur {
    height: calc(100vh - 64px - 48px - 0px - 0px - 86px - 3 * 16px);
    min-height: 580px;
  }
  .ant-table-tbody {
    span {
      display: inline-block;
      width: auto;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .box1 {
    height: calc(100vh - 64px - 48px - 0px - 0px - 86px - 3 * 16px);
    min-height: 580px;
  }
  /deep/.ant-alert-banner {
    margin-top: 18px;
  }
}


</style>
