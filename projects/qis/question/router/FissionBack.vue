<template>
  <!-- 问题裂变回退 -->
  <a-modal
    :visible="visibleRollback"
    :mask-closable="false"
    class="fission-modal"
    width="1000px"
    @ok="FissionOk"
    @cancel="FissionCancel"
  >
    <template #title>
      {{ $t('fissionTable.fissionBackTitle') }}
      <span class="form-item-label-desc">{{ $t('fissionTable.minStatus') }}</span>
    </template>
    <p class="select-info">
      {{ $t('fissionApplication.selectCheck') }}
    </p>
    <a-table
      :data-source="dataFission"
      :pagination="true"
      :row-selection="rowSelection"
      row-key="id"
    >
      <template v-for="col in columnsFission">
        <a-table-column
          :key="col.dataIndex"
          v-bind="col"
          :title="$t(`fissionTable.${col.dataIndex}`)"
        >
          <template slot-scope="text, row">
            <a-tooltip v-if="col.dataIndex!=='reasonStatus'">
              <template #title>
                {{ text }}
              </template>
              <div v-if="col.dataIndex!=='reasonRegression'">
                {{ text }}
              </div>
            </a-tooltip>
            <!-- 回退状态 -->
            <template v-if="col.dataIndex==='reasonStatus'">
              <net-select
                :placeholder="$t('search.please_select')"
                url="/issue/v1/workflow/getBackNodesInfo"
                :query="{status: statusCode}"
                :cache="false"
                :transform="goBackStatusFun"
                :allow-clear="true"
                style="width:146px;height:32px;"
                show-search
                delay
                @change="(value) => reasonStatusChange(row, value)"
              >
              </net-select>
            </template>
            <!-- 回退理由 -->
            <template v-if="col.dataIndex==='reasonRegression'">
              <v-textarea
                :placeholder="$t('search.please_input')"
                style="width:230px;height:32px;"
                :limit="1000"
                allow-clear
                @change="(value) => reasonRegressionChange(row, value)"
              />
            </template>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-modal>
</template>
<script>
import {
  createNamespacedHelpers,
} from 'vuex';

import attachmentMix from '~~/issue-attachment.js';
import { enableScroll } from '~~/scroll.js';
// 问题裂变
const columnsFission = [
  {
    dataIndex: 'code',
    scopedSlots: {
      customRender: 'code',
    },
    width: 120,
  },
  {
    dataIndex: 'responsibleDepartmentName',
    scopedSlots: {
      customRender: 'responsibleDepartmentName',
    },
    width: 90,
  },
  {
    dataIndex: 'responsibleUserName',
    scopedSlots: {
      customRender: 'responsibleUserName',
    },
    width: 150,
  },
  {
    dataIndex: 'statusCode',
    scopedSlots: {
      customRender: 'statusCode',
    },
    width: 130,
  },
  {
    dataIndex: 'reasonStatus',
    scopedSlots: {
      customRender: 'reasonStatus',
    },
  },
  {
    dataIndex: 'reasonRegression',
    scopedSlots: {
      customRender: 'reasonRegression',
    },
  },

];

const {
  mapActions,
} = createNamespacedHelpers('question');
export default {
  name: 'ProblemFissionView',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
  },
  mixins: [attachmentMix],
  data () {
    return {
      columnsFission, // 问题回退列
      visibleRollback: false, // 裂变弹框是否显示
      taskId: '', // 主问题taskId
      id: '', // 主问题Id
      statusCode: '', // 当前主问题状态
      fissionList: [], // 问题裂变列表
      dataFission: [], // 问题回退数据源
      questionDetail: {
        title: '',
      },
      userId: this.$store.getters.getUser().id,
      selectedRowsList: [], // 选中行
      selectedList: [], // 选中的数据
    };
  },
  computed: {
    rowSelection () {
      const { selectedRowKeys } = this;
      return {
        // eslint-disable-next-line no-shadow
        onChange: (selectedRowKeys, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowsList = selectedRows;
        },
      };
    },
  },
  methods: {
    ...mapActions([
      'eidtQuestion', // 主问题详情
      'associatedTable', // 裂变表格
      'moveto', // 问题回退
      'backOrClose', // 问题关闭或者回退
    ]),
    // 初始化
    init (id, taskId, statusCode, masterIssueId) {
      this.visibleRollback = true;
      this.statusCode = statusCode;
      this.taskId = taskId;
      this.id = id;
      const param = {
        masterIssueId: masterIssueId === null || masterIssueId === '' ? id : masterIssueId,
        exclude: id,
      };
      this.associatedTable(param).then((res2) => {
        if (res2.length > 0) {
          this.dataFission = res2;
        }
      });
    },
    // 状态回退下拉框
    goBackStatusFun (input) {
      const optionArray = [];

      input.forEach((item) => {
        if (item.NODE_STATUS !== 'U200100') {
          optionArray.push({
            value: item.NODE_STATUS,
            label: item.NODE_DESC,
          });
        }
      });

      return optionArray;
    },
    // 回退下拉框改变
    reasonStatusChange (row, value) {
      row.reasonStatus = value;
    },
    // 回退理由改变
    reasonRegressionChange (row, value) {
      row.reasonRegression = value;
    },
    // 确定
    FissionOk () {
      enableScroll();
      if (this.selectedRowsList.length > 0) {
        this.goFissionIssueBack(this.selectedRowsList);
        this.visibleRollback = false;
      } else if (this.selectedRowsList.length === 0) {
        this.$message.error(this.$t('issue_action.fissionCheck'));
      }
    },
    // 子问题回退
    goFissionIssueBack (subIssueList) {
      let minStatus = null;
      subIssueList.forEach((subIssue, index) => {
        if (subIssue.reasonStatus) {
          if (minStatus) {
            minStatus = parseInt(subIssue.reasonStatus.substring(1, 9), 10) < parseInt(minStatus.substring(1, 9), 10) ? subIssue.reasonStatus : minStatus;
          } else {
            minStatus = subIssue.reasonStatus;
          }
          const param = {
            issueId: subIssue.id,
            fieldValue: null,
            fieldType: '1002',
          };
          this.backOrClose(param).then({});
          const transData = {
            businessKey: subIssue.id, // 子问题id
            processDefinitionKey: 'IRS3', // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: subIssue.taskId, //  任务id
            userId: this.userId, //  当前用户id,
            operationCode: '004',
            targetTaskDefinitionKey: subIssue.reasonStatus,
            comment: subIssue.reasonRegression || '',
            variables: {
              businessKey: subIssue.id, // 子问题id
              comment: subIssue.reasonRegression || '',
            },
          };
          this.moveto(transData).then(() => {
          });
        }
      });
      if (minStatus) {
      // 主问题回退
        const mainIssueTransData = {
          businessKey: this.id, // 问题id
          processDefinitionKey: 'IRS2', // IRS2  固定值
          subSys: 'irs', //  子系统编号
          taskId: this.taskId, //  任务id
          userId: this.userId, //  当前用户id
          targetTaskDefinitionKey: minStatus,
          comment: '', // 问题回退理由
          operationCode: '010',
          variables: {
            businessKey: this.id, // 问题id
            comment: '', // 问题回退理由
          },
        };
        this.moveto(mainIssueTransData).then((res) => {
          this.$message.success(this.$t('issue_action.rollbackSuccess'));
          this.$router.push({
            path: this.$route.query.form || '/',
          });
          this.$store.dispatch('refresh');
        });
      }
    },
    // 取消
    FissionCancel () {
      enableScroll();
      this.visibleRollback = false;
    },

  },
};
</script>
<style lang="less" scoped>
  .ant-advanced-search-form {
    border-radius: 6px;
    margin-bottom: 16px;
    background-color:#fff;
    /deep/ .ant-form-item-control{
        line-height:22px;
    }
    /deep/ .ant-form-item {
      display: flex;
    }

    /deep/ .ant-form-item-label {
      flex: 0.5;
    }

    /deep/ .ant-form-item-control-wrapper {
      flex: 1;
    }

    /deep/ .ant-form {
      max-width: none;
    }
  }
 .back-form{
   /deep/ .ant-form-item {
    margin-bottom: 8px;
   }
   /deep/ .ant-form-item-label {
    line-height:22px;
   }
 }
  .back-form{
      // 统一设置问题流程的字体颜色
      /deep/ .ant-form-item-label label {
        color: rgba(0, 0, 0, 0.45);
      }
      /deep/ .ant-form-item-control-wrapper p {
        color: rgba(0, 0, 0, 0.65);
      }
 }
 .modalTitle{
   font-size: 14px;
   color: rgba(0,0,0,0.85);
 }
 .icon-less{
   margin-left:11.5px;
 }
  /deep/ .ant-table-tbody > tr{
   padding:5px 2px;
 }
  /deep/ .ant-table-thead > tr{
   padding:5px 2px;
 }
  /deep/ .ant-table-tbody > tr > td{
   padding:5px 2px;
   max-width: 250px;
 }
  /deep/ .ant-table-thead > tr > th{
   padding:14px 2px;
   max-width: 250px;
 }
 /deep/ textarea.ant-input {
   height:32px;
 }
 /deep/ .v-textarea .ant-input{
   padding-bottom: 0!important;
 }
 /deep/ .v-textarea .v-input-helper{
   width:auto!important;
 }
  .fission-modal{
    top:200px;
    height:847px;
    padding-bottom: 0;
    /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, .45);
    font-size: 12px;
    }
  }
  .select-info{
    font-family: SourceHanSansCN-Medium;
    font-size: 14px;
    color: rgba(0,0,0,0.85);
    font-weight: 500;
    margin-bottom:16px;
  }
</style>
