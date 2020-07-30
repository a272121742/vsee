<template>
  <div class="echarts-box">
    <v-chart
      :options="options"
      style="width : auto; height : 450px;"
      autoresize
      @legendselectchanged="legendClick"
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
  name: 'TorqueGraph',
  components: {
    VChart,
  },
  mixins: [
    storeModuleMix({
      name: 'process-trace',
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
    };
  },
  computed: {
    options () {
      const self = this;
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          formatter (value) {
            let html = `
            <div>${value[0].name}</div>
            <div>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#33CCFF;"></span>${self.$t('VIN')}:
            ${value[1].value}<br>
            `;
            if (self.legendArr.length > 0) {
              times(self.legendArr.length, (i) => {
                html += `
                ${value[i + 2].marker}${value[i + 2].seriesName}:
                ${value[i + 2].value}<br>
                <div>
            `;
              });
            } else if (self.legendArr.length === 0 && value.length === 4) {
              console.log('2');
              html += `
                ${value[2].marker}${self.$t('扭矩值')}:
                ${value[2].value}<br>
                ${value[3].marker}${self.$t('角度值')}:
                ${value[3].value}<br>
                <div>
            `;
            } else {
              html = ``;
            }

            return html;
          },
        },
        legend: {
          data: ['扭矩值', '角度值'],
        },
        grid: {
          left: 60,
          right: 60,
          top: '40',
          bottom: 20,
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
          min: 0,
          axisLabel: {
            show: true,
          },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
        },
        series: this.seriesData,
      };
    },
    storeFN () {
      return this.$store.state[`process-trace`].torqueParams;
    },
  },
  watch: {
    // 监听筛选条件数据的变化
    storeFN (data) {
      console.log('cchu');
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
      // 数据初始化
      this.spinning = true;
      this.seriesData = [];
      this.xAxisData = [];
      // 后端判断折线图标识 is_lineChart

      const echartsData = await this.getEcharts({ ...this.params, ...config, is_lineChart: 2 })
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
          this.xAxisData.push([echartsData[0][i]]);
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
        this.seriesData = [
          {
            name: 'VIN',
            type: 'line',
            data: echartsData[1],
            symbol: 'circle',
            symbolSize: 10,
            zlevel: 1,
            label: {
              normal: {
                show: true,
              },
            },
            lineStyle: {
              color: 'transparent',
            },
            itemStyle: {
              color: 'transparent',
            },
            hoverAnimation: false,
            silent: true,
          },
          {
            name: '扭矩值',
            type: 'line',
            data: echartsData[2],
            symbol: 'circle',
            symbolSize: 10,
            zlevel: 2,
            label: {
              show: true,
            },
            lineStyle: {
              color: '#0097e0',
            },
            itemStyle: {
              color: '#0097e0',
            },
            hoverAnimation: false,
            silent: true,
          },
          {
            name: '角度值',
            type: 'line',
            data: echartsData[3],
            symbol: 'circle',
            symbolSize: 10,
            zlevel: 3,
            label: {
              normal: {
                show: true,
              },
            },
            lineStyle: {
              color: '#33CCFF',
            },
            itemStyle: {
              color: '#33CCFF',
            },
            hoverAnimation: false,
            silent: true,
          },

        ];
        this.seriesData.unshift(markLineData);
      } else {
        this.$message.warning(this.$t('NoData'));
      }
    },
    // 图例点击事件
    legendClick (e) {
      console.log('legendClick', e);
      this.$emit('update:legendArr', []);
      const arr = [];
      times(Object.values(e.selected).length, (i) => {
        if (Object.values(e.selected)[i] === true) {
          arr.push(i);
        }
      });
      console.log('点击之后', arr);
      this.$emit('update:legendArr', arr);
    },
  },
};
</script>

<style lang="less" scoped>
  .echarts-box{
    height:312px;
  }
</style>
