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
    },
    showTemplateDownload () {
      return this.defaultActiveKey === '0';
    },
    showBatchImport () {
      return this.defaultActiveKey === '0';
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
      'getIssueDraftPage',
      'getTemplateDownload'
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
    },
    templateDownload () {
      this.getTemplateDownload({rec_type: 20021001}).then((res = {}) => {
        const url = res.path;
        const name = res.originalFilename;
        if (!url || !name) {
          this.$message.show({ content: this.$t('file_download.failure'), type: 'error', duration: 3 });
        } else {
          const a = document.createElement('a');
          a.setAttribute('href', this.getDownloadURL(url, name));
          a.setAttribute('download', name);
          // a.click在火狐下无法被触发，必须通过这种方式下载
          a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          a.remove();
        }
      });
    },
    batchImport ({ file }) {
      if (file) {
        if (file.status !== 'done') {
          this.$message.show({ content: this.$t('file_upload.uploading'), type: 'loading' });
        } else {
          if (file.response && file.response.code === 0) {
            this.$message.show({ content: this.$t('file_upload.success'), type: 'success', duration: 3 });
            this.$store.dispatch('refresh');
          } else {
            if (file.response.msg) {
              this.$message.show({ content: file.response.msg, type: 'error', duration: 3 });
            } else {
              this.$message.show({ content: this.$t('file_upload.failure'), type: 'error', duration: 3 });
            }
            
          }
        }
      }
    }
  }
};
