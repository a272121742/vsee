<template>
  <div class="echarts-box">
    <v-chart
      :options="options"
      style="width : auto; height : 312px;"
      autoresize
    >
    </v-chart>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
// 引入柱折线图
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import storeModuleMix from '@mix/store-module.js';
import { times } from 'lodash';


export default {
  name: 'DrillDownGraph',
  components: {
    VChart,
  },
  mixins: [
    storeModuleMix({
      name: 'process-analysis',
      action: ['getEcharts'],
    }),
  ],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    legendArr: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      spinning: false,
      xAxisData: [],
      seriesData: [],
      IS_DR: false,
    };
  },
  computed: {
    options () {
      return {
        color: [
          '#A0F1DA',
          '#0097e0',
          '#33CCFF',
          '#9DEDFF',
          '#005798',
          '#003937',
          '#0477A8',
          '#108FB0',
          '#2EB5C7',
          '#63D4CC',
        ],
        title: {
          text: 'DR',
          left: 'left',
          show: this.IS_DR,
        },
        legend: {
        },
        grid: {
          left: this.IS_DR ? '10%' : '6%',
          right: '3%',
          top: '45',
          bottom: 35,
          containLabel: false,
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          data: this.xAxisData,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%'],
          min: 0,
          max: 1,
          interval: 0.2,
          axisLabel: {
            show: true,
            formatter (value) {
              return `${value * 100}%`;
            },
          },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
        },
        series: this.seriesData,
      };
    },
    storeFN () {
      return this.$store.state[`process-analysis`].lineParams;
    },
  },
  watch: {
    // 监听筛选条件数据的变化
    storeFN (data) {
      this.fetch(data);
    },
    spinning (data) {
      this.$emit('spingFn', data);
    },
  },
  created () {
    // 是否显示tittle 等
    const TRQ = this.$route.query;
    this.IS_DR = (TRQ.DRILL_TYPE === 'oqs_dr_ftq_l1' || TRQ.DRILL_TYPE === 'oqs_dr_l1') && TRQ.IS_DR;
    this.fetch();
  },
  methods: {
    // 图表渲染
    async fetch (config = {}) {
      // 数据初始化
      this.spinning = true;
      this.seriesData = [];
      this.xAxisData = [];
      // 后端判断折线图标识 is_lineChart
      const echartsData = await this.getEcharts({ ...this.params, ...config, is_lineChart: 1 })
        .then((data) => data)
        .catch(() => {
          this.$message.error(`error-${this.$t('info.echarts-data-error')}`);
          return false;
        });
      this.spinning = false;
      if (echartsData === null) {
        return;
      }
      if (echartsData.length) {
        /**
         * x轴
         */
        times(echartsData[0].length, (i) => {
          if (i > 0) {
            this.xAxisData.push([echartsData[0][i]]);
          }
        });
        /**
         * 虚线渲染
         */
        const MLD1 = [];
        times(echartsData[0].length, () => {
          MLD1.push('');
        });
        const MLD2 = [];
        times(echartsData[0].length, (i) => {
          MLD2.push({ xAxis: i });
        });
        const markLineData = {
          type: 'line',
          data: MLD1,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: { show: false },
            data: MLD2,
            lineStyle: {
              color: '#CFCFCF',
            },
          },
        };
        /**
         * 渲染series
         */
        this.seriesData = echartsData.reduce((array, colList, index) => {
          if (index) {
            array.push(colList.reduce((json, item, index1) => {
              if (index1) {
                json.data.push(item);
              } else {
                json.name = item;
              }
              return json;
            }, {
              name: '',
              type: 'line',
              data: [],
              symbol: 'circle',
              symbolSize: 10,
              zlevel: 1,
              label: {
                normal: {
                  show: true,
                  formatter ({ value = 0 } = {}) {
                    return `${Math.round(value * 100)}%`;
                  },
                },
              },
            }));
          }
          return array;
        }, []);
        this.seriesData.unshift(markLineData);
      } else {
        this.$message.warning(this.$t('NoData'));
      }
    },
  },
};
</script>
<style lang="less" scoped>
  .echarts-box{
    height:312px;
  }
</style>
