<template>
  <a-table
    class="table-echarts "
    :data-source="dataSource"
    :pagination="false"
    :scroll="{ y: 46 * 10 }"
    bordered
    row-key="id"
  >
    <!-- 遍历Header信息 -->
    <a-table-column
      v-for="(col, index) in columns"
      :key="index"
      v-bind="col"
    >
      <span slot="title">{{ col.dataIndex }}</span>
      <template slot-scope="text, record, a">
        {{ text }} {{ a }}
      </template>
    </a-table-column>
    <a-table-column
      :custom-render="renderEchart"
    >
    </a-table-column>
  </a-table>
</template>

<script>
import VChart from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/dataset';
import 'echarts/lib/component/tooltip';


export default {
  components: {
    VChart,
  },
  // props: {
  //   dataSource: {
  //     type: Array,
  //     default: () => [],
  //   },
  //   columns: {
  //     type: Object,
  //     default: () => ({}),
  //   },
  // },
  data () {
    const vm = this;
    return {
      renderEchart (text, row, index) {
        return index ? {
          attrs: {
            rowSpan: 0,
          },
        } : {
          children: vm.echart,
          attrs: {
            id: 'echart-container',
            style: `height: 0px; padding: 0px; border-right: none;`,
            rowSpan: vm.total,
          },
        };
      },
      columns: [{
        dataIndex: 'factory',
        customRender (text, row) {
          return {
            children: text,
            attrs: {
              rowSpan: row.factoryCount || 0,
            },
          };
        },
        scopedSlots: {
          customRender: 'factory',
        },
        width: 120,
      }, {
        dataIndex: 'vehicle',
        customRender (text, row) {
          return {
            children: text,
            attrs: {
              rowSpan: row.vehicleCount || 0,
            },
          };
        },
        scopedSlots: {
          customRender: 'vehicle',
        },
        width: 120,
      }, {
        dataIndex: 'issueDesc',
        scopedSlots: {
          customRender: 'issueDesc',
        },
        width: 320,
      }],
      dataSource: [{
        id: '1',
        factory: '青岛二工厂',
        factoryCount: 6,
        vehicle: 'EC3',
        vehicleCount: 3,
        issueDesc: '电检未通过-7ABS',
        value: 100,
      }, {
        id: '2',
        factory: '青岛二工厂',
        vehicle: 'EC3',
        issueDesc: '座椅-其他',
        value: 80,
      }, {
        id: '3',
        factory: '青岛二工厂',
        vehicle: 'EC3',
        issueDesc: '轮眉与翼子板-间隙大',
        value: 90,
      }, {
        id: '4',
        factory: '青岛二工厂',
        vehicle: 'EC220',
        vehicleCount: 3,
        issueDesc: '电检未通过-7ABS',
        value: 100,
      }, {
        id: '5',
        factory: '青岛二工厂',
        vehicle: 'EC220',
        issueDesc: '座椅-其他',
        value: 90,
      }, {
        id: '6',
        factory: '青岛二工厂',
        vehicle: 'EC220',
        issueDesc: '轮眉与翼子板-间隙大',
        value: 80,
      }, {
        id: '7',
        factory: '黄普工厂',
        factoryCount: 6,
        vehicle: 'EC3',
        vehicleCount: 3,
        issueDesc: '电检未通过-7ABS',
        value: 70,
      }, {
        id: '8',
        factory: '黄普工厂',
        vehicle: 'EC3',
        issueDesc: '座椅-其他',
        value: 100,
      }, {
        id: '9',
        factory: '黄普工厂',
        vehicle: 'EC3',
        issueDesc: '轮眉与翼子板-间隙大',
        value: 60,
      }, {
        id: '10',
        factory: '黄普工厂',
        vehicle: 'EC220',
        vehicleCount: 3,
        issueDesc: '电检未通过-7ABS',
        value: 90,
      }, {
        id: '11',
        factory: '黄普工厂',
        vehicle: 'EC220',
        issueDesc: '座椅-其他',
        value: 100,
      }, {
        id: '12',
        factory: '黄普工厂',
        vehicle: 'EC220',
        issueDesc: '轮眉与翼子板-间隙大',
        value: 80,
      }],
    };
  },
  computed: {
    total () {
      return this.dataSource.length;
    },
    echart () {
      return <v-chart
        options={this.options}
        style="width: 100%; height: 100%;"
      />;
    },
    options () {
      return {
        color: ['#0097e0'],
        tooltip: {},
        grid: {
          left: 0,
          right: 36,
          top: 0,
          bottom: 0,
          // containLabel: true,
        },
        dataset: {
          // 提供一份数据。
          source: this.dataSource,
        },
        xAxis: {
          show: false,
        },
        yAxis: { show: false, type: 'category' },
        series: [{
          type: 'bar',
          encode: {
            x: 'value',
          },
          label: {
            normal: {
              position: 'right',
              show: true,
            },
          },
        }],
      };
    },
  },
};
</script>

<style lang="less" scoped>
.table-echarts {
  // 设置单元格内填充
  /deep/ .ant-table-thead > tr > th,
  /deep/ .ant-table-tbody > tr > td {
    padding-top: 12px;
    padding-bottom: 12px;
  }
}
</style>
