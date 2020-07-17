<template>
  <div class="echarts-box">
    <v-chart
      :options="options"
      style="width : auto; height : 312px;"
      autoresize
      @legendselectchanged="legendClick"
      @click="onClick"
    >
    </v-chart>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import storeModuleMix from '@mix/store-module.js';
import { times } from 'lodash';
import { list2echartSource } from '~~/echart-util.js';

const { project } = process.env;


export default {
  name: 'DrGraph',
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
    stationId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      spinning: false,
      echartsListList: [],
      newData: [],
      dateCode: 'day',
      startVal: 0,
      endVal: 100,
    };
  },
  computed: {
    options () {
      const self = this;
      return {
        title: {
          text: 'DR',
          left: 'left',
        },
        color: [
          '#0097e0',
          '#33CCFF',
          '#9DEDFF',
          '#005798',
          '#003937',
          '#0477A8',
          '#108FB0',
          '#2EB5C7',
          '#63D4CC',
          '#A0F1DA',
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          formatter (value) {
            const length = value.length / 3;
            let html = `<div>${value[0].name}</div>`;
            if (self.legendArr.length > 0) {
              times(length, (i) => {
                html += `
                <div>${value[i].marker}${value[i].seriesName}:
                ${self.$t('info.actualValue')}:${Math.round(value[0].value[1 + 3 * self.legendArr[i]] * 100)}%&nbsp;
                ${self.$t('info.targetValue')}:${Math.round(value[0].value[2 + 3 * self.legendArr[i]] * 100)}%&nbsp;
                <div>
                `;
              });
            } else {
              times(length, (i) => {
                html += `
                <div>${value[i].marker}${value[i].seriesName}:
                ${self.$t('info.actualValue')}:${Math.round(value[0].value[1 + 3 * i] * 100)}%&nbsp;
                ${self.$t('info.targetValue')}:${Math.round(value[0].value[2 + 3 * i] * 100)}%&nbsp;
                <div>
                `;
              });
            }
            return html;
          },
        },
        legend: {
          // bottom: '100%',
          itemGap: 10,
          itemWidth: 10,
          itemHeight: 10,
        },
        dataset: {
          // 提供一份数据。
          source: this.echartsListList,
        },
        grid: {
          left: '10%',
          right: 70,
          top: '50',
          containLabel: false,
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: [{
          // 主轴
          type: 'category',

        }, {
          // 辅助轴
          type: 'category',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }],
        yAxis: {
          type: 'value',
          min: 0,
          max: 1,
          interval: 0.2,
          axisLabel: {
            show: true,
            formatter (value) {
              return `${Math.round(value * 100)}%`;
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: [0, 1],
            filterMode: 'empty',
            start: this.startVal,
            end: this.endVal,
            textStyle: {
              fontSize: 10,
            },
            bottom: 13,
            handleSize: 22,
            height: 24,
            zoomLock: true,
          },
        ],
        series: this.newData,
      };
    },
    storeFN () {
      return this.$store.state[`process-analysis`].drParams;
    },
  },
  watch: {
    // 监听筛选条件数据的变化
    storeFN (data) {
      this.dateCode = data.dateCode;
      this.fetch(data);
    },
    spinning (data) {
      this.$emit('spingFn', data);
    },
  },
  created () {
    this.fetch();
  },
  methods: {
    // 图表渲染
    async fetch (config = {}) {
      this.spinning = true;
      this.echartsListList = [];
      this.newData = [];
      const echartsData = await this.getEcharts({ ...this.params, ...config })
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
        // 计算dataZoom的固定区域长度
        const fixedPre = Math.floor(((34 / echartsData.length) * 100) * 10) / 10;
        this.startVal = 50 - fixedPre / 2;
        this.endVal = 50 + fixedPre / 2;
        this.echartsListList = list2echartSource({
          series: [1, 0, 4],
          xAxis: 3,
          yAxis: 2,
        }, echartsData);
        // 辅助样式
        const fzxStyle = {
          borderWidth: 1,
          borderColor: '#FABE00',
        };
        // 渲染series
        const serLength = this.echartsListList[0].filter((item, index) => this.echartsListList[0].indexOf(item) === index);
        const SerLineItem = function (flag, i) {
          if (flag === 1) {
          // 主数据序列
            return {
              type: 'bar',
              barGap: 0,
              label: {
                show: true,
                position: 'top',
                rotate: 60,
                verticalAlign: 'middle',
                distance: 20,
                formatter (value) {
                  return value.value[1 + 3 * (i - 1)] === 0 ? '' : `${Math.round(value.value[1 + 3 * (i - 1)].toFixed(2) * 100)}%`;
                },
              },
              barWidth: 20,
            };
          } if (flag === 2) {
          // 辅助数据序列
            return {
              type: 'bar',
              barGap: 0,
              xAxisIndex: 1,
              itemStyle: {
                color: 'transparent',
              },
              stack: i,
              silent: true, // 辅助序列禁用交互
              barWidth: 20,
            };
          }
          // 辅助数据序列
          return {
            type: 'bar',
            barGap: 0,
            xAxisIndex: 1,
            stack: i,
            z: 10,
            itemStyle: fzxStyle,
            silent: true, // 辅助序列禁用交互
          };
        };
        times(serLength.length, (i) => {
          if (i > 0) {
            const lineItem1 = new SerLineItem(1, i);
            const lineItem2 = new SerLineItem(2, i);
            const lineItem3 = new SerLineItem(3, i);
            this.newData.push(lineItem1, lineItem2, lineItem3);
          }
        });
      } else {
        this.$message.warning(this.$t('NoData'));
      }
    },
    // 图例点击事件
    legendClick (e) {
      this.$emit('update:legendArr', []);
      const arr = [];
      times(Object.values(e.selected).length, (i) => {
        if (Object.values(e.selected)[i] === true) {
          arr.push(i);
        }
      });
      this.$emit('update:legendArr', arr);
    },
    // 点击跳转到下钻
    onClick (data) {
      console.log('内容', data);
      // 参数
      const query = {
        vhcl_model_list: data.seriesName,
        plant_id_list: this.params.plant_id_list,
        check_start_time_star: this.params.check_start_time_star,
        check_start_time_end: this.params.check_start_time_end,
        DRILL_TYPE: 'oqs_dr_l1',
        IS_DR: true,
        dateCode: this.dateCode,
        stationId: this.stationId,
      };
      console.log('query', query);

      // 拼接参数
      const queryStr = Object.keys(query)
        .reduce((ary, key) => {
          ary.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
          return ary;
        }, [])
        .join('&');
        // 跳转
      window.open(
        this.$store.state.isDev ? `/process-analysis/drill-down?${queryStr}` : `/${project}/process-analysis/drill-down?${queryStr}`,
      );
    },
  },
};
</script>
<style lang="less" scoped>
  .echarts-box{
    height:312px;
  }
</style>
