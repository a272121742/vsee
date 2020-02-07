<template>
  <v-chart
    :options="options"
    style="width: 264px; height: 176px;"
  ></v-chart>
</template>

<script>
import VChart from 'vue-echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default {
  components: {
    VChart,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ratio: {
      type: Number,
      default: Number,
    },
    unit: {
      type: String,
      default: '%',
    },
  },
  computed: {
    options () {
      const {
        data, title, ratio, unit,
      } = this;
      const labels = data.map((item) => item.name);
      return {
        // 中心标题
        title: {
          text: `{top|${title}}\n{left|${ratio}}{right|${unit}}`,
          textAlign: 'center',
          left: '63%',
          top: 'center',
          textStyle: {
            rich: {
              top: {
                fontSize: 12,
                color: 'rgba(0,0,0,0.45)',
                lineHeight: 20,
              },
              left: {
                fontSize: 32,
                fontWeight: 800,
                color: 'rgba(0,0,0,0.65)',
              },
              right: {
                fontSize: 20,
                color: 'rgba(0,0,0,0.65)',
              },
            },
          },
        },
        // 颜色控制
        color: ['rgba(0,151,224,1)', 'rgba(0,151,224,.4)'],
        legend: {
          orient: 'vertical',
          left: 10,
          bottom: 10,
          textStyle: {
            color: 'rgba(140,140,140,1)',
          },
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          selectedMode: false,
          data: labels,
        },
        series: [{
          type: 'pie',
          center: ['65%', 'center'],
          radius: ['50%', '90%'],
          hoverOffset: 4,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data,
        }],
      };
    },
  },
};
</script>
