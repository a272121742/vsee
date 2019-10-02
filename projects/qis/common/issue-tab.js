export default {
  components: {
    IssueTodoTable: () => import('~/question/view/IssueTodoTable.vue'),
    IssueDraftTable: () => import('~/question/view/IssueDraftTable.vue'),
    IssueDoneTable: () => import('~/question/view/IssueDoneTable.vue'),
    IssuePublishedTable: () => import('~/question/view/IssuePublishedTable.vue')
  },
  data () {
    return {
      defaultActiveKey: '1',
      showSearch: true,
      dotoTableConfig: {
        total: 0,
        showForm: false
      },
      draftTableConfig: {
        total: 0
      }
    }
  },
  methods: {
    changeTab (key) {
      this.defaultActiveKey = key;
      this.showSearch = key === '1';
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
    }
  }
}
