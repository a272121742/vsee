<template>
  <!-- 问题裂变 -->
  <a-modal
    :visible="visibleFisson"
    :mask-closable="false"
    width="720px"
    class="fission-modal"
    @ok="FissionOk"
    @cancel="FissionCancel"
  >
    <template #title>
      {{ $t('fissionApplication.proFissApplication') }}
      <span class="form-item-label-desc">{{ $t('fissionApplication.proFissApplicationLimit') }}</span>
    </template>
    <template slot="footer">
      <a-button
        key="back"
        @click="FissionCancel"
      >
        {{ $t('issue_action.cancel') }}
      </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="FissionOk"
      >
        {{ $t('issue_action.commit') }}
      </a-button>
    </template>
    <!-- 子问题一 -->
    <a-form
      class="ant-advanced-search-form back-form"
      :form="FissApplicationForm1"
    >
      <div class="modalTitle">
        {{ $t('fissionApplication.subquestion1') }}
      </div>
      <!-- 问题标题 -->
      <a-row>
        <a-col :span="22">
          <a-form-item
            :label="$t('issue.title')"
            self-update
          >
            <span>{{ questionDetail.title }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 问题责任部门 -->
      <a-row>
        <a-col :span="22">
          <!-- 「责任部门」下拉 -->
          <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
            <net-single-tree-select
              v-decorator="['subIssueDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
              :transform="responseDeptTreeTransform"
              :placeholder="$t('search.please_select')"
              :query="{ nameCode: '${value}' }"
              allow-clear
              style="height:32px;"
              show-search
              url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
              @change="owerDeptChange1"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 责任人 -->
      <a-row>
        <a-col :span="22">
          <a-form-item :label="$t('issue_workflow.D1.champion')">
            <net-select
              v-decorator="[
                'subIssueChampion',
                {rules:[{required:true, message:$t('search.please_select') }]}
              ]"
              :placeholder="$t('search.please_select')"
              :disabled="!record1.subIssueDepartment"
              url="/masterdata/v1/workflowgroupmember"
              :query="{workflowGroupNameCode: record1.subIssueDepartment}"
              :cache="false"
              :transform="userOption"
              :allow-clear="true"
              style="height:32px;"
              show-search
              delay
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 裂变理由 -->
          <a-form-item
            :label="$t('fissionApplication.fissionReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'fissionReason',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'optCounter'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'id'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'subIssueCode'
          ]"
        />
      </a-form-item>
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
              :file-list="clientFile1"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record1.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021015')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record1.serverfiles, clientFile1)(info)"
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
    <!-- 子问题二 -->
    <a-form
      class="ant-advanced-search-form back-form"
      :form="FissApplicationForm2"
    >
      <div class="modalTitle">
        {{ $t('fissionApplication.subquestion2') }}
      </div>
      <!-- 问题标题 -->
      <a-row>
        <a-col :span="22">
          <a-form-item
            :label="$t('issue.title')"
            self-update
          >
            <span>{{ questionDetail.title }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 问题责任部门 -->
      <a-row>
        <a-col :span="22">
          <!-- 「责任部门」下拉 -->
          <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
            <net-single-tree-select
              v-decorator="['subIssueDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
              :transform="responseDeptTreeTransform"
              :placeholder="$t('search.please_select')"
              :query="{ nameCode: '${value}' }"
              allow-clear
              style="height:32px;"
              show-search
              url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
              @change="owerDeptChange2"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 责任人 -->
      <a-row>
        <a-col :span="22">
          <a-form-item :label="$t('issue_workflow.D1.champion')">
            <net-select
              v-decorator="[
                'subIssueChampion',
                {rules:[{required:true, message:$t('search.please_select') }]}
              ]"
              :placeholder="$t('search.please_select')"
              :disabled="!record2.subIssueDepartment"
              url="/masterdata/v1/workflowgroupmember"
              :query="{workflowGroupNameCode: record2.subIssueDepartment}"
              :cache="false"
              :transform="userOption"
              :allow-clear="true"
              style="height:32px;"
              show-search
              delay
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 裂变理由 -->
          <a-form-item
            :label="$t('fissionApplication.fissionReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'fissionReason',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'optCounter'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'id'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'subIssueCode'
          ]"
        />
      </a-form-item>
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
              :file-list="clientFile2"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record2.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021015')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record2.serverfiles, clientFile2)(info)"
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
      <a-row>
        <a-col>
          <a-form-item
            label=" "
            :colon="false"
            :label-col="{span: 2, offset: 20}"
          >
            <v-icon
              type="icondccj_outlined1"
              class="icon-add"
              @click="flagAddButton3&&addChild('3')"
            ></v-icon>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 子问题三 -->
    <a-form
      v-if="FissionVisible3"
      class="ant-advanced-search-form back-form"
      :form="FissApplicationForm3"
    >
      <div class="modalTitle">
        {{ $t('fissionApplication.subquestion3') }}
      </div>
      <!-- 问题标题 -->
      <a-row>
        <a-col :span="22">
          <a-form-item
            :label="$t('issue.title')"
            self-update
          >
            <span>{{ questionDetail.title }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 问题责任部门 -->
      <a-row>
        <a-col :span="22">
          <!-- 「责任部门」下拉 -->
          <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
            <net-single-tree-select
              v-decorator="['subIssueDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
              :transform="responseDeptTreeTransform"
              :placeholder="$t('search.please_select')"
              :query="{ nameCode: '${value}' }"
              allow-clear
              style="height:32px;"
              show-search
              url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
              @change="owerDeptChange3"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 责任人 -->
      <a-row>
        <a-col :span="22">
          <a-form-item :label="$t('issue_workflow.D1.champion')">
            <net-select
              v-decorator="[
                'subIssueChampion',
                {rules:[{required:true, message:$t('search.please_select') }]}
              ]"
              :placeholder="$t('search.please_select')"
              :disabled="!record3.subIssueDepartment"
              url="/masterdata/v1/workflowgroupmember"
              :query="{workflowGroupNameCode: record3.subIssueDepartment}"
              :cache="false"
              :transform="userOption"
              :allow-clear="true"
              style="height:32px;"
              show-search
              delay
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 裂变理由 -->
          <a-form-item
            :label="$t('fissionApplication.fissionReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'fissionReason',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'optCounter'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'id'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'subIssueCode'
          ]"
        />
      </a-form-item>
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
              :file-list="clientFile3"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record3.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021015')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record3.serverfiles, clientFile3)(info)"
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
      <a-row>
        <a-col>
          <a-form-item
            label=" "
            :colon="false"
            :label-col="{span: 5, offset: 19}"
          >
            <v-icon
              type="icondccj_outlined1"
              class="icon-add"
              @click="flagAddButton4&&addChild('4')"
            ></v-icon>
            <v-icon
              type="iconsc_outlined2"
              class="icon-less"
              @click="flagdeleteButton3&&deleteChild('3')"
            ></v-icon>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 子问题四 -->
    <a-form
      v-if="FissionVisible4"
      class="ant-advanced-search-form back-form"
      :form="FissApplicationForm4"
    >
      <div class="modalTitle">
        {{ $t('fissionApplication.subquestion4') }}
      </div>
      <!-- 问题标题 -->
      <a-row>
        <a-col :span="22">
          <a-form-item
            :label="$t('issue.title')"
            self-update
          >
            <span>{{ questionDetail.title }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 问题责任部门 -->
      <a-row>
        <a-col :span="22">
          <!-- 「责任部门」下拉 -->
          <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
            <net-single-tree-select
              v-decorator="['subIssueDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
              :transform="responseDeptTreeTransform"
              :placeholder="$t('search.please_select')"
              :query="{ nameCode: '${value}' }"
              allow-clear
              style="height:32px;"
              show-search
              url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
              @change="owerDeptChange4"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 责任人 -->
      <a-row>
        <a-col :span="22">
          <a-form-item :label="$t('issue_workflow.D1.champion')">
            <net-select
              v-decorator="[
                'subIssueChampion',
                {rules:[{required:true, message:$t('search.please_select') }]}
              ]"
              :placeholder="$t('search.please_select')"
              :disabled="!record4.subIssueDepartment"
              url="/masterdata/v1/workflowgroupmember"
              :query="{workflowGroupNameCode: record4.subIssueDepartment}"
              :cache="false"
              :transform="userOption"
              :allow-clear="true"
              style="height:32px;"
              show-search
              delay
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 裂变理由 -->
          <a-form-item
            :label="$t('fissionApplication.fissionReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'fissionReason',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'optCounter'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'id'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'subIssueCode'
          ]"
        />
      </a-form-item>
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
              :file-list="clientFile4"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record4.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021015')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record4.serverfiles, clientFile4)(info)"
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
      <a-row>
        <a-col>
          <a-form-item
            label=" "
            :colon="false"
            :label-col="{span: 5, offset: 19}"
          >
            <v-icon
              type="icondccj_outlined1"
              class="icon-add"
              @click="flagAddButton5&&addChild('5')"
            ></v-icon>
            <v-icon
              type="iconsc_outlined2"
              class="icon-less"
              @click="flagdeleteButton4&&deleteChild('4')"
            ></v-icon>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 子问题五 -->
    <a-form
      v-if="FissionVisible5"
      class="ant-advanced-search-form back-form"
      :form="FissApplicationForm5"
    >
      <div class="modalTitle">
        {{ $t('fissionApplication.subquestion5') }}
      </div>
      <!-- 问题标题 -->
      <a-row>
        <a-col :span="22">
          <a-form-item
            :label="$t('issue.title')"
            self-update
          >
            <span>{{ questionDetail.title }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 问题责任部门 -->
      <a-row>
        <a-col :span="22">
          <!-- 「责任部门」下拉 -->
          <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
            <net-single-tree-select
              v-decorator="['subIssueDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
              :transform="responseDeptTreeTransform"
              :placeholder="$t('search.please_select')"
              :query="{ nameCode: '${value}' }"
              allow-clear
              style="height:32px;"
              show-search
              url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
              @change="owerDeptChange5"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 责任人 -->
      <a-row>
        <a-col :span="22">
          <a-form-item :label="$t('issue_workflow.D1.champion')">
            <net-select
              v-decorator="[
                'subIssueChampion',
                {rules:[{required:true, message:$t('search.please_select') }]}
              ]"
              :placeholder="$t('search.please_select')"
              :disabled="!record5.subIssueDepartment"
              url="/masterdata/v1/workflowgroupmember"
              :query="{workflowGroupNameCode: record5.subIssueDepartment}"
              :cache="false"
              :transform="userOption"
              :allow-clear="true"
              style="height:32px;"
              show-search
              delay
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="22">
          <!-- 裂变理由 -->
          <a-form-item
            :label="$t('fissionApplication.fissionReasons')"
            self-update
          >
            <v-textarea
              v-decorator="[
                'fissionReason',
                {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
              ]"
              :placeholder="$t('search.please_input')"
              :limit="160"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'optCounter'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'id'
          ]"
        />
      </a-form-item>
      <a-form-item
        v-show="false"
      >
        <v-input
          v-decorator="[
            'subIssueCode'
          ]"
        />
      </a-form-item>
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
              :file-list="clientFile5"
              :before-upload="beforeUpload"
              :remove="file => removeFile(record5.serverfiles)(file)"
              :action="getUploadUrl('/issue/v1/file/upload?recType=10021015')"
              name="file"
              @preview="download"
              @change="info => changeFileList(record5.serverfiles, clientFile5)(info)"
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
      <a-row>
        <a-col>
          <a-form-item
            label=" "
            :colon="false"
            :label-col="{span: 5, offset: 19}"
          >
            <v-icon
              type="iconsc_outlined2"
              class="icon-less"
              @click="flagdeleteButton5&&deleteChild('5')"
            ></v-icon>
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
} from '@util/formhelper.js';
import {
  createNamespacedHelpers,
} from 'vuex';
import { transform, treeTransform } from '@util/datahelper.js';
import attachmentMix from '~~/issue-attachment.js';
import { enableScroll } from '~~/scroll.js';

const {
  mapActions,
} = createNamespacedHelpers('question');
export default {
  name: 'ProblemFission',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue'),
    VInput: () => import('@comp/form/VInput.vue'),
  },
  mixins: [attachmentMix],
  data () {
    return {
      listLength: 0, // 从接口读取的列表长度
      id: '', // 问题id
      detailList: [], // 保存工作流需要使用的参数
      code: '', // 主问题编号
      modalType: '', // 弹框类型（创建/编辑）
      isCommitAct: false, // 是否提交工作流
      statusNewCode: '', // 工作流状态
      visibleFisson: false, // 问题裂变弹框
      FissApplicationForm1: null, // 问题裂变表单
      FissApplicationForm2: null,
      FissApplicationForm3: null,
      FissApplicationForm4: null,
      FissApplicationForm5: null,
      flagAddButton3: true, // 添加子问题3的按钮是否可以点击
      flagAddButton4: true, // 添加子问题4的是否可以点击
      flagAddButton5: true, // 添加子问题4的是否可以点击
      FissionVisible3: false, // 子问题3是否显示
      FissionVisible4: false, // 子问题4是否显示
      FissionVisible5: false, // 子问题5是否显示
      flagdeleteButton3: true, // 子问题3是否可以删除
      flagdeleteButton4: true, // 子问题4是否可以删除
      flagdeleteButton5: true, // 子问题5是否可以删除
      clientFile1: [], // 客户端显示附件
      clientFile2: [], // 客户端显示附件
      clientFile3: [], // 客户端显示附件
      clientFile4: [], // 客户端显示附件
      clientFile5: [], // 客户端显示附件
      issueId3: '', // 子问题三的id
      issueId4: '', // 子问题四的id
      issueId5: '', // 子问题五的id
      record1: {
        subIssueDepartment: '',
        subIssueChampion: void 0,
        fissionReason: '',
        serverfiles: [],
        optCounter: '',
        id: '',
        subIssueCode: '',
      },
      record2: {
        subIssueDepartment: '',
        subIssueChampion: void 0,
        fissionReason: '',
        serverfiles: [],
        optCounter: '',
        id: '',
        subIssueCode: '',
      },
      record3: {
        subIssueDepartment: '',
        subIssueChampion: void 0,
        fissionReason: '',
        serverfiles: [],
        optCounter: '',
        id: '',
        subIssueCode: '',
      },
      record4: {
        subIssueDepartment: '',
        subIssueChampion: void 0,
        fissionReason: '',
        serverfiles: [],
        optCounter: '',
        id: '',
        subIssueCode: '',
      },
      record5: {
        subIssueDepartment: '',
        subIssueChampion: void 0,
        fissionReason: '',
        serverfiles: [],
        optCounter: '',
        id: '',
        subIssueCode: '',
      },
      questionDetail: {
        title: '',
      },
    };
  },
  methods: {
    ...mapActions([
      'eidtQuestion', // 主问题详情
      'fissionSave', // 裂变保存
      'fissionDetail', // 裂变信息
      'fissionDelete', // 裂变删除
      'fissionEdit', // 裂变修改
      'childSave', // 子问题保存
      'workFlowSubmitNew', // 提交工作流
      'issueIsPission', // 主问题问题裂变修改
    ]),
    mapPropsToFieldsForm1 () {
      return createFormFields(this, [
        'subIssueDepartment', 'subIssueChampion', 'fissionReason', 'serverfiles', 'subIssueCode', 'optCounter', 'id',
      ], 'record1');
    },
    mapPropsToFieldsForm2 () {
      return createFormFields(this, [
        'subIssueDepartment', 'subIssueChampion', 'fissionReason', 'serverfiles',
        'optCounter', 'subIssueCode', 'id',
      ], 'record2');
    },
    mapPropsToFieldsForm3 () {
      return createFormFields(this, [
        'subIssueDepartment', 'subIssueChampion', 'fissionReason', 'serverfiles',
        'optCounter', 'subIssueCode', 'id',
      ], 'record3');
    },
    mapPropsToFieldsForm4 () {
      return createFormFields(this, [
        'subIssueDepartment', 'subIssueChampion', 'fissionReason', 'serverfiles',
        'optCounter', 'subIssueCode', 'id',
      ], 'record4');
    },
    mapPropsToFieldsForm5 () {
      return createFormFields(this, [
        'subIssueDepartment', 'subIssueChampion', 'fissionReason', 'serverfiles',
        'optCounter', 'subIssueCode', 'id',
      ], 'record5');
    },
    // 初始化
    init (name, id, detailList, statusNewCode, isCommitAct) {
      this.modalType = name;
      this.id = id;
      this.code = detailList.code;
      this.detailList = detailList;
      this.statusNewCode = statusNewCode;
      this.visibleFisson = true;
      this.isCommitAct = isCommitAct;
      this.FissApplicationForm1 = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm1,
        onValuesChange: autoUpdateFileds(this, 'record1'),
      });
      this.FissApplicationForm2 = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm2,
        onValuesChange: autoUpdateFileds(this, 'record2'),
      });
      this.FissApplicationForm3 = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm3,
        onValuesChange: autoUpdateFileds(this, 'record3'),
      });
      this.FissApplicationForm4 = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm4,
        onValuesChange: autoUpdateFileds(this, 'record4'),
      });
      this.FissApplicationForm5 = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm5,
        onValuesChange: autoUpdateFileds(this, 'record5'),
      });
      // 问题详情
      this.eidtQuestion(id).then((res) => {
        this.questionDetail.title = res.title;
      });
      if (this.modalType === 'edit') {
        // 查询裂变信息
        this.fissionDetail(id).then((res) => {
          const { length } = res;
          this.listLength = res.length;
          // eslint-disable-next-line default-case
          switch (length) {
          case 2:
            this.record1.subIssueDepartment = res[0].subIssueDepartment;
            this.record1.subIssueChampion = res[0].subIssueChampion;
            this.record1.fissionReason = res[0].fissionReason;
            this.record1.serverfiles = res[0].files;
            this.record1.optCounter = res[0].optCounter;
            this.record1.subIssueCode = res[0].subIssueCode;
            this.record1.id = res[0].id;
            this.clientFile1 = (res[0].files || []).map(this.file2client);
            this.FissApplicationForm1.updateFields(this.mapPropsToFieldsForm1());
            this.record2.subIssueDepartment = res[1].subIssueDepartment;
            this.record2.subIssueChampion = res[1].subIssueChampion;
            this.record2.fissionReason = res[1].fissionReason;
            this.record2.serverfiles = res[1].files;
            this.record2.optCounter = res[1].optCounter;
            this.record2.subIssueCode = res[1].subIssueCode;
            this.record2.id = res[1].id;
            this.clientFile2 = (res[1].files || []).map(this.file2client);
            this.FissApplicationForm2.updateFields(this.mapPropsToFieldsForm2());
            break;
          case 3:
            this.FissionVisible3 = true;
            this.record1.subIssueDepartment = res[0].subIssueDepartment;
            this.record1.subIssueChampion = res[0].subIssueChampion;
            this.record1.fissionReason = res[0].fissionReason;
            this.record1.serverfiles = res[0].files;
            this.record1.optCounter = res[0].optCounter;
            this.record1.subIssueCode = res[0].subIssueCode;
            this.record1.id = res[0].id;
            this.clientFile1 = (res[0].files || []).map(this.file2client);
            this.FissApplicationForm1.updateFields(this.mapPropsToFieldsForm1());
            this.record2.subIssueDepartment = res[1].subIssueDepartment;
            this.record2.subIssueChampion = res[1].subIssueChampion;
            this.record2.fissionReason = res[1].fissionReason;
            this.record2.serverfiles = res[1].files;
            this.record2.subIssueCode = res[1].subIssueCode;
            this.record2.id = res[1].id;
            this.record2.optCounter = res[1].optCounter;
            this.clientFile2 = (res[1].files || []).map(this.file2client);
            this.FissApplicationForm2.updateFields(this.mapPropsToFieldsForm2());
            this.record3.subIssueDepartment = res[2].subIssueDepartment;
            this.record3.subIssueChampion = res[2].subIssueChampion;
            this.record3.fissionReason = res[2].fissionReason;
            this.record3.serverfiles = res[2].files;
            this.record3.subIssueCode = res[2].subIssueCode;
            this.record3.id = res[2].id;
            this.record3.optCounter = res[2].optCounter;
            this.issueId3 = res[2].id;
            this.clientFile3 = (res[2].files || []).map(this.file2client);
            this.FissApplicationForm3.updateFields(this.mapPropsToFieldsForm3());
            break;
          case 4:
            this.FissionVisible3 = true;
            this.FissionVisible4 = true;
            this.record1.subIssueDepartment = res[0].subIssueDepartment;
            this.record1.subIssueChampion = res[0].subIssueChampion;
            this.record1.fissionReason = res[0].fissionReason;
            this.record1.serverfiles = res[0].files;
            this.record1.id = res[0].id;
            this.record1.subIssueCode = res[0].subIssueCode;
            this.record1.optCounter = res[0].optCounter;
            this.clientFile1 = (res[0].files || []).map(this.file2client);
            this.FissApplicationForm1.updateFields(this.mapPropsToFieldsForm1());
            this.record2.subIssueDepartment = res[1].subIssueDepartment;
            this.record2.subIssueChampion = res[1].subIssueChampion;
            this.record2.fissionReason = res[1].fissionReason;
            this.record2.subIssueCode = res[1].subIssueCode;
            this.record2.serverfiles = res[1].files;
            this.record2.id = res[1].id;
            this.record2.optCounter = res[1].optCounter;
            this.clientFile2 = (res[1].files || []).map(this.file2client);
            this.FissApplicationForm2.updateFields(this.mapPropsToFieldsForm2());
            this.record3.subIssueDepartment = res[2].subIssueDepartment;
            this.record3.subIssueChampion = res[2].subIssueChampion;
            this.record3.fissionReason = res[2].fissionReason;
            this.record3.serverfiles = res[2].files;
            this.record3.subIssueCode = res[2].subIssueCode;
            this.record3.id = res[2].id;
            this.record3.optCounter = res[2].optCounter;
            this.issueId3 = res[2].id;
            this.clientFile3 = (res[2].files || []).map(this.file2client);
            this.FissApplicationForm3.updateFields(this.mapPropsToFieldsForm3());
            this.record4.subIssueDepartment = res[3].subIssueDepartment;
            this.record4.subIssueChampion = res[3].subIssueChampion;
            this.record4.fissionReason = res[3].fissionReason;
            this.record4.serverfiles = res[3].files;
            this.record4.id = res[3].id;
            this.record4.subIssueCode = res[3].subIssueCode;
            this.record4.optCounter = res[3].optCounter;
            this.issueId4 = res[3].id;
            this.clientFile4 = (res[3].files || []).map(this.file2client);
            this.FissApplicationForm4.updateFields(this.mapPropsToFieldsForm4());
            break;
          case 5:
            this.FissionVisible3 = true;
            this.FissionVisible4 = true;
            this.FissionVisible5 = true;
            this.record1.subIssueDepartment = res[0].subIssueDepartment;
            this.record1.subIssueChampion = res[0].subIssueChampion;
            this.record1.fissionReason = res[0].fissionReason;
            this.record1.serverfiles = res[0].files;
            this.record1.id = res[0].id;
            this.record1.subIssueCode = res[0].subIssueCode;
            this.record1.optCounter = res[0].optCounter;
            this.clientFile1 = (res[0].files || []).map(this.file2client);
            this.FissApplicationForm1.updateFields(this.mapPropsToFieldsForm1());
            this.record2.subIssueDepartment = res[1].subIssueDepartment;
            this.record2.subIssueChampion = res[1].subIssueChampion;
            this.record2.fissionReason = res[1].fissionReason;
            this.record2.serverfiles = res[1].files;
            this.record2.id = res[1].id;
            this.record2.subIssueCode = res[1].subIssueCode;
            this.record2.optCounter = res[1].optCounter;
            this.clientFile2 = (res[1].files || []).map(this.file2client);
            this.FissApplicationForm2.updateFields(this.mapPropsToFieldsForm2());
            this.record3.subIssueDepartment = res[2].subIssueDepartment;
            this.record3.subIssueChampion = res[2].subIssueChampion;
            this.record3.fissionReason = res[2].fissionReason;
            this.record3.serverfiles = res[2].files;
            this.record3.subIssueCode = res[2].subIssueCode;
            this.record3.id = res[2].id;
            this.record3.optCounter = res[2].optCounter;
            this.clientFile3 = (res[2].files || []).map(this.file2client);
            this.issueId3 = res[2].id;
            this.FissApplicationForm3.updateFields(this.mapPropsToFieldsForm3());
            this.record4.subIssueDepartment = res[3].subIssueDepartment;
            this.record4.subIssueChampion = res[3].subIssueChampion;
            this.record4.fissionReason = res[3].fissionReason;
            this.record4.subIssueCode = res[3].subIssueCode;
            this.record4.id = res[3].id;
            this.record4.serverfiles = res[3].files;
            this.record4.optCounter = res[3].optCounter;
            this.clientFile4 = (res[3].files || []).map(this.file2client);
            this.issueId4 = res[3].id;
            this.FissApplicationForm4.updateFields(this.mapPropsToFieldsForm4());
            this.record5.subIssueDepartment = res[4].subIssueDepartment;
            this.record5.subIssueChampion = res[4].subIssueChampion;
            this.record5.fissionReason = res[4].fissionReason;
            this.record5.serverfiles = res[4].files;
            this.record5.subIssueCode = res[4].subIssueCode;
            this.record5.id = res[4].id;
            this.record5.optCounter = res[4].optCounter;
            this.clientFile5 = (res[4].files || []).map(this.file2client);
            this.issueId5 = res[4].id;
            this.FissApplicationForm5.updateFields(this.mapPropsToFieldsForm5());
            break;
          }
        });
      }
    },
    // 责任人下拉框转换
    userOption (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.userId,
          label: item.realName,
        });
      });

      return optionArray;
    },
    // 责任部门-树 转化
    responseDeptTreeTransform: treeTransform(transform({
      value: 'code', label: 'name', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    // 责任部门改变
    owerDeptChange1 () {
      // 改变的时候将表单清空
      this.record1.subIssueChampion = void 0;
      this.FissApplicationForm1.updateFields(this.mapPropsToFieldsForm1());
    },
    owerDeptChange2 () {
      this.record2.subIssueChampion = void 0;
      this.FissApplicationForm2.updateFields(this.mapPropsToFieldsForm2());
    },
    owerDeptChange3 () {
      this.record3.subIssueChampion = void 0;
      this.FissApplicationForm3.updateFields(this.mapPropsToFieldsForm3());
    },
    owerDeptChange4 () {
      this.record4.subIssueChampion = void 0;
      this.FissApplicationForm4.updateFields(this.mapPropsToFieldsForm4());
    },
    owerDeptChange5 () {
      this.record5.subIssueChampion = void 0;
      this.FissApplicationForm5.updateFields(this.mapPropsToFieldsForm5());
    },
    // 添加子问题
    addChild (number) {
      //  子问题三
      if (number === '3') {
        this.flagAddButton3 = false;
        this.FissionVisible3 = true;
        setTimeout(() => {
          this.flagAddButton3 = true;
        }, 5000);
        // 添加的时候清空表单
        this.FissApplicationForm3.resetFields();
        this.clientFile3 = [];
      }
      // 子问题四
      if (number === '4') {
        this.flagAddButton4 = false;
        this.FissionVisible4 = true;
        setTimeout(() => {
          this.flagAddButton4 = true;
        }, 5000);
        this.FissApplicationForm4.resetFields();
        this.clientFile4 = [];
      }
      // 子问题五
      if (number === '5') {
        this.flagAddButton5 = false;
        this.FissionVisible5 = true;
        setTimeout(() => {
          this.flagAddButton5 = true;
        }, 5000);
        this.FissApplicationForm5.resetFields();
        this.clientFile5 = [];
      }
    },
    // 删除子问题
    deleteChild (number) {
      const ids = [];
      if (number === '3') {
        this.flagdeleteButton3 = false;
        this.FissionVisible3 = false;
        setTimeout(() => {
          this.flagdeleteButton3 = true;
        }, 5000);
        // 从数据库读出来的子问题个数不小于当前操作的子问题个数 ，调用删除接口
        if (this.modalType === 'edit' && (this.listLength > parseInt(number, 10) || this.listLength === parseInt(number, 10))) {
          ids.push(this.issueId3);
        }
      }
      if (number === '4') {
        this.flagdeleteButton4 = false;
        this.FissionVisible4 = false;
        setTimeout(() => {
          this.flagdeleteButton4 = true;
        }, 5000);
        if (this.modalType === 'edit' && (this.listLength > parseInt(number, 10) || this.listLength === parseInt(number, 10))) {
          ids.push(this.issueId4);
        }
      }
      if (number === '5') {
        this.flagdeleteButton5 = false;
        this.FissionVisible5 = false;
        setTimeout(() => {
          this.flagdeleteButton5 = true;
        }, 5000);
        if (this.modalType === 'edit' && (this.listLength > parseInt(number, 10) || this.listLength === parseInt(number, 10))) {
          ids.push(this.issueId5);
        }
      }
      // 如果是编辑的时候点击删除，并且从数据库读出来的子问题个数不小于当前操作的子问题个数 ，调用删除接口
      if (this.modalType === 'edit' && (this.listLength > parseInt(number, 10) || this.listLength === parseInt(number, 10))) {
        const param = {
          ids,
        };
        this.fissionDelete(param).then((res) => {
        });
      }
    },
    getUploadUrl (path) {
      return this.$store.getters.getUrl(path);
    },
    // 确定
    FissionOk () {
      enableScroll();
      //  子问题一
      let data1 = {};
      let data2 = {};
      let data3 = {};
      let data4 = {};
      let data5 = {};
      let flagSubmit = true;
      this.FissApplicationForm1.validateFields((err) => {
        if (!err) {
          data1 = this.FissApplicationForm1.getFieldsValue();
          data1.files = this.record1.serverfiles;
          data1.issueId = this.id;
          data1.subIssueCode = this.code;
          data1.subIssueTitle = this.questionDetail.title;
        } else {
          flagSubmit = false;
        }
      });
      //  子问题二
      this.FissApplicationForm2.validateFields((err) => {
        if (!err) {
          data2 = this.FissApplicationForm2.getFieldsValue();
          data2.files = this.record2.serverfiles;
          data2.issueId = this.id;
          data2.subIssueCode = this.code;
          data2.subIssueTitle = this.questionDetail.title;
        } else {
          flagSubmit = false;
        }
      });

      //  子问题三
      this.FissApplicationForm3.validateFields((err) => {
        if (!err) {
          data3 = this.FissApplicationForm3.getFieldsValue();
          data3.files = this.record3.serverfiles;
          data3.issueId = this.id;
          data3.subIssueCode = this.code;
          data3.subIssueTitle = this.questionDetail.title;
        } else {
          flagSubmit = false;
        }
      });

      //  子问题四
      this.FissApplicationForm4.validateFields((err) => {
        if (!err) {
          data4 = this.FissApplicationForm4.getFieldsValue();
          data4.files = this.record4.serverfiles;
          data4.issueId = this.id;
          data4.subIssueCode = this.code;
          data4.subIssueTitle = this.questionDetail.title;
        } else {
          flagSubmit = false;
        }
      });

      //  子问题五
      this.FissApplicationForm5.validateFields((err) => {
        if (!err) {
          data5 = this.FissApplicationForm5.getFieldsValue();
          data5.files = this.record5.serverfiles;
          data5.issueId = this.id;
          data5.subIssueCode = this.code;
          data5.subIssueTitle = this.questionDetail.title;
        } else {
          flagSubmit = false;
        }
      });
      const param = [];
      if (data1.subIssueChampion !== undefined) {
        param.push(data1);
      }
      if (data2.subIssueChampion !== undefined) {
        param.push(data2);
      }
      if (data3.subIssueChampion !== undefined) {
        param.push(data3);
      }
      if (data4.subIssueChampion !== undefined) {
        param.push(data4);
      }
      if (data5.subIssueChampion !== undefined) {
        param.push(data5);
      }
      if (this.modalType === 'create') {
        if (flagSubmit) {
          this.fissionSave(param).then((res) => {
            this.visibleFisson = false;
            this.ActSubmitComplete();
          });
        }
      } else if (this.modalType === 'edit') {
        if (flagSubmit) {
          this.fissionEdit(param).then((res) => {
            this.visibleFisson = false;
            this.ActSubmitComplete();
          });
        }
      }
    },
    // 取消
    FissionCancel () {
      enableScroll();
      this.visibleFisson = false;
    },
    //  提交至工作流
    ActSubmitComplete () {
      if (this.isCommitAct) {
        const param = {
          id: this.id,
          isPission: '1',
        };
        this.issueIsPission(param).then(() => {});
        const transData = {
          businessKey: this.id, // 问题id
          businessTitle: this.questionDetail.title, // 问题title
          processDefinitionKey: 'IRS2', // IRS2  固定值
          subSys: 'irs', //  子系统编号
          taskId: this.detailList.taskId, //  任务id
          userId: this.userId, //  当前用户id,
          operationCode: '007', // 操作码裂变申请
          comment: '',
          variables: {
            businessKey: this.id, // 问题id
            comment: '',
            isFission: '1',
            sectorManagerSkip: '0',
          },
        };
        this.workFlowSubmitNew(transData).then(() => {
          this.$message.success(this.$t('issue_action.fissionCommitSuccess'));
          this.$router.push({
            path: this.$route.query.form || '/',
          });
          this.$store.dispatch('refresh');
        });
      }
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
 .icon-add{
   color: #0097E0;
   cursor: pointer;
 }
 .icon-less{
   margin-left:11.5px;
   cursor: pointer;
 }
</style>
<style lang="less">
  .fission-modal{
    top:200px;
    height:847px;
    padding-bottom: 0;
    /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, .45);
    font-size: 12px;
    }
  }
</style>
