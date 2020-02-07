<template>
  <!-- 重复关联 -->
  <a-modal
    :title="$t('issue_action.duplicateAssociation')"
    :visible="visibleDuplicate"
    :mask-closable="false"
    style="top:200px;!important"
    width="720px"
    @ok="duplicateOk"
    @cancel="duplicateCancel"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="duplicateCancel"
      >
        {{ $t('issue_action.cancel') }}
      </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="duplicateOk"
      >
        {{ $t('issue_action.commit') }}
      </a-button>
    </template>
    <div style="font-size: 14px;color: rgba(0,0,0,0.85);">
      {{ $t('issue_action.duplicateQuestion') }}
    </div>
    <a-form class="ant-advanced-search-form back-form">
      <!-- 问题编号 -->
      <a-form-item
        :label="$t('issue.code')"
        self-update
      >
        <span>{{ questionDetail.code }}</span>
      </a-form-item>
      <!-- 问题标题 -->
      <a-form-item
        :label="$t('issue.title')"
        self-update
      >
        <span>{{ questionDetail.title }}</span>
      </a-form-item>
      <!-- 问题描述 -->
      <a-form-item
        :label="$t('issue.description')"
        self-update
      >
        <p style="max-height:56px;overflow-y:scroll">
          {{ questionDetail.description }}
        </p>
      </a-form-item>
      <!-- 问题责任人 -->
      <a-form-item
        :label="$t('issue_workflow.D1.champion')"
        self-update
      >
        <span>{{ questionDetail.responsibleUserName }}</span>
      </a-form-item>
      <!-- 问题责任部门 -->
      <a-form-item
        :label="$t('issue_workflow.D1.resposibleDepartment')"
        self-update
      >
        <span>{{ questionDetail.responsibleDepartmentName }}</span>
      </a-form-item>
    </a-form>
    <div style="font-size: 14px;color: rgba(0,0,0,0.85);">
      {{ $t('issue_action.selectAssociation') }}
    </div>
    <a-form
      :form="duplicateForm"
      class="ant-advanced-search-form"
    >
      <a-row>
        <a-col :span="22">
          <!-- 问题编号 -->
          <a-form-item
            :label="$t('issue.code')"
            self-update
          >
            <net-select
              v-decorator="[
                'correlationIssueId', {
                  rules: [
                    $v.required($t('search.please_select')),
                    $v.remote('/issue/v1/workflow/getCorrelationIssue', { id: '{{value}}' }, correlationIssueIdValiSuccess)
                  ]}
              ]"
              :transform="userOption"
              :placeholder="$t('search.please_select')"
              allow-clear
              delay
              url="/issue/v1/workflow/getCorrelationIssue"
              :query="{isCorrelation:'1',code:'${search}', exclude: id}"
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="back-form Association">
        <!-- 问题编号 -->
        <a-form-item
          :label="$t('issue.code')"
          self-update
        >
          <span>{{ associateDetail.code }}</span>
        </a-form-item>
        <!-- 问题标题 -->
        <a-form-item
          :label="$t('issue.title')"
          self-update
        >
          <span>{{ associateDetail.title }}</span>
        </a-form-item>
        <!-- 问题描述 -->
        <a-form-item
          :label="$t('issue.description')"
          self-update
        >
          <p style="max-height:56px;overflow-y:scroll">
            {{ associateDetail.description }}
          </p>
        </a-form-item>
        <!-- 问题责任人 -->
        <a-form-item
          :label="$t('issue_workflow.D1.champion')"
          self-update
        >
          <span>{{ associateDetail.responsibleUserName }}</span>
        </a-form-item>
        <!-- 问题责任部门 -->
        <a-form-item
          :label="$t('issue_workflow.D1.resposibleDepartment')"
          self-update
        >
          <span>{{ associateDetail.responsibleDepartmentName }}</span>
        </a-form-item>
      </div>
      <a-row>
        <a-col :span="22">
          <!-- 重复关联理由 -->
          <a-form-item
            :label="$t('issue_action.dpAssReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'correlationRemark',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              style="width:340px;"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 附件 -->
          <a-form-item>
            <template #label>
              {{ $t('issue_workflow.attachment') }}
            </template>
            <a-upload
              :headers="headers"
              :multiple="true"
              :file-list="clientFile"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021014')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record.serverfiles, clientFile)(info)"
            >
              <a-button icon="upload">
                <!-- 「上传文件」文本 -->
                {{ $t('issue_action.upload') }}
              </a-button>
              <span class="form-item-label-desc">
                {{ $t('issue_workflow.attachment_limit') }}
              </span>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import {
  autoUpdateFileds,
  createFormFields,
  validator,
} from '@util/formhelper.js';
import {
  createNamespacedHelpers,
} from 'vuex';
import attachmentMix from '~~/issue-attachment.js';
import { enableScroll } from '~~/scroll.js';

const {
  mapActions,
} = createNamespacedHelpers('question');
export default {
  name: 'DuplicateAssociation',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
  },
  mixins: [attachmentMix, validator],
  data () {
    return {
      id: '', // 问题id
      detailList: [], // 保存工作流需要使用的参数
      statusNewCode: '', // 工作流状态
      visibleDuplicate: false, // 重复关联弹框
      duplicateForm: null, // 重复关联表单
      clientFile: [], // 客户端显示附件
      questionDetail: {
        code: '', // 问题编号
        title: '', // 问题标题
        description: '', // 问题描述
        responsibleUserName: '', // 问题责任人
        responsibleDepartmentName: '', // 责任部门
      },
      associateDetail: {
        code: '', // 问题编号
        title: '', // 问题标题
        description: '', // 问题描述
        responsibleUserName: '', // 问题责任人
        responsibleDepartmentName: '', // 责任部门
      },
      // 问题详情数组
      record: {
        correlationIssueId: '',
        correlationRemark: '',
        serverfiles: [],
      },
    };
  },
  methods: {
    ...mapActions([
      'eidtQuestion',
      'getAssociated',
      'duplicateSave',
      'relatedDetail',
      'backOrClose',
      'closeSave',
      'speCloseWorkFlow',
    ]),
    mapPropsToFieldsForm () {
      return createFormFields(this, [
        'correlationIssueId', 'correlationRemark', 'serverfiles',
      ], 'record');
    },
    // 初始化
    init (id, detailList, statusNewCode) {
      this.id = id;
      this.detailList = detailList;
      this.statusNewCode = statusNewCode;
      this.visibleDuplicate = true;
      this.eidtQuestion(id).then((res) => {
        this.questionDetail.code = res.code;
        this.questionDetail.title = res.title;
        this.questionDetail.description = res.description;
        this.questionDetail.responsibleUserName = res.responsibleUserName;
        this.questionDetail.responsibleDepartmentName = res.responsibleDepartmentName;
      });
      this.duplicateForm = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm,
        onValuesChange: autoUpdateFileds(this, 'record'),
      });
      // 被关联问题详情
      this.relatedDetail(id).then((res) => {
        // 判断是否为空对象
        const arr = Object.keys(res);
        if (arr.length > 0) {
          this.associateDetail.code = res.issueDTO.code;
          this.associateDetail.title = res.issueDTO.title;
          this.associateDetail.description = res.issueDTO.description;
          this.associateDetail.responsibleUserName = res.issueDTO.responsibleUserName;
          this.associateDetail.responsibleDepartmentName = res.issueDTO.responsibleDepartmentName;
          this.clientFile = (res.issueExtendDTO.files || []).map(this.file2client);
          this.record.serverfiles = res.issueExtendDTO.files || [];
          this.record.correlationIssueId = res.issueExtendDTO.correlationIssueId;
          this.record.correlationRemark = res.issueExtendDTO.correlationRemark;
          this.duplicateForm.updateFields(this.mapPropsToFieldsForm());
        }
      });
    },
    getUploadUrl (path) {
      return this.$store.getters.getUrl(path);
    },
    correlationIssueIdValiSuccess (res) {
      const arr = Object.keys(res);
      if (arr.length === 0) {
        this.associateDetail.code = '';
        this.associateDetail.title = '';
        this.associateDetail.description = '';
        this.associateDetail.responsibleUserName = '';
        this.associateDetail.responsibleDepartmentName = '';
      }
      this.associateDetail.code = res[0].code;
      this.associateDetail.title = res[0].title;
      this.associateDetail.description = res[0].description;
      this.associateDetail.responsibleUserName = res[0].responsibleUserName;
      this.associateDetail.responsibleDepartmentName = res[0].responsibleDepartmentName;
    },
    // @TODO: 废弃这个方法，改为上面这个// 问题编号改变
    // questionChange (value = '') {
    //   this.getAssociated(value).then((res) => {
    //     this.associateDetail.code = res[0].code;
    //     this.associateDetail.title = res[0].title;
    //     this.associateDetail.description = res[0].description;
    //     this.associateDetail.responsibleUserName = res[0].responsibleUserName;
    //     this.associateDetail.responsibleDepartmentName = res[0].responsibleDepartmentName;
    //   });
    // },
    // 确定
    duplicateOk () {
      this.duplicateForm.validateFields((err) => {
        if (!err) {
          const data = this.duplicateForm.getFieldsValue();
          const transData = {
            businessKey: this.id, // 问题id
            processDefinitionKey: 'IRS2', // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.detailList.taskId, //  任务id
            userId: this.userId, //  当前用户id
            operationCode: '006',
            comment: data.correlationRemark, // 问题回退理由
            targetTaskDefinitionKey: 'E999999', // 固定值
            variables: {
              businessKey: this.id, // 问题id
              comment: data.correlationRemark, // 问题回退理由
              isDirectSerious: (this.detailList.gradeName === 'A' || this.detailList.gradeName
                === 'B') ? '1' : '0', // 是否直接极端严重事情
              isAB: (this.detailList.gradeName === 'A' || this.detailList.gradeName === 'B') ? '1'
                : '0',
            },
          };
          const param = {
            issueId: this.id,
            correlationIssueId: data.correlationIssueId,
            correlationRemark: data.correlationRemark,
            files: this.record.serverfiles,
          };

          this.duplicateSave(param).then((res) => {
            if (res) {
              this.visibleDuplicate = false;
              const paramClose = {
                issueId: this.id,
                fieldValue: this.statusNewCode,
                fieldType: '1002',
              };
              this.backOrClose(paramClose).then({});
              const paramCloseSave = {
                issueId: this.id,
              };
              this.closeSave(paramCloseSave).then(() => {
                this.speCloseWorkFlow(transData).then(() => {
                  this.$message.success(this.$t('issue_action.dupAssSucess'));
                  this.$router.push({
                    path: this.$route.query.form || '/',
                  });
                  this.$store.dispatch('refresh');
                  enableScroll();
                });
              });
            }
          });
        }
      });
    },
    // 取消
    duplicateCancel () {
      this.visibleDuplicate = false;
      enableScroll();
    },
    // 关联问题编号下拉框
    userOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.code,
        });
      });
      return optionArray;
    },
  },
};
</script>
<style lang="less" scoped>
.ant-advanced-search-form {
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: #fff;
  /deep/ .ant-form-item-control {
    line-height: 22px;
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
.back-form {
  /deep/ .ant-form-item {
    margin-bottom: 8px;
  }
  /deep/ .ant-form-item-label {
    line-height: 22px;
  }
}
.back-form {
  // 统一设置问题流程的字体颜色
  /deep/ .ant-form-item-label label {
    color: rgba(0, 0, 0, 0.45);
  }
  /deep/ .ant-form-item-control-wrapper p {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
