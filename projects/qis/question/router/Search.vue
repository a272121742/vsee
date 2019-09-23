<template>
  <div class="container shadown-block-normal">
    <!-- 搜索表单 -->
    <advance-search-form
      @change="search"
    />
    <a-divider style="margin: 12px 0 12px 0;"></a-divider>
    <!-- 数据列表 -->
    <issue-table
      col-update-url="/sys/customlist?listCode=issue-advance-column"
      :data="data"
      :total="total"
      :page="page"
      :page-size.sync="limit"
      @change="handleTableChange"
    >
      <span
        slot="action"
        slot-scope="record"
      >
        <a
          href="javascript:;"
          @click="goToDetail(record.id)"
        >
          <!-- 详情链接 -->
          {{ $t('issue_action.detail') }}
        </a>
      </span>
    </issue-table>
  </div>
</template>

<script>
// import { issueTableMix } from '@@cmd/issue-table.js';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('question');

export default {
  name: 'IssueList',
  components: {
    AdvanceSearchForm: () => import('../view/AdvanceSearchForm.vue'),
    IssueTable: () => import('../view/IssueTable.vue')
  },
  // mixins: [issueTableMix],
  data () {
    return {
      /**
       * 表格数据，从服务端获取
       */
      data: [],
      /**
       * 表格总数
       */
      total: 0,
      /**
       * 当前页
       */
      page: 1,
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
      orderField: '',
      filters: {}
    }
  },
  created () {
    this.request();
  },
  methods: {
    ...mapActions([
      // 分页查询全部问题
      'getIssuePage'
    ]),
    request (config) {
      if (config) this.page = 1;
      const {
        page, limit, order, orderField, filters
      } = this;
      this.getIssuePage({
        page, limit, order, orderField, ...config, ...filters
      }).then(res => {
        this.data = res.list;
        this.total = res.total;
      });
    },
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      current && (this.page = current);
      pageSize && (this.limit = pageSize);
      order && (this.order = order.slice(0, -3));
      field && (this.orderField = field);
      this.request();
    },
    search (filters) {
      this.$set(this, 'filters', filters);
      this.request({});
    },
    // 查看详情
    goToDetail (idValue) {
      this.$router.push({
        name: 'QuestionDetail',
        params: {
          id: idValue
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
  .container {
    margin: 16px auto;
    padding: 4px 16px 0;
    background-color: #FFFFFF;
    border-radius: 4px;
    border-radius: 4px;
  }
</style>
