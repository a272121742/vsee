
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('question');

export const issueTableMix = {
  components: {
    IssueSearchForm: () => import('@@/question/view/IssueSearchForm.vue'),
    IssueTable: () => import('@@/question/view/IssueTable.vue')
  },
  data () {
    return {
      activeKey: '1',
      hideForm: true,
      showSearch: true,
      /**
       * 表格数据，从服务端获取
       */
      data: [],
      /**
       * 表格总数
       */
      total: 0,
      total0: 0,
      total1: 0,
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
      orderField: ''
    }
  },
  watch: {
    hideForm (value) {
      if (this.activeKey === '1') {
        this.showForm = value;
      }
    }
  },
  created () {
    this.request({ type: 0 });
    this.request({ type: 1 });
  },
  methods: {
    ...mapActions([
      // 分页查询全部问题
      'getIssuePage'
    ]),
    request (config) {
      // if (config) this.page = 1;
      const {
        page, limit, order, orderField
      } = this;
      const type = Number(this.activeKey);
      this.getIssuePage({
        page, limit, order, orderField, type, ...config
      }).then(res => {
        if (type === config.type) {
          this.data = res.list;
          this.total = res.total;
        }
        if (config.type === 0) {
          this.total0 = res.total;
        }
        if (config.type === 1) {
          this.total1 = res.total;
        }
      });
    },
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      current && (this.page = current);
      pageSize && (this.limit = pageSize);
      order && (this.order = order.slice(0, -3));
      field && (this.orderField = field);
      this.request({ type: Number(this.activeKey) });
    },
    createQuestion () {
      const name = 'create';
      this.$router.push({
        name: 'QuestionCreate',
        params: {
          name
        },
        query: {
          form: this.$route.path
        }
      })
    },
    changeTable (activeKey) {
      this.activeKey = activeKey;
      this.showSearch = this.activeKey === '1';
      this.hideForm = this.activeKey !== '1' || this.showForm;
      this.page = 1;
      this.request({ type: Number(activeKey) });
    },
    search (filters) {
      this.page = 1;
      this.request(filters);
    },
    hiddenForm () {
      this.hideForm = true;
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
};
