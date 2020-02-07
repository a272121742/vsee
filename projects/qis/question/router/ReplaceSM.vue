<template>
  <!-- 重复关联 -->
  <a-modal
    :title="$t('issue_workflow.D1.changeSM')"
    :visible="visibleSM"
    :mask-closable="false"
    style="top:200px;!important"
    width="520px"
    @ok="SMOk"
    @cancel="SMCancel"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="SMCancel"
      >
        {{ $t('issue_action.cancel') }}
      </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="SMOk"
      >
        {{ $t('issue_action.commit') }}
      </a-button>
    </template>
    <a-form
      :form="smForm"
      class="ant-advanced-search-form"
    >
      <a-row>
        <a-col :span="22">
          <!-- 「模块」下拉 -->
          <a-form-item :label="$t('issue.smt')">
            <net-select
              v-decorator="[
                'smt',
                {rules:[{
                  required: true, message:$t('search.please_select')
                }]}
              ]"
              :placeholder="$t('search.please_select')"
              :transform="selectOptiondict"
              allow-clear
              url="/sys/dict?dictType=smt"
              @change="handleResponsibleUserId"
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 「问题管理负责人」下拉 -->
          <a-form-item :label="$t('issue.responsibleUserId')">
            <net-select
              v-decorator="[
                'responsibleUserId',
                {rules:[{
                  required: true, message:$t('search.please_select')
                }]}
              ]"
              :placeholder="$t('search.please_select')"
              :transform="responsibleUserOption"
              allow-clear
              :disabled="!record.smt"
              :cache="false"
              url="/issue/v1/workflow/getSysUser"
              :query="{productId: vehicleModelId, irtCode:source,irtModuleCode:record.smt,irtRole: 'monitor',userId:'${value}'}"
              @change="(value) => workflowRoleChange(value, 'monitor')"
            >
            </net-select>
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
  name: 'ReplaceSm',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
  },
  mixins: [attachmentMix, validator],
  data () {
    return {
      id: '', // 问题id
      detailList: [], // 保存工作流需要使用的参数
      statusNewCode: '', // 工作流状态
      visibleSM: false, // 重复关联弹框
      smForm: null, // 重复关联表单
      workflowRolesList: [],
      monitor: '', // 保存最初的monitor
      // 问题详情数组
      record: {
        smt: '',
        responsibleUserId: void 0,
      },
      workflowRoles: {},
      vehicleModelId: '',
      source: '',
    };
  },
  methods: {
    ...mapActions([
      'eidtQuestion',
      'replaceSMSave', // 更换SM保存
      'addActIdMembership',
      'updateChampionFun',
      'redistributionFun',
    ]),
    mapPropsToFieldsForm () {
      return createFormFields(this, [
        'smt', 'responsibleUserId',
      ], 'record');
    },
    // 初始化
    init (id, workflowRoles, detailList, statusNewCode) {
      this.workflowRoles = workflowRoles;
      this.monitor = workflowRoles.monitor;
      this.smForm = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm,
        onValuesChange: autoUpdateFileds(this, 'record'),
      });
      this.id = id;
      this.detailList = detailList;
      this.statusNewCode = statusNewCode;
      this.visibleSM = true;
      this.eidtQuestion(id).then((res) => {
        this.vehicleModelId = res.vehicleModelId;
        this.source = res.source;
        // 模块
        this.record.smt = res.smt;
        // 问题管理人
        this.record.responsibleUserId = res.responsibleUserId;

        this.smForm.updateFields(this.mapPropsToFieldsForm());
      });
    },
    // 模块下拉数据格式转换
    selectOptiondict (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.dictValue,
          label: item.dictName,
        });
      });
      return optionArray;
    },
    // 问题管理负责人下拉数据格式转化
    responsibleUserOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.USERID,
          label: item.USERNAMEZH,
        });
      });

      return optionArray;
    },
    // 模块改变
    handleResponsibleUserId () {
      this.record.responsibleUserId = void 0;
      this.smForm.updateFields(this.mapPropsToFieldsForm());
    },
    // 更换工作流角色人员
    workflowRoleChange (value, role) {
      if (value) this.workflowRoles[role] = value;
    },
    // 确定
    SMOk () {
      this.smForm.validateFields((err) => {
        if (!err) {
          const data = this.smForm.getFieldsValue();
          data.id = this.id;
          this.replaceSMSave(data).then((res) => {
            const param = {
              taskId: this.detailList.taskId,
              variable: {
                monitor: data.responsibleUserId,
              },
            };
            this.redistributionFun(param).then(() => {
              const championUpate = {
                issueId: this.id,
                userId: data.responsibleUserId,
                responsibleDepartmentId: '',
                message: '',
              };
              // 修改后台当前责任人
              this.updateChampionFun(championUpate).then(() => {
                // 修改后台角色人员信息
                this.workflowRoles.monitor = data.responsibleUserId;
                this.handelActRoles();
                this.$message.success(this.$t('issue_action.SMSuccess'));
                this.$router.push({
                  path: this.$route.query.form || '/',
                });
                this.$store.dispatch('refresh');
              });
            });
          });
        }
      });
    },
    // 保存工作流角色人物
    handelActRoles () {
      for (const item in this.workflowRoles) {
        this.workflowRolesList.push({
          groupId: item, userId: this.workflowRoles[item], procInstId: '', procDefKey: this.detailList.procDefKey, businessKey: this.id,
        });
      }
      this.addActIdMembership(this.workflowRolesList).then(() => {

      });
    },
    // 取消
    SMCancel () {
      this.visibleSM = false;
      // 将monitor还原
      this.workflowRoles.monitor = this.monitor;
      enableScroll();
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
