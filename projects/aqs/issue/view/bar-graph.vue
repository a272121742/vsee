<template>
  <v-chart
    :options="options"
    style="width:100%; height: 360px;"
  ></v-chart>
</template>

<script>
import VChart from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/axis';

export default {
  components: {
    VChart,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    x: {
      type: Array,
      default: () => [],
    },
    y: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    options () {
      const { title, x, y } = this;
      return {
        // 颜色控制
        color: ['rgba(0,151,224,1)'],
        title: {
          text: title,
          left: 'center',
          textStyle: {
            color: 'rgba(0,0,0,0.65)',
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: 30,
          bottom: 70,
        },
        xAxis: [{
          type: 'category',
          data: x,
          axisLabel: {
            rotate: 60,
          },
        }],
        yAxis: [{
          type: 'value',
        }],
        series: [{
          type: 'bar',
          barWidth: '60%',
          data: y,
          label: {
            show: true,
            position: 'top',
          },
        }],
      };
    },
  },
};
</script>
