import { createNamespacedHelpers } from 'vuex';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

const { mapActions } = createNamespacedHelpers('question');

export default {
  mixins: [moduleDynamicCache('question')],
  components: {
    IssueTodoTable: () => import('~/question/view/IssueTodoTable.vue'),
    IssueDraftTable: () => import('~/question/view/IssueDraftTable.vue'),
    IssueDoneTable: () => import('~/question/view/IssueDoneTable.vue'),
    IssuePublishedTable: () => import('~/question/view/IssuePublishedTable.vue'),
    IssueBatchImport: () => import('~/question/view/IssueBatchImport.vue'),
    IssueTemporaryTable: () => import('~/question/view/IssueTemporaryTable.vue'),
  },
  data () {
    return {
      showBatchImportModal: false,
      dotoTableConfig: {
        total: 0,
      },
      draftTableConfig: {
        total: 0,
      },
    };
  },
  computed: {
    defaultActiveKey () {
      return this.advancePageConfig.selectTabKey;
    },
    showSearch () {
      return this.defaultActiveKey === '1';
    },
    showTemplateDownload () {
      return this.defaultActiveKey === '0';
    },
    showBatchImport () {
      return this.defaultActiveKey === '0';
    },
  },
  created () {
    if (this.defaultActiveKey !== '1') {
      this.getIssueTodoPage({ page: 1, limit: 1 }).then((res) => {
        this.dotoTableConfig.total = res.total;
      });
    }
    if (this.defaultActiveKey !== '0') {
      this.getIssueDraftPage({ page: 1, limit: 1 }).then((res) => {
        this.draftTableConfig.total = res.total;
      });
    }
  },
  methods: {
    ...mapActions([
      // 分页查询待办列表
      'getIssueTodoPage',
      'getIssueDraftPage',
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
          name,
        },
        query: {
          form: this.$route.path,
        },
      });
    },
    batchImport ({ file }) {
      if (file) {
        if (file.status !== 'done') {
          this.$message.show({ content: this.$t('file_upload.uploading'), type: 'loading' });
        } else if (file.response && file.response.code === 0) {
          this.$message.show({ content: this.$t('file_upload.success'), type: 'success', duration: 3 });
          this.$store.dispatch('refresh');
        } else if (file.response.msg) {
          this.$message.show({ content: file.response.msg, type: 'error', duration: 3 });
        } else {
          this.$message.show({ content: this.$t('file_upload.failure'), type: 'error', duration: 3 });
        }
      }
    },
  },
};
