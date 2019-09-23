<template>
  <div>
    <!-- 搜索表单 -->
    <issue-search-form
      :hide="!showForm"
      @hidden="hiddenForm"
      @change="search"
    />
    <!-- 表格 -->
    <a-table
      row-key="id"
      :loading="loading"
      :data-source="data"
      :scroll="{ x: 1300 }"
      :pagination="{ total, current: page, pageSize, showTotal, showQuickJumper: true }"
      @change="handleTableChange"
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
        fixed="right"
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
          <a
            href="javascript:;"
            @click="goToDetail(record.id)"
          >
            <!-- 详情链接 -->
            {{ $t('issue_action.detail') }}
          </a>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
import { clone } from 'ramda';
import { issueTodoColumns } from '@@cmd/model.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('question');

export default {
  name: 'IssueTodoTable',
  components: {
    IssueSearchForm: () => import('./IssueSearchForm.vue'),
    ColProvider: () => import('@comp/table/ColProvider.vue')
  },
  props: {
    /**
     * 总数（sync）
     */
    total: {
      type: Number,
      default: 0
    },
    /**
     * 是否显示搜索表单（sync），默认不显示
     */
    showForm: {
      type: Boolean,
      default: false
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
      columns: issueTodoColumns,
      /**
       * 表格数据，从服务端获取
       */
      data: [],
      loading: false,
      /**
       * 当前页
       */
      page: 1,
      /**
       * 每页数
       */
      pageSize: 10,
      /**
       * 分页数
       */
      limit: 10,
      /**
       * 排序方式： `asc`或者`desc`
       */
      order: '',
      /**
       * 排序字段
       */
      orderField: ''
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
  created () {
    this.request();
  },
  methods: {
    ...mapActions({
      // 分页查询待办列表
      getData: 'getIssueTodoPage'
    }),
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
     * 显示总数(分页组件使用)
     */
    showTotal (total) {
      if (this.data.length) {
        const totalText = this.$t('pagination.total');
        const pageCount = Math.ceil(total / this.pageSize);
        const pageText = this.$t('pagination.page')
        return [totalText, pageCount, pageText].join(' ');
      }
      return '';
    },
    /**
     * 请求数据
     */
    request (config) {
      if (!this.loading) {
        this.loading = true;
        const {
          page, limit, order, orderField
        } = this;
        this.getData({
          page, limit, order, orderField, ...config
        }).then(res => {
          this.$set(this, 'data', res.list);
          this.$emit('update:total', res.total);
          this.$nextTick(() => {
            this.loading = false;
          })
        });
      }
    },
    /**
     * 表格分页、筛选、排序切换时
     */
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      current && (this.page = current);
      pageSize && (this.limit = pageSize);
      order && (this.order = order.slice(0, -3));
      field && (this.orderField = field);
      this.request();
    },
    /**
     * 搜索（根据表单传过来的条件）
     */
    search (filters) {
      console.log(filters);
      this.page = 1;
      this.request(filters);
    },
    /**
     * 隐藏表单，并通知上层组件值更新
     */
    hiddenForm () {
      this.$emit('update:showForm', false);
    },
    // 查看详情
    goToDetail (record) {
      this.$router.push({
        name: 'QuestionDetail',
        params: {
          id: record
        },
        query: {
          form: this.$route.path
        }
      });
    }
  }
}
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
      margin: 1px -6px 0 12px;
    }
    li.ant-pagination-options {
      order: 3;
    }
  }
</style>
