<template>
  <div class="container">
    <a-tabs :activeKey="activeKey" @change="changeTable">
      <a-tab-pane
        key="1"
      >
        <template slot="tab">
          待办事项
          <a-badge
            :count="total"
            :number-style="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
          />
        </template>
      </a-tab-pane>
      <a-tab-pane
        key="2"
      >
        <span slot="tab">
          待发事项
          <a-badge
            :count="total"
            :number-style="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
          />
        </span>
      </a-tab-pane>
      <a-tab-pane
        key="3"
      >
        <span slot="tab">
          已办事项
        </span>
      </a-tab-pane>
      <a-tab-pane
        key="4"
      >
        <span slot="tab">
          已发事项
        </span>
      </a-tab-pane>
      <template #tabBarExtraContent>
        <a-button
          v-if="showSearch"
          icon="search"
          type="primary"
          :ghost="true"
          @click="() => hideForm = !hideForm"
        >
          搜索
        </a-button>
        <!-- <a-button
          v-permission="'qis:list:create'"
          icon="plus-circle"
          type="primary"
          @click="createQuestion"
        >
          创建问题
        </a-button> -->
         <a-button

          icon="plus-circle"
          type="primary"
          @click="createQuestion"
        >
          创建问题
        </a-button>
      </template>
    </a-tabs>
    <!-- 搜索表单 -->
    <issue-search-form
      :hide="hideForm"
      @hidden="hiddenForm"
      @change="request"
    />
    <!-- 数据列表 -->
    <issue-table
      col-update-url="/sys/customlist?listCode=issue-column"
      :data="data"
      :total="total"
      :page="page"
      @change="handleTableChange"
    >
     <span slot="action" slot-scope="record">
        <a href="javascript:;" @click="goToDetail(record.id)">详情</a>
      </span>
    </issue-table>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('question');

const columns = [
  {
  title: 'no',
  dataIndex: 'no',
  scopedSlots: { customRender: 'no' }
}, {
  title: 'title',
  dataIndex: 'title',
  scopedSlots: { customRender: 'title' }
}, {
  title: 'system',
  dataIndex: 'system',
  scopedSlots: { customRender: 'system' }
}, {
  title: 'level',
  dataIndex: 'level',
  scopedSlots: { customRender: 'level' }
}, {
  title: 'problemsClassify',
  dataIndex: 'problemsClassify',
  scopedSlots: { customRender: 'problemsClassify' }
}, {
  title: 'problemStage',
  dataIndex: 'problemStage',
  scopedSlots: { customRender: 'problemStage' }
}, {
  title: 'schedule',
  dataIndex: 'schedule',
  scopedSlots: { customRender: 'schedule' }
},
{
  title: 'createDate',
  dataIndex: 'createDate',
  scopedSlots: { customRender: 'createDate' }
},
{
  title: 'acceptDate',
  dataIndex: 'acceptDate',
  scopedSlots: { customRender: 'acceptDate' }
}

];
export default {
  name: 'QuestionList',
  components: {
    IssueSearchForm: () => import('../view/IssueSearchForm.vue'),
    IssueTable: () => import('../view/IssueTable.vue'),
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
    this.request();
  },
  methods: {
    ...mapActions([
      // 分页查询全部问题
      'getIssuePage'
    ]),
    request (config) {
      if (config) this.page = 1;
      const {page, limit, order, orderField} = this;
      this.getIssuePage({...config, page, limit, order, orderField}).then(res => {
        this.data = res.list;
        this.total = res.total;
      });
    },
    handleTableChange ({current = 1, pageSize = 10}, filters, {order = '', field = ''}) {
      current && (this.page = current);
      pageSize && (this.limit = pageSize);
      order && (this.order = order);
      field && (this.orderField = field);
      this.request();
    },
    createQuestion () {
      let name='create';
      this.$router.push({
        name: 'QuestionCreate',
        params: {
         name
        }
      })
    },
    changeTable (activeKey) {
      this.activeKey = activeKey;
      this.showSearch = this.activeKey === '1';
      this.hideForm = this.activeKey !== '1' || this.showForm;
      this.page = 1;
      this.request();
    },
    hiddenForm () {
      this.hideForm = true;
    },
     //查看详情
    goToDetail(idValue){
      this.$router.push({
        name: 'QuestionDetail',
        params: {
         id: idValue,
        },
        query: {
          form: this.$route.path
        }
      });
    }

  }
  // data () {
  //   return {
  //     columns,
  //     data: [],
  //     total:0,
  //     loading:true,
  //     pagination:{}
  //   }
  // },
  // created () {
  //   this.request();
  // },
  // methods: {
  //   ...mapActions([
  //     'getQuestionPage'
  //   ]),
  //   request () {
  //      let param={
  //       pageSize:10,
  //       pageNo:2,
  //     }
  //     this.pagination.pageSize=param.pageSize;
  //     this.pagination.current=param.pageNo;

  //     this.getQuestionPage(param).then(res => {
  //       const pagination = { ...this.pagination };
  //       pagination.total = res.total;

  //       this.loading = false;
  //       this.data = res.list;
  //       this.pagination = pagination;

  //     });
  //   },
  //     handleTableChange (pagination, filters, sorter) {
  //     const pager = { ...this.pagination };
  //     pager.current = pagination.current;
  //     this.pagination = pager;
  //     let param={
  //       pageSize:this.pagination.pageSize,
  //       pageNo:this.pagination.current
  //     }


  //     this.getQuestionPage(param).then(res => {

  //       const pagination = { ...this.pagination };
  //       pagination.total = res.total;
  //       this.loading = false;
  //       this.data = res.list;
  //       this.pagination = pagination;

  //     });

  //   },
    // 创建问题路由跳转
    // createQuestion () {

    //   let name='create';
    //   this.$router.push({
    //     name: 'QuestionCreate',
    //     params: {
    //      name
    //     }
    //   })
    // },
  //   mapping (cols) {
  //     this.columns = cols;
  //   },
  //   //查看详情
  //   goToDetail(idValue){
  //     let id;
  //    if(typeof(id)=='string'){
  //      id=parseInt(idValue);
  //    }
  //    else{
  //         id=idValue;
  //    }
  //      this.$router.push({
  //       name: 'QuestionDetail',
  //       params: {
  //        id
  //       }
  //     })
  //   }
  // }
}

</script>
<style lang="less" scoped>
  .container {
    margin-top: 16px;
    padding: 8px 16px 0;
    background-color: #FFFFFF;
    box-shadow: 0 2px 6px 0 rgba(0,38,71,0.12);
    border-radius: 4px;
    border-radius: 4px;
  }
  /deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td {
      padding: 16px 11px;
  }
 /deep/ .ant-form-item {
    display: flex;
  }
  /deep/ .ant-form-item-label {
    flex: .5;
  }
  /deep/ .ant-form-item-control-wrapper {
    flex: 1;
  }
</style>
