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
      class="paretoSpin"
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
      formRecord: [],
      startVal: 0,
      endVal: 100,
    };
  },
  computed: {
    options () {
      const self = this;
      return {
        color: ['#0097E0'],
        title: {
          text: this.$t('top.paretoTitle'),
          left: 'left',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter (value) {
            const rate = (value[0].value * 100).toFixed(1);
            const html = `
            <div>${value[0].name}:
            ${value[1].value}</div><div>${self.$t('top.per')}:${rate}%
            <div>
            `;
            return html;
          },
        },
        grid: {
          left: '1%',
          right: 80,
          top: 35,
          containLabel: true,
        },
        xAxis: [{
          type: 'value',
          axisTick: {
            show: false,
          },
          min: 0,
          max: 1,
          interval: 0.1,
          axisLabel: {
            formatter (value) {
              return `${value * 100}%`;
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }],
        yAxis: {
          type: 'category',
          data: this.yAxisData,
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter (value) {
              return value.length > 8 ? `${value.substr(0, 8)}...` : value;
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f6f6f6',
            },
          },
        },
        series: [
          {
            name: 'Cumulative',
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#0097E0',
            },
            data: this.dataSeries1,
          },
          {
            name: 'Frequency',
            type: 'bar',
            itemStyle: {
              color: '#0097E0',
            },
            data: this.dataSeries2,
            xAxisIndex: 1,
            yAxisIndex: 0,
            label: {
              show: true,
              position: 'right',
            },
            barWidth: 30,
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty',
            right: 16,
            textStyle: {
              fontSize: '10px',
              color: 'transparent',
            },
            handleSize: 18,
            handlStyle: {
              color: '#0097E0',
            },
            width: 20,
            zoomLock: true,
            start: this.startVal,
            end: this.endVal,
            // backgroundColor: '#0097E0',
          },
        ],
      };
    },
    storeFN () {
      return this.$store.state[`process-analysis`].paretoParams;
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
      this.$emit('update:spinning1', true);
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
      // 获取数据
      this.$emit('update:spinning1', false);
      if (this.echartsData.length) {
        // 计算dataZoom的固定区域长度
        const fixedPre = Math.floor(((10 / this.echartsData.length) * 100) * 10) / 10;
        console.log('fixedPre', fixedPre);
        this.startVal = 100;
        this.endVal = 100 - fixedPre;

        this.yAxisData = [];
        this.dataSeries1 = [];
        this.dataSeries2 = [];
        localStorage.dataTotal = this.echartsData[0].total;
        this.echartsData && this.echartsData.forEach(((item) => {
          this.yAxisData.unshift(item.defect_nm);// y轴
          this.dataSeries1.unshift(item.kpi_value);// 折线图数据
          this.dataSeries2.unshift(item.defect_count);// 柱状图数据
        }));
      } else {
        this.$message.warning(this.$t('NoData'));
        this.yAxisData = [];
        this.dataSeries1 = [];
        this.dataSeries2 = [];
      }
    },
    // 点击跳转到 缺陷信息
    onClick (data) {
      const params = {
        defect_nm: data.name,
        plant_id_list: this.formRecord.plant_id_list || 'null',
        vhcl_model_list: this.formRecord.vhcl_model_list || 'null',
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
  .paretoSpin{
    /deep/ .ant-spin-dot-spin{
        top:20vh !important;
        left:20vw;
      }
  }
</style>
