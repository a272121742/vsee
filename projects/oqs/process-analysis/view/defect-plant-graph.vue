<template>
  <div class="echarts-box">
    <v-chart
      v-if="!spinning && echartsData.length"
      :options="options"
      autoresize
      style="width : auto; height : 500px;"
      @click="onClick"
    >
    </v-chart>
    <a-empty
      v-else-if="!spinning && !echartsData.length"
      :image="simpleImage"
      style="paddingTop:160px"
    >
    </a-empty>
    <a-spin
      v-else
      class="plantSpin"
    >
    </a-spin>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import storeModuleMix from '@mix/store-module.js';
import { times } from 'lodash';
import { Empty } from 'ant-design-vue';


export default {
  name: 'TopGraph',
  components: {
    VChart,
  },
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
      spinning: false,
      yAxisData: [],
      dataSeries1: [],
      dataSeries2: [],
      echartsData: [],
      dataSource: {},

      IsRowBorder: false,
      formRecord: [],
      startVal: 0,
      endVal: 100,
      val: 0,
    };
  },
  computed: {
    options () {
      const self = this;
      const nameTextStyle = {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
      };
      return {
        color: ['#0097E0'],
        title: {
          text: this.$t('top.plantTitle'),
          left: 'left',
        },
        tooltip: {
          position: 'top',
          formatter (value) {
            let html = ``;
            html
            += `
            <div>
            ${self.$t('plant')}: ${value.name.split(',')[1]} <br />
            ${self.$t('model')}: ${value.name.split(',')[3]} <br />
            ${value.name.split(',')[0]}: ${value.value} <br />
            <div>
            `;
            return html;
          },
        },
        grid: [{
          top: 70,
          left: 110,
          right: 80,
          containLabel: true,
        }, {
          top: 70,
          left: 10,
          right: 80,
        }, {
          top: 70,
          left: 70,
          right: 80,
        }],
        yAxis: [{
          // 缺陷描述、
          name: this.$t('top.defectDes'),
          nameLocation: 'end',
          nameTextStyle,
          gridIndex: 0,
          type: 'category',
          data: this.dataSource.descList,
          axisLabel: {
            padding: [0, 0, 0, 20],
            formatter (value) {
              return value.split(',')[0].length > 3 ? `${value.split(',')[0].substr(0, 8)}...` : `${value.split(',')[0]}...`;
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#f6f6f6',
            },
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f6f6f6',
            },
          },
        }, {
          // 车型
          name: this.$t('model'),
          nameLocation: 'end',
          nameTextStyle,
          gridIndex: 2,
          type: 'category',
          data: this.dataSource.modelLabelList,
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            align: 'left',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            length: 10,
            interval: (index) => this.dataSource.modelTickList.indexOf(index) !== -1,
          },
        }, {
          // 工厂
          name: this.$t('top.plant'),
          nameLocation: 'end',
          nameTextStyle,
          gridIndex: 1,
          type: 'category',
          data: this.dataSource.plantLabelList,
          boundaryGap: false,
          axisLabel: {
            margin: 10,
            align: 'left',
            interval: 0,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            // length: 900,
            // interval: (index) => this.dataSource.plantTickList.indexOf(index) !== -1,
          },
        }],
        xAxis: [{
          gridIndex: 0,
          splitLine: {
            show: false,
          },
        }, {
          gridIndex: 1,
          axisLine: {
            show: false,
          },
        }, {
          gridIndex: 2,
          axisLine: {
            show: false,
          },
        },

        ],
        series: [{
          xAxisIndex: 0,
          yAxisIndex: 0,
          type: 'bar',
          label: {
            show: true,
            position: 'right',
          },
          data: this.dataSource.valueList,
          barWidth: 30,
        }],
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: [0, 1, 2],
            filterMode: 'empty',
            right: 16,
            textStyle: {
              fontSize: '10px',
              color: 'transparent',
            },
            handleSize: 18,
            width: 20,
            zoomLock: true,
            start: this.startVal,
            end: this.endVal,
          },
        ],
      };
    },
    storeFN () {
      return this.$store.state[`process-analysis`].rightDefectData;
    },
  },
  watch: {
    // 监听筛选条件的变化
    storeFN (data) {
      this.fetch();
      this.formRecord = data;
    },
  },
  beforeCreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created () {
    this.fetch();
  },
  methods: {
    // 渲染图表
    async fetch () {
      this.spinning = true;
      this.$emit('update:spinning2', true);
      this.echartsData = [];
      this.dataSource = {};
      this.formRecord = this.params;
      this.echartsData = await this.getTablePage(this.params)
        .then((data) => data)
        .catch(() => {
          this.$message.error(`error-${this.$t('info.echarts-data-error')}`);
          return false;
        });
      this.spinning = false;
      if (this.echartsData === false) {
        return;
      }
      this.$emit('update:spinning2', false);
      if (this.echartsData.length) {
        // 计算dataZoom的固定区域长度
        const fixedPre = Math.floor(((10 / this.echartsData.length) * 100) * 10) / 10;
        this.startVal = 100;
        this.endVal = 100 - fixedPre;
        this.dataSource = this.covertData(this.echartsData);
      } else {
        this.$message.warning(this.$t('NoData'));
        this.dataSource = {};
      }
    },
    // 数据转化函数
    covertData (data) {
      const descList = [];
      const valueList = [];

      const plantLabelList = [''];
      const modelLabelList = [''];

      const plantTmp = {
        name: '',
        count: 0,
      };
      const modelTmp = {
        name: '',
        count: 0,
      };
      times(data.length, (i) => {
        descList.push(data[i].defect_nm);
        valueList.push(data[i].defect_count);
        plantLabelList.push('', '');
        modelLabelList.push('', '');
        // 工厂
        if (i === data.length - 1 || (plantTmp.name !== '' && plantTmp.name !== data[i + 1].plant_nm)) {
          plantLabelList[i * 2 - plantTmp.count + 1] = data[i].plant_nm;
          plantTmp.name = '';
          plantTmp.count = 0;
        } else {
          plantTmp.name = data[i].plant_nm;
          // eslint-disable-next-line no-plusplus
          plantTmp.count++;
        }

        // 车型
        if (i === data.length - 1 || (modelTmp.name !== '' && modelTmp.name !== data[i + 1].vhcl_model)) {
          modelLabelList[i * 2 - modelTmp.count + 1] = data[i].vhcl_model;
          modelTmp.name = '';
          modelTmp.count = 0;
        } else {
          modelTmp.name = data[i].vhcl_model;
          // eslint-disable-next-line no-plusplus
          modelTmp.count++;
        }
      });
      console.log('内容', modelLabelList);
      return {
        descList,
        valueList,
        plantLabelList,
        modelLabelList,
      };
    },
    onClick (data) {
      const params = {
        plant_id_list: data.name.split(',')[2] || 'null',
        vhcl_model_list: data.name.split(',')[3] || 'null',
        defect_nm: data.name.split(',')[0],
        dateTimeStart: this.formRecord.dateStart || 'null',
        dateTimeEnd: this.formRecord.dateEnd || 'null',
        defect_status_list: '1',
      };
      this.$router.push({
        path: '/process-trace/online-defect',
        query: params,
      });
    },

  },
};
</script>
<style lang="less" scoped>
  .echarts-box{
    margin-left:10px;
    height:500px;
    border-radius: 4px;
  }
  .plantSpin{
  /deep/ .ant-spin-dot-spin{
      top:20vh !important;
      left:20vw;
    }
  }
</style>
