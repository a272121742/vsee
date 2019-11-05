import { createNamespacedHelpers } from 'vuex';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

const { mapActions } = createNamespacedHelpers('question');

export default {
  mixins: [moduleDynamicCache('question')],
  components: {
    IssueTodoTable: () => import('~/question/view/IssueTodoTable.vue'),
    IssueDraftTable: () => import('~/question/view/IssueDraftTable.vue'),
    IssueDoneTable: () => import('~/question/view/IssueDoneTable.vue'),
    IssuePublishedTable: () => import('~/question/view/IssuePublishedTable.vue')
  },
  data () {
    return {
      dotoTableConfig: {
        total: 0
      },
      draftTableConfig: {
        total: 0
      }
    };
  },
  computed: {
    defaultActiveKey () {
      return this.advancePageConfig.selectTabKey;
    },
    showSearch () {
      return this.defaultActiveKey === '1';
    }
  },
  created () {
    this.getIssueTodoPage({}).then(res => {
      this.dotoTableConfig.total = res.total;
    });
    this.getIssueDraftPage({}).then(res => {
      this.draftTableConfig.total = res.total;
    });
  },
  methods: {
    ...mapActions([
      // 分页查询待办列表
      'getIssueTodoPage',
      'getIssueDraftPage'
    ]),
    changeTab (key) {
      this.changeAdvancePageConfig({ selectTabKey: key });
    },
    changeFormShown () {
      this.changeAdvancePageConfig({ showForm: !this.advancePageConfig.showForm });
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
      });
    }
  }
};
