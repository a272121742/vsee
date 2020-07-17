<template>
  <div>
    <div class="defect-title">
      缺陷分析by工厂
    </div>
    <a-table
      class="defect-view table-cell-ellipsis"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{y:415,x:400}"
    >
      <template v-for="(col,index) in columns">
        <a-table-column
          v-if="index === 3"
          :key="index"
        >
          <template slot-scope="row">
            <a
              href="javascript:;"
              style="color:#0097E0,width:100%"
              @click="onClick(row)"
            >
              <div class="ant-progress ant-progress-line">
                <div>
                  <div
                    class="ant-progress-outer"
                  >
                    <div class="ant-progress-inner">
                      <div
                        class="ant-progress-bg"
                        :style="{width: `${((row.nmrtr_value/maxNum)*100)}%`}"
                      >
                      </div>
                    </div>
                  </div>
                  <span class="ant-progress-text">
                    <span
                      style="color: rgb(0, 151, 224);"
                    >
                      {{ row.nmrtr_value }}
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </template>
        </a-table-column>
        <a-table-column
          v-else
          :key="index"
          v-bind="col"
        >
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>
<script>
import storeModuleMix from '@mix/store-module.js';
import { max } from 'lodash';

const renderContent = (value) => {
  const obj = {
    children: value,
    attrs: {},
  };
  obj.attrs.IsRowBorder = true;
  return obj;
};


export default {
  name: 'DefectParetoPlant',
  components: {},
  mixins: [
    storeModuleMix({
      name: 'process-analysis',
      action: ['getTablePage'],
    }),
  ],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      dataSource: [],
      columns: [
        {
          title: this.$t('工厂'),
          dataIndex: 'plant_nm',
          customRender: (value, row) => {
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.rowSpan = this.mergeCells(row.plant_nm, this.dataSource, 'plant_nm');
            obj.attrs.IsRowBorder = true;
            return obj;
          },
          width: 60,
          align: 'left',
        },
        {
          title: this.$t('model'),
          dataIndex: 'vhcl_model',
          customRender: (value, row) => {
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.rowSpan = this.mergeCells(row.vhcl_model, this.dataSource, 'vhcl_model');
            return obj;
          },
          width: 60,
          align: 'left',
        },
        {
          title: this.$t('缺陷位置-缺陷描述'),
          dataIndex: 'defect_nm',
          customRender: renderContent,
          width: 200,
          align: 'left',
        },
        {
          title: this.$t(''),
          dataIndex: 'nmrtr_value',
          customRender: renderContent,
        },
      ],
      temp: {}, // 当前重复的值,支持多列
      IsRowBorder: false,
      percentNum: 0,
      maxNum: 0,
      spinning: false,
      formRecord: [],
    };
  },
  computed: {
    storeFN () {
      return this.$store.state[`process-analysis`].rightDefectData;
    },
  },
  watch: {
    // 监听筛选条件的变化
    storeFN (data) {
      this.fetch();
      this.temp = {};
      this.formRecord = data;
    },
    spinning (data) {
      this.$emit('spingFn2', data);
    },
  },
  created () {
    this.fetch();
  },
  methods: {
    // 渲染数据
    async fetch () {
      this.spinning = true;
      this.dataSource = [];
      this.formRecord = this.params;
      this.dataSource = await this.getTablePage(this.params)
        .then((data) => data)
        .catch(() => {
          this.$message.error(`error-${this.$t('info.echarts-data-error')}`);
          return false;
        });
      this.spinning = false;
      if (this.dataSource === false) {
        return;
      }
      this.maxNum = max(this.dataSource.map((item) => item.nmrtr_value));
    },
    // 合并单元格
    mergeCells (text, dataSource, col) {
      if (col === 'plant_nm') {
        let i = 0;
        if (text !== this.temp[col]) {
          this.temp[col] = text;
          this.temp.vhcl_model = '';
          this.IsRowBorder = true;
          dataSource.forEach(((item) => {
            if (item[col] === this.temp[col]) {
              i += 1;
            }
          }));
        }
        return i;
      }
      let i = 0;
      if (text !== this.temp[col]) {
        this.temp[col] = text;
        dataSource.forEach(((item) => {
          if (item[col] === this.temp[col] && item.plant_nm === this.temp.plant_nm) {
            i += 1;
          }
        }));
      }
      return i;
    },
    // 点击事件
    onClick (data) {
      console.log('点击', data);
      const params = {};
      params.plant_id_list = [data.plant_id] || null;
      params.vhcl_model_list = [data.vhcl_model] || null;

      params.dateTimeStart = this.formRecord.dateStart || null;
      params.dateTimeEnd = this.formRecord.dateEnd || null;
      console.log('params', params);
      this.$router.push({
        path: '/process-trace/online-defect',
        query: params,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.defect-title {
  font-size: 18px;
  font-weight: 900;
  color: #000000;
}
.defect-view {
  border: 1px solid @page-theme-gb-color;
  margin-top: 10px;
  border-radius: 4px;

  /deep/ .ant-table {
    .ant-table-thead {
      tr > th {
        padding: 0;
        border-right: none;
        font-weight: 900;
        height: 40px;
      }
    }
    .ant-table-tbody {
      padding-left: 6px;

      tr > td {
        padding: 8px 8px 8px 0;
        border-right: none;
        border-bottom: 1px solid #f6f6f6;
      }
      tr:hover>td{
        background: #ffffff;
      }
    }
  }
  // 进度条样式改变
  /deep/ .ant-progress-bg{
    height: 30px !important;
    border-radius: 0px !important;
    background-color: @global-brand-color;
  }
  /deep/ .ant-progress-inner{
    background: #fff;
    border-radius: 0px !important;
  }
  /deep/ .ant-progress-outer {
    margin-right: calc(-2em - 8px);
    padding-right: calc(2em + 8px);
  }

}
</style>
