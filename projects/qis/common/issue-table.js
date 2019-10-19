import moduleDynamicCache from '~~/module-dynamic-cache.js';
import { defaultTo } from 'ramda';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('question');

export default {
  components: {
    AdvanceSearchForm: () => import('~/question/view/AdvanceSearchForm.vue'),
    IssueTable: () => import('~/question/view/IssueTable.vue')
  },
  mixins: [moduleDynamicCache('question')],
  data () {
    return {
      data: [],
      loading: false,
      total: 0
    };
  },
  computed: {
    order () {
      return defaultTo('', this.advancePageConfig.searchOrderData.order).slice(0, -3);
    },
    orderField () {
      return this.advancePageConfig.searchOrderData.field;
    },
    page () {
      return this.advancePageConfig.searchPageData.current;
    },
    limit () {
      return this.advancePageConfig.searchPageData.pageSize;
    },
    filters () {
      return this.advancePageConfig.searchData;
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
          });
        });
      }
    },
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      // 缓存数据到store
      this.changeAdvancePageConfig({ searchOrderData: { order, field } });
      this.changeAdvancePageConfig({ searchPageData: { current, pageSize } });
      this.request();
    },
    search (filters) {
      this.changeAdvancePageConfig({
        searchData: filters,
        searchPageData: {
          current: 1,
          pageSize: this.limit
        }
      });
      this.request();
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
};
