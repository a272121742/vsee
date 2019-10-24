<template>
  <a-table
    :data-source="data"
    :loading="loading"
    :scroll="{ x: 1700 }"
    :pagination="{total: total, current: page, pageSize, showTotal, showQuickJumper: true}"
    row-key="id"
    v-on="$listeners"
  >
    <template v-for="col in columns">
      <a-table-column
        v-if="!col.invisible"
        :key="col.title"
        v-bind="filterTitle(col)"
      >
        <span slot="title">{{ $t(`issue.${col.dataIndex}`) }}</span>
        <template slot-scope="text">
          <a-tooltip>
            <template #title>
              {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text }}
            </template>
            {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text }}
          </a-tooltip>
        </template>
      </a-table-column>
    </template>

    <a-table-column
      key="action"
      fixed="right"
    >
      <template #title>
        <!-- <col-provider
          v-if="url && id"
          :id="id"
          :url="url"
          :columns="columns"
          :transform="$t.bind(_self)"
          :mapping="mapping"
          locale-path="issue"
        ></col-provider> -->
      </template>
      <template slot-scope="text, record">
        <slot
          v-bind="record"
          name="action"
        ></slot>
      </template>
    </a-table-column>
  </a-table>
</template>

<script>
import { clone } from 'ramda';
import { clearObserver } from '@util/datahelper.js';
import { issueColumns } from '~~/model.js';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

export default {
  components: {
    // ColProvider: () => import('@comp/table/ColProvider.vue')
  },
  mixins: [moduleDynamicCache('question')],
  props: {
    /**
     * 数据，从上层组件获取，上层组件通过服务端获取
     */
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 总数，从上层组件获取，上层组件通过服务端获取
     */
    total: {
      type: Number,
      default: 0
    },
    /**
     * 当前页
     */
    page: {
      type: Number,
      default: 1
    },
    /**
     * 分页数量
     */
    pageSize: {
      type: Number,
      default: 10
    },
    /**
     * 列更新地址
     */
    colUpdateUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // columns: issueColumns
    };
  },
  computed: {
    // // 计算「更新列配置」的api
    // url () {
    //   return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[0];
    // },
    // // 计算「更新列配置」传过来的id值
    // id () {
    //   return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[1];
    // },
    columns () {
      const orderData = this.advancePageConfig.searchOrderData;
      return issueColumns.map(col => {
        const newCol = clearObserver(col);
        if (newCol.dataIndex === orderData.field) {
          newCol.sortOrder = orderData.order;
        } else {
          newCol.sortOrder = void 0;
        }
        return newCol;
      });
    }
  },
  methods: {
    /**
     * 当列配置更新时，重新映射
     */
    mapping (cols) {
      this.columns = cols;
    },
    /**
     * 过滤掉标题
     */
    filterTitle (col) {
      const newCol = clone(col);
      delete newCol.title;
      return newCol;
    },
    /**
     * 显示总数
     */
    showTotal (total) {
      if (this.data.length) {
        const totalText = this.$t('pagination.total');
        const pageCount = Math.ceil(total / this.pageSize);
        const pageText = this.$t('pagination.page');
        return [totalText, pageCount, pageText].join(' ');
      }
      return '';
    }
  }
};
</script>

<style lang="less" scoped>
  /deep/ .ant-table{
    // 设置表格内容不换行
    table {
      // width: 100%; /*必须设置，否则还是会拉长单元格*/
      table-layout: fixed;/*只有定义表格的算法为fixed,th才有效果*/
      word-wrap:break-all;
    }
    th > div, td {
      overflow:hidden;/*超出长度的文字隐藏*/
      text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
      white-space:nowrap;/*强制不换行*/
      word-break:keep-all;/*文字不换行*/
    }
    // 设置单元格内填充
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 16px;
    }
    // 矫正排序按钮的位置
    .ant-table-column-sorter {
      right: 16px!important;
      margin-top: -10px!important;
    }
  }
  /deep/ .ant-pagination {
    display: inline-flex;
    li.ant-pagination-item,
    li.ant-pagination-prev,
    li.ant-pagination-next,
    li.ant-pagination-jump-prev,
    li.ant-pagination-jump-next {
      order: 1;
    }
    li.ant-pagination-total-text {
      order: 2;
      margin: 1px 0 0 12px;
    }
    li.ant-pagination-options {
      order: 3;
      margin-left: 12px;
    }
  }
</style>
