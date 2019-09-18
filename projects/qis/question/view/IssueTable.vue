<template>
  <a-table
    row-key="id"
    :data-source="data"
    :pagination="{total: total, current: page, pageSize, showSizeChanger: false, pageSizeOptions: ['10', '20', '50'], showTotal, showQuickJumper: true}"
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
              {{ text }}
            </template>
            {{ text }}
          </a-tooltip>
        </template>
      </a-table-column>
    </template>

    <a-table-column
      key="action"
    >
      <template #title>
        <col-provider
          v-if="url && id"
          :id="id"
          :url="url"
          :columns="columns"
          :transform="$t.bind(_self)"
          :mapping="mapping"
          locale-path="issue"
        ></col-provider>
      </template>
      <template slot-scope="text, record">
        <slot
          name="action"
          v-bind="record"
        ></slot>
      </template>
    </a-table-column>
  </a-table>
</template>

<script>
import { clone } from 'ramda';
import { issueColumns } from '@@cmd/model.js';

export default {
  components: {
    ColProvider: () => import('@comp/table/ColProvider.vue')
  },
  props: {
    /**
     * 数据，从上层组件获取，上层组件通过服务端获取
     */
    data: {
      type: Array,
      default: () => []
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
      /**
       * 列信息
       */
      columns: issueColumns
    }
  },
  computed: {
    // 计算「更新列配置」的api
    url () {
      return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[0];
    },
    // 计算「更新列配置」传过来的id值
    id () {
      return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[1];
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
        const pageText = this.$t('pagination.page')
        return [totalText, pageCount, pageText].join(' ');
      }
      return '';
    }
  }
}
</script>

<style lang="less" scoped>

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
      margin: 1px -6px 0 12px;
    }
    li.ant-pagination-options {
      order: 3;
    }
  }
</style>
