import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('question');

export default {
  components: {
    AdvanceSearchForm: () => import('~/question/view/AdvanceSearchForm.vue'),
    IssueTable: () => import('~/question/view/IssueTable.vue')
  },
  data () {
    return {
      /**
       * 表格数据，从服务端获取
       */
      data: [],
      loading: false,
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
      if (!this.loading) {
        this.loading = true;
        const {
          page, limit, order, orderField, filters
        } = this;
        this.getIssuePage({
          page, limit, order, orderField, ...config, ...filters
        }).then(res => {
          this.data = res.list;
          this.total = res.total;
          this.$nextTick(() => {
            this.loading = false;
          })
        });
      }
    },
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      current && (this.page = current);
      pageSize && (this.limit = pageSize);
      order && (this.order = order.slice(0, -3));
      field && (this.orderField = field);
      this.request();
    },
    search (filters) {
      this.page = 1;
      this.$set(this, 'filters', filters);
      this.request(filters);
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
