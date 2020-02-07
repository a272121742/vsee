<template>
  <div id="components-form-demo-advanced-search">
    <div style="z-index:6001;">
      <!-- 特殊关闭 -->
      <a-modal
        :title="$t('issue_action.specialClose')"
        :visible="visibleSpeClose"
        :mask-closable="false"
        style="top:200px;!important"
        width="600px"
        @ok="closeOk"
        @cancel="closeCancel"
      >
        <a-form
          :form="closeForm"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="22">
              <!-- 特殊关闭理由 -->
              <a-form-item
                :label="$t('issue_action.closeReason')"
                self-update
              >
                <v-textarea
                  v-decorator="[
                    'comment',
                    {rules: [{ required: true, message: $t('search.please_input')}]}
                  ]"
                  :placeholder="$t('search.please_input')"
                  style="width:340px;"
                  :limit="1000"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="22">
              <!-- 附件 -->
              <a-form-item>
                <!-- 特殊关闭 -->
                <template #label>
                  {{ $t('issue_workflow.attachment') }}
                </template>
                <a-upload
                  :headers="headers"
                  :multiple="true"
                  :file-list="clientFile"
                  :before-upload="beforeUpload"
                  :remove="file => removeFile(record.serverfiles)(file)"
                  :action="getUploadUrl('/issue/v1/file/upload?recType=10021012')"
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
      <!-- 问题回退 -->
      <a-modal
        :title="$t('issue_action.rollback')"
        :visible="visibleRollback"
        :mask-closable="false"
        style="top:200px;!important"
        width="600px"
        @ok="goBackOk"
        @cancel="goBackCancel"
      >
        <a-form
          :form="goBackForm"
          class="ant-advanced-search-form"
        >
          <!-- 请选择回退状态 -->
          <a-row>
            <a-col :span="22">
              <a-form-item :label="$t('issue_workflow.D0.selectRollback')">
                <v-input
                  v-decorator="[
                    'CURRENT_NODE_DESC',
                    {rules:[{required:true,message:$t('search.please_select')}]}
                  ]"
                  :placeholder="$t('search.please_input')"
                  allow-clear
                  disabled
                  style="width:146px;height:32px;"
                />
                <a-icon
                  type="swap-right"
                  style="font-size:24px;height: 32px;margin: 0px 6px;"
                />
                <net-select
                  v-decorator="[
                    'goBackStatus',
                    {rules:[{required:true, message:$t('search.please_select') }]}
                  ]"
                  :placeholder="$t('search.please_select')"
                  url="/issue/v1/workflow/getBackNodesInfo"
                  :query="{status: detailList.status}"
                  :cache="false"
                  :transform="goBackStatusFun"
                  :allow-clear="true"
                  style="width:146px;height:32px;"
                  show-search
                  delay
                >
                </net-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="22">
              <!-- 状态回退理由 -->
              <a-form-item
                :label="$t('issue_workflow.D0.fallbackReason')"
                self-update
              >
                <v-textarea
                  v-decorator="[
                    'comment',
                    {rules: [{ required: true, message: $t('search.please_input')}]}
                  ]"
                  :placeholder="$t('search.please_input')"
                  style="width:340px;"
                  :limit="1000"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <!-- 再分配 -->
      <a-modal
        slot="title"
        :visible="visibleRes"
        :confirm-loading="confirmLoading"
        :mask-closable="false"
        style="height:232px;top:140px;"
        @ok="handleUser"
        @cancel="handleCancel"
      >
        <template #title>
          <!-- 再分配 -->
          <span class="reviewTitle"><b>{{ $t('issue_action.reassign') }}</b></span>
        </template>
        <a-form
          :form="rediStribution"
          class="ant-advanced-search-form"
          style="margin-top:20px;"
        >
          <a-row>
            <a-col :span="21">
              <!-- 「责任部门」下拉 -->
              <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
                <net-single-tree-select
                  v-decorator="['owerDeptLv1',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
                  :transform="responseDeptTreeTransform"
                  :disabled="depDisable"
                  :delay="true"
                  :placeholder="$t('search.please_select')"
                  :query="{ nameCode: '${value}' }"
                  allow-clear
                  style="width:272px;height:32px;"
                  show-search
                  url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
                  @change="owerDeptChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="21">
              <!-- 责任人 -->
              <a-form-item :label="$t('issue_workflow.D1.champion')">
                <net-select
                  v-decorator="[
                    'champion',
                    {rules:[{required:true, message:$t('search.please_select') }]}
                  ]"
                  :placeholder="$t('search.please_select')"
                  :disabled="!redistributionForm.owerDeptLv1"
                  url="/masterdata/v1/workflowgroupmember"
                  :query="{workflowGroupNameCode: redistributionForm.owerDeptLv1}"
                  :cache="false"
                  :transform="userOption"
                  :allow-clear="true"
                  style="width:272px;height:32px;"
                  show-search
                  delay
                  @change="(value) => worlkChampionOrProposer(value, 'champion', true)"
                >
                </net-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col
              :span="21"
            >
              <a-form-item
                :label="$t('label.rediStribution_reason')"
                self-update
              >
                <v-textarea
                  v-decorator="[ 'rediStributionMessage',{rules: [{ required: false,max: 320, message: $t('validate.less_then_160')}]} ]"
                  :placeholder="$t('search.please_input')"
                  :limit="160"
                  allow-clear
                >
                </v-textarea>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
    <div style="z-index:6001;">
      <a-modal
        slot="title"
        :visible="visibleReject"
        :mask-closable="false"
        style="top:140px;"
        @ok="rejectSubmit"
        @cancel="CancelReject"
      >
        <template #title>
          <!-- 再分析 -->
          <span class="reviewTitle"><b>{{ $t('issue_action.reanalysis') }}</b></span>&nbsp;
          <span class="reviewSubtitle">({{ $t('issue_workflow.D1.before_analysis') }})</span>
        </template>
        <a-form
          :form="rejectForm"
          class="ant-advanced-search-form"
          style="height:60px;margin-top:10px;"
        >
          <a-col
            :span="20"
          >
            <a-form-item
              :label="$t('label.reanalysis_reason')"
              self-update
            >
              <v-textarea
                v-decorator="[ 'commentReject',{rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]} ]"
                :placeholder="$t('search.please_input')"
                :limit="160"
                allow-clear
              >
              </v-textarea>
            </a-form-item>
          </a-col>
        </a-form>
      </a-modal>
    </div>
    <!-- 七钻原因分析 -->
    <a-modal
      :title="AnalysisTitle"
      :visible="visibleAnalysis"
      :mask-closable="false"
      style="top:200px;!important"
      width="600px"
      @ok="AnalysisOk"
      @cancel="AnalysisCancel"
    >
      <a-form
        :form="AnalysisForm"
        class="ant-advanced-search-form"
      >
        <a-row v-show="false">
          <a-col :span="22">
            <a-form-item
              :label="`id`"
              self-update
            >
              <v-textarea
                v-decorator="[
                  'id',
                ]"
                :placeholder="$t('search.please_input')"
                style="width:340px;"
                :limit="1000"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 标准要求 -->
            <a-form-item
              :label="$t('issue_workflow.D1.standard')"
              self-update
            >
              <v-textarea
                v-decorator="[
                  'standard',
                  {rules: [{ required: true, message: $t('search.please_input')}]}
                ]"
                :placeholder="$t('search.please_input')"
                style="width:340px;"
                :limit="1000"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 实际情况 -->
            <a-form-item
              :label="$t('issue_workflow.D1.actual')"
              self-update
            >
              <v-textarea
                v-decorator="[
                  'actualSituation',
                  {rules: [{ required: true, message: $t('search.please_input')}]}
                ]"
                :placeholder="$t('search.please_input')"
                style="width:340px;"
                :limit="1000"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 结论 -->
            <a-form-item
              :label="$t('issue_workflow.D1.conclusion')"
              self-update
            >
              <v-textarea
                v-decorator="[
                  'conclusion',
                  {rules: [{ required: true, message: $t('search.please_input')}]}
                ]"
                :placeholder="$t('search.please_input')"
                style="width:340px;"
                :limit="1000"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 附件 -->
            <a-form-item>
              <!-- 七钻分析 -->
              <template #label>
                {{ $t('issue_workflow.attachment') }}
              </template>
              <a-upload
                :headers="headers"
                :multiple="true"
                :file-list="recordAnalysis.file"
                :before-upload="beforeUpload"
                :remove="file => removeFile(dataFile)(file)"
                :action="getUploadUrl('/issue/v1/file/upload?recType=10021005')"
                name="file"
                @preview="download"
                @change="info => changeFileList(dataFile, recordAnalysis.file)(info)"
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
    <a-modal
      :title="AnalysisTitle"
      :visible="visibleDetail"
      :mask-closable="false"
      style="top:200px;!important"
      wrap-class-name="visibleDetail"
      width="600px"
      @ok="AnalysisDetailOk"
      @cancel="AnalysisDetailCancel"
    >
      <a-form>
        <a-row v-show="false">
          <a-col :span="10">
            <a-form-item
              :label="`id`"
              style="margin-bottom:0;"
            >
              <p>{{ DetailForm.id }}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <!-- 标准要求 -->
            <a-form-item
              :label="$t('issue_workflow.D1.standard')"
              style="margin-bottom:0;width:550px;"
            >
              <p>
                {{ DetailForm.standard }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <!-- 实际情况 -->
            <a-form-item
              :label="$t('issue_workflow.D1.actual')"
              style="margin-bottom:0;width:550px;"
            >
              <p>
                {{ DetailForm.actualSituation }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <!-- 结论 -->
            <a-form-item
              :label="$t('issue_workflow.D1.conclusion')"
              style="margin-bottom:0;width:550px;"
            >
              <p>
                {{ DetailForm.conclusion }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <!-- 附件 -->
            <a-form-item
              :label="$t('issue_workflow.attachment')"
              style="margin-bottom:0;color: rgba(0,0,0,0.45);font-size: 14px;height:auto;"
            >
              <!-- 效果验证附件  -->
              <div
                v-if="DetailForm.files && DetailForm.files.length"
                class="ant-upload-list ant-upload-list-text"
                style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
              >
                <div
                  v-for="(file, index) in DetailForm.files"
                  :key="index"
                  class="ant-upload-list-item ant-upload-list-item-done"
                  style="margin-top: 0; margin-right: 14px;"
                >
                  <div class="ant-upload-list-item-info">
                    <span>
                      <a-icon
                        type="paper-clip"
                        style="top: 3px; left: 0;"
                      />
                      <span
                        :title="file.name"
                        style="padding-left: 0;"
                        class="ant-upload-list-item-name"
                      >
                        <a
                          :title="file.name"
                          :href="getDownloadURL(file.url, file.name)"
                          :download="file.name"
                          rel="noopener noreferrer"
                          class="ant-upload-list-item-name"
                          style="padding-left: 14px;"
                        >
                          {{ file.name }}
                        </a>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 涉及文件更新弹窗（新增和编辑） -->
    <a-modal
      :title="fileModalTitle"
      :visible="visibleUpdate"
      :mask-closable="false"
      :z-index="6001"
      style="top:200px!important;"
      class="fileModal"
      width="600px"
      @ok="updateOk"
      @cancel="updateCancel"
    >
      <div
        v-if="updateEditFlag"
        class="fileEdit"
      >
        <!-- 涉及文件更新编辑 -->
        <a-form
          :form="updateForm"
          class="ant-advanced-search-form"
        >
          <a-row v-show="false">
            <a-col :span="17">
              <a-form-item
                :label="`id`"
                self-update
              >
                <v-input
                  v-decorator="[
                    'id',
                  ]"
                  :placeholder="$t('search.please_input')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="fileNameFlag">
            <a-col :span="22">
              <!-- 文件名称 -->
              <a-form-item
                :label="$t('issue_workflow.D5.fileName')"
                self-update
              >
                <v-input
                  v-decorator="[
                    'fileName',
                    {rules:[{required: fileNameFlag,message: $t('search.please_input') }]}
                  ]"
                  :placeholder="$t('search.please_input')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="22">
              <!-- 是否更新 -->
              <a-form-item
                :label="$t('issue_workflow.D5.updated')"
                style="margin-bottom:10px;height:50px;"
              >
                <a-radio-group
                  v-decorator="[
                    'isUpdae',
                    {rules:[{required: true,message: $t('search.please_select')}]}
                  ]"
                  :options="updateRadio"
                  @change="updateRadioChange"
                >
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="updateContentFlag">
            <a-col :span="22">
              <!-- 更新内容 -->
              <a-form-item
                :label="$t('issue_workflow.D5.updateContent')"
                self-update
              >
                <v-textarea
                  v-decorator="[
                    'updateContent',
                    {rules:[{required: true,message: $t('search.please_input')}]}
                  ]"
                  :placeholder="$t('search.please_input')"
                  style="width:340px;margin-bottom: 10px;"
                  :limit="1000"
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
                <!-- 涉及文件更新 -->
                <a-upload
                  :headers="headers"
                  :multiple="true"
                  :file-list="updateFiles"
                  :before-upload="beforeUpload"
                  :remove="file => removeFile(recordUpdate.files)(file)"
                  :action="getUploadUrl('/issue/v1/file/upload?recType=10021011')"
                  name="file"
                  @preview="download"
                  @change="info => changeFileList(recordUpdate.files, updateFiles)(info)"
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
      </div>
      <div
        v-if="updateFindFlag"
        class="fileEdit"
        style="margin-bottom:-10px;"
      >
        <a-form
          :form="updateDataForm"
          class="ant-advanced-search-form"
        >
          <a-row v-show="false">
            <a-col :span="20">
              <a-form-item :label="`id`">
                <p v-if="updateDataForm.id">
                  {{ updateDataForm.id }}
                </p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="fileNameFlag">
            <!-- 文件名称 -->
            <a-col :span="20">
              <!-- 文件名称 -->
              <a-form-item :label="$t('issue_workflow.D5.fileName')">
                <p>{{ updateDataForm.fileName }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="20">
              <!-- 是否更新 -->
              <a-form-item
                :label="$t('issue_workflow.D5.updated')"
                style="margin-top:0px;margin-bottom:0;"
              >
                <p>{{ updateDataForm.isUpdaeName }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="20">
              <!-- 更新内容 -->
              <a-form-item :label="$t('issue_workflow.D5.updateContent')">
                <p>{{ updateDataForm.updateContent }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="20">
              <!-- 附件 -->
              <a-form-item :label="$t('issue_workflow.attachment')">
                <!-- 效果验证-涉及文件更新附件查看 -->
                <div
                  v-if="updateFiles && updateFiles.length"
                  class="ant-upload-list ant-upload-list-text"
                  style="z-index: 2; position: absolute; width: 360px; max-height: 80px; overflow-y: auto;"
                >
                  <div
                    v-for="(file, index) in updateFiles"
                    :key="index"
                    class="ant-upload-list-item ant-upload-list-item-done"
                  >
                    <div class="ant-upload-list-item-info">
                      <span>
                        <a-icon
                          type="paper-clip"
                          style="top: 3px; left: 0;"
                        />
                        <span
                          :title="file.originalFilename"
                          style="height: 28px;margin-left:12px;"
                          class="ant-upload-list-item-name-small"
                        >
                          <a
                            :title="file.originalFilename"
                            :href="getDownloadURL(file.path, file.originalFilename)"
                            rel="noopener noreferrer"
                            class="ant-upload-list-item-name-small"
                          >
                            {{ file.originalFilename }}
                          </a>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
    <!--删除确认弹框 -->
    <a-modal
      :visible="visibleDeleteUpdate"
      :title="$t('delete.title')"
      style="top:200px!important;"
      @ok="deleteOkUpdate"
      @cancel="deleteCancelUpdate"
    >
      <p>{{ $t('delete.content') }}</p>
    </a-modal>
    <a-affix
      :offset-top="63.9"
    >
      <div class="top-buttons">
        <div class="backButton">
          <a-button
            slot="tabBarExtraContent"
            class="backBtn"
            @click="goBack"
          >
            <img src="/static/question/back.svg">
            <!-- <a-icon type="rollback" /> -->
            <!-- 返回 -->
            {{ $t('issue_action.back') }}
          </a-button>
        </div>
        <div class="rightButton">
          <a-button
            v-if="pagePermission.button_allocation_3"
            html-type="submit"
            @click="showModal"
          >
            <!-- 再分配 -->
            {{ $t('issue_action.reassign') }}
          </a-button>
          <a-button
            v-if="pagePermission.button_submit_3&&stepCurrent<6"
            ref="commitButton"
            :loading="submitLoading"
            bind="both"
            type="primary"
            class="submitBtn"
            @click.self.stop.prevent="handleSubmit"
          >
            <!-- 提交 -->
            {{ $t('issue_action.commit') }}
          </a-button>
          <a-modal
            :visible="visibleSubmit"
            :title="$t('confirm.title')"
            :z-index="6001"
            style="top:200px!important;"
            @ok="submitOk"
            @cancel="submitCancel"
          >
            <p>{{ $t('confirm.content') }}</p>
          </a-modal>
          <prevent-button
            v-if="pagePermission.button_commit_3&&stepCurrent<6"
            ref="saveButton"
            bind="both"
            style="marginLeft: 8px"
            class="saveBtn"
            @click="handleSave(1)"
          >
            <!-- 保存 -->
            {{ $t('issue_action.save') }}
          </prevent-button>
          <a-dropdown-button
            v-if="pagePermission.button_specialClose_3||(pagePermission.button_statusBack_3&&stepCurrent>2)"
            style="marginLeft: 8px"
          >
            {{ $t('issue_action.questionOpr') }}
            <a-menu slot="overlay">
              <!-- 问题回退 -->
              <a-menu-item
                v-if="pagePermission.button_statusBack_3&&stepCurrent>2"
                key="4"
                @click="rollback()"
              >
                {{ $t('issue_action.rollback') }}
              </a-menu-item>
              <!-- 特殊关闭 -->
              <a-menu-item
                v-if="pagePermission.button_specialClose_3"
                key="5"
                @click="specialClose()"
              >
                {{ $t('issue_action.specialShutdown') }}
              </a-menu-item>
            </a-menu>
          </a-dropdown-button>
          <a-button
            v-if="delBtn"
            :z-index="6001"
            style="marginLeft: 8px"
            class="cancelBtn"
            @click="handleDelete"
          >
            <!-- 删除 -->
            {{ $t('issue_action.delete') }}
          </a-button>
          <!-- 删除确认弹框 -->
          <a-modal
            :visible="visibleDelete"
            :title="$t('delete.title')"
            :z-index="6001"
            style="top:200px!important;"
            @ok="deleteOk"
            @cancel="deleteCancel"
          >
            <p>{{ $t('delete.content') }}</p>
          </a-modal>
        </div>
      </div>
    </a-affix>
    <div class="formConetnt">
      <div class="shadown-block-normal messageForm">
        <a-form
          :form="form"
          layout="vertical"
          @submit="handleSearch"
        >
          <a-card
            v-if="pagePermission.A2_2||pagePermission.A2_3||pagePermission.A1_2||pagePermission.A1_3||pagePermission.A1_1"
            class="cardTitle card-detail"
          >
            <template #title>
              {{ $t('issue.subdetails') }}
            </template>
            <template #extra>
              <!-- 编辑按钮 -->
              <a-button
                v-if="pagePermission.A1_3||pagePermission.A2_3"
                class="editBtn"
                @click="editDetail"
              >
                <!-- 编辑 -->
                {{ $t('issue_action.edit') }}
              </a-button>
            </template>
            <div class="detailText clearfix">
              <div style="position:relative;">
                <div class="baseMessage">
                  <!-- 基本信息 -->
                  {{ $t('issue.basicInfo') }}
                </div>
                <!-- 问题标题 -->
                <div
                  class="pageTitle clearfix"
                  style="margin-left: -32px; width: calc(100% + 64px);"
                >
                  <!-- 标准要求 -->
                  <span style="float:left;margin-left: 32px;">{{ $t('issue.title') + $t('colon') }}</span>
                  <span
                    class="carTitle"
                    style="width: unset;"
                    :title="detailList.title"
                  >
                    {{ detailList.title }}
                  </span>
                  <span style="float:right;margin-right:126px;">{{ $t('issue.code') + $t('colon') }} {{ detailList.code }}</span>
                </div>

                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「车型名称」 -->
                    <a-form-item :label="$t('issue.vehicleModelName')">
                      <p
                        v-if="detailList.vehicleModelName"
                        :title="detailList.vehicleModelName"
                      >
                        {{ detailList.vehicleModelName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「所属系统」 -->
                    <a-form-item :label="$t('issue.faultTreeIds1')">
                      <p
                        v-if="detailList.faultTreeIds1Name"
                        :title="detailList.vehicleModelName"
                      >
                        {{ detailList.faultTreeIds1Name }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「所属功能」 -->
                    <a-form-item :label="$t('issue.faultTreeIds2')">
                      <p
                        v-if="detailList.faultTreeIds2Name"
                        :title="detailList.faultTreeIds2Name"
                      >
                        {{ detailList.faultTreeIds2Name }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「故障代码」 -->
                    <a-form-item :label="$t('issue.faultTreeIds3')">
                      <p
                        v-if="detailList.faultTreeIds3Name"
                        :title="detailList.faultTreeIds3Name"
                      >
                        {{ detailList.faultTreeIds3Name }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「问题分类」 -->
                    <a-form-item :label="$t('issue.source')">
                      <p
                        v-if="detailList.sourceName"
                        :title="detailList.sourceName"
                      >
                        {{ detailList.sourceName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「模块」 -->
                    <a-form-item :label="$t('issue.smt')">
                      <p
                        v-if="detailList.smtName"
                        :title="detailList.smtName"
                      >
                        {{ detailList.smtName }}
                      </p>
                    </a-form-item>
                  </a-col>

                  <a-col :span="6">
                    <!-- 「问题严重等级」 -->
                    <a-form-item :label="$t('issue.grade')">
                      <p
                        v-if="detailList.gradeName"
                        :title="detailList.gradeName"
                      >
                        {{ detailList.gradeName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题管理负责人」 -->
                    <a-form-item :label="$t('issue.responsibleUserId')">
                      <p
                        v-if="detailList.responsibleUserName"
                        :title="detailList.responsibleUserName"
                      >
                        {{ detailList.responsibleUserName }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「问题阶段」 -->
                    <a-form-item :label="$t('issue.projectPhase')">
                      <p
                        v-if="detailList.projectPhaseName"
                        :title="detailList.projectPhaseName"
                      >
                        {{ detailList.projectPhaseName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题发生日期」 -->
                    <a-form-item :label="$t('issue.failureDate')">
                      <p
                        v-if="detailList.failureDate"
                        :title="detailList.failureDate | GLOBAL_SELECT_DATE_FORMAT"
                      >
                        {{ detailList.failureDate | GLOBAL_SELECT_DATE_FORMAT }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「生产基地」 -->
                    <a-form-item :label="$t('issue.manufactureBase')">
                      <p
                        v-if="detailList.manufactureBaseName"
                        :title="detailList.manufactureBaseName"
                      >
                        {{ detailList.manufactureBaseName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「责任部门」 -->
                    <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
                      <p
                        v-if="detailList.responsibleDepartmentName"
                        :title="detailList.responsibleDepartmentName"
                      >
                        {{ detailList.responsibleDepartmentName }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「问题频次」 -->
                    <a-form-item :label="$t('issue.frequency')">
                      <p
                        v-if="detailList.frequency"
                        :title="detailList.frequency"
                      >
                        {{ detailList.frequency }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「提出人部门」 -->
                    <a-form-item :label="$t('issue.proposerDepartmentId')">
                      <p
                        v-if="detailList.advanceDeptName"
                        :title="detailList.advanceDeptName"
                      >
                        {{ detailList.advanceDeptName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「提出人」 -->
                    <a-form-item :label="$t('issue.proposer')">
                      <p
                        v-if="detailList.advanceUserName"
                        :title="detailList.advanceUserName"
                      >
                        {{ detailList.advanceUserName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「联系人电话」 -->
                    <a-form-item
                      :label="$t('issue.contact')"
                      class="quesetionContact"
                    >
                      <p
                        v-if="detailList.contact"
                        :title="detailList.contact"
                      >
                        {{ detailList.contact }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「VIN」 -->
                    <a-form-item :label="$t('issue.vinNo')">
                      <p
                        v-if="detailList.vinNo"
                        :title="detailList.vinNo"
                      >
                        {{ detailList.vinNo }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「license」 -->
                    <a-form-item :label="$t('issue.license')">
                      <p
                        v-if="detailList.license"
                        :title="detailList.license"
                      >
                        {{ detailList.license }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「创建人」 -->
                    <a-form-item :label="$t('issue.creatorName')">
                      <p
                        v-if="detailList.creatorName"
                        :title="detailList.creatorName"
                      >
                        {{ detailList.creatorName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「创建部门」 -->
                    <a-form-item :label="$t('issue.creatorDept')">
                      <p
                        v-if="detailList.creatorDept"
                        :title="detailList.creatorDept"
                      >
                        {{ detailList.creatorDept }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「问题提报日期」 -->
                    <a-form-item :label="$t('issue.createDate')">
                      <p
                        v-if="detailList.createDate"
                        :title="detailList.createDate | GLOBAL_SELECT_DATE_FORMAT"
                      >
                        {{ detailList.createDate | GLOBAL_SELECT_DATE_FORMAT }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                  </a-col>
                  <a-col
                    :span="6"
                    style="height: 0px;"
                  >
                    <!-- 「附件」 -->
                    <a-form-item :label="$t('issue_workflow.attachment')">
                      <!-- <img src="/static/question/file.png">
                      <span
                        v-if="detailList.fileList"
                        class="fileListNumber"
                      >{{ detailList.fileList.length }}</span> -->
                      <!-- 问题详情的附件 -->
                      <div
                        v-if="detailList.fileList && detailList.fileList.length"
                        class="ant-upload-list ant-upload-list-text"
                        style="overflow-y: auto; max-height: 82px; z-index: 10;"
                      >
                        <div
                          v-for="(file, index) in detailList.fileList"
                          :key="index"
                          class="ant-upload-list-item ant-upload-list-item-done"
                          style="margin-top: 0; margin-right: 14px;"
                        >
                          <div class="ant-upload-list-item-info">
                            <span>
                              <a-icon
                                type="paper-clip"
                                style="top: 3px; left: 0;"
                              />
                              <span
                                :title="file.originalFilename"
                                style="padding-left: 0;"
                                class="ant-upload-list-item-name"
                              >
                                <a
                                  :title="file.originalFilename"
                                  :href="getDownloadURL(file.path, file.originalFilename)"
                                  :download="file.originalFilename"
                                  rel="noopener noreferrer"
                                  class="ant-upload-list-item-name"
                                  style="padding-left: 14px;"
                                >
                                  {{ file.originalFilename }}
                                </a>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <!-- <div
                      v-if="detailList.fileList && detailList.fileList.length"
                      class="ant-upload-list-item-info"
                    >
                      <span
                        v-for="(file, index) in detailList.fileList"
                        :key="index"
                      >
                        <a-icon type="paper-clip" />
                        <span
                          :title="file.originalFilename"
                          class="ant-upload-list-item-name"
                        >
                          <a :href="getDownloadURL(file.path, file.originalFilename)">
                            {{ file.originalFilename }}
                          </a>
                        </span>
                      </span>
                    </div> -->
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row
                  :gutter="24"
                  style="margin-right:272px; "
                >
                  <a-col :span="24">
                    <!-- 「问题描述」 -->
                    <a-form-item
                      :label="$t('issue.description')"
                      class="form-item-flex-2"
                    >
                      <p
                        v-if="detailList.description"
                        :title="detailList.description"
                        style="white-space: unset; word-break: unset;"
                      >
                        {{ detailList.description }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <!-- <div
                    v-if="!showMoreFlag"
                    class="showMore"
                    style="height:53px;line-height:53px;top:20px;"
                    @click="showMore"
                  >
                    <span>{{ $t('issue.seeMore') }}</span>
                    <img src="/static/question/Open.png">
                  </div> -->
                </a-row>
              </div>
              <div
                v-if="showMoreFlag"
                style="position:relative;top: 16px;"
              >
                <div class="baseMessage">
                  <!-- 补充信息 -->
                  {{ $t('issue.additionalInfo') }}
                </div>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「试验类型」 -->
                    <a-form-item :label="$t('issue.testType')">
                      <p
                        v-if="detailList.testTypeName"
                        :title="detailList.testTypeName"
                      >
                        {{ detailList.testTypeName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「祸首件」 -->
                    <a-form-item :label="$t('issue.firstCausePart')">
                      <p
                        v-if="detailList.firstCausePartName"
                        :title="detailList.firstCausePartName"
                      >
                        {{ detailList.partName }}  {{ detailList.firstCausePartName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <!-- <a-col :span="6"> -->
                  <!-- 「零件号」 -->
                  <!-- <a-form-item :label="$t('issue.partId')">
                      <p
                        v-if="detailList.partName"
                        :title="detailList.partName"
                      >
                        {{ detailList.partName }}
                      </p>
                    </a-form-item>
                  </a-col> -->

                  <a-col :span="6">
                    <!-- 「供应商名称」 -->
                    <a-form-item :label="$t('issue.supplierName')">
                      <p
                        v-if="detailList.supplierName"
                        :title="detailList.supplierName"
                      >
                        {{ detailList.supplierName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「软件版本号」 -->
                    <a-form-item :label="$t('issue.softwareVersion')">
                      <p
                        v-if="detailList.softwareVersion"
                        :title="detailList.softwareVersion"
                      >
                        {{ detailList.softwareVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「标定版本号」 -->
                    <a-form-item :label="$t('issue.calibrationVersion')">
                      <p
                        v-if="detailList.calibrationVersion"
                        :title="detailList.calibrationVersion"
                      >
                        {{ detailList.calibrationVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「硬件版本号」 -->
                    <a-form-item :label="$t('issue.hardwareVersion')">
                      <p
                        v-if="detailList.hardwareVersion"
                        :title="detailList.hardwareVersion"
                      >
                        {{ detailList.hardwareVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「配置字版本号」 -->
                    <a-form-item :label="$t('issue.confirmationVersion')">
                      <p
                        v-if="detailList.confirmationVersion"
                        :title="detailList.confirmationVersion"
                      >
                        {{ detailList.confirmationVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「维修网点」 -->
                    <a-form-item :label="$t('issue.maintenanceStation')">
                      <p
                        v-if="detailList.maintenanceStation"
                        :title="detailList.maintenanceStation"
                      >
                        {{ detailList.maintenanceStation }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「故障里程」 -->
                    <a-form-item :label="$t('issue.milage')">
                      <p
                        v-if="detailList.milage"
                        :title="detailList.milage"
                      >
                        {{ detailList.milage }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「生产时间」 -->
                    <a-form-item :label="$t('issue.productDate')">
                      <p
                        v-if="detailList.productDate"
                        :title="detailList.productDate | GLOBAL_SELECT_DATE_FORMAT"
                      >
                        {{ detailList.productDate | GLOBAL_SELECT_DATE_FORMAT }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row
                  :gutter="24"
                >
                  <a-col :span="24">
                    <!-- 工况信息 -->
                    <a-form-item
                      :label="$t('issue.workConditionInfo') + $t('colon')"
                    >
                      <p
                        v-if="detailList.workConditionInfo"
                        :title="detailList.workConditionInfo"
                        style="white-space: unset; word-break: unset;"
                      >
                        {{ detailList.workConditionInfo }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row
                  :gutter="24"
                >
                  <a-col :span="24">
                    <!-- 初步排查情况 -->
                    <a-form-item
                      :label="$t('issue.preliminaryInvestigation') + $t('colon')"
                    >
                      <p
                        v-if="detailList.preliminaryInvestigation"
                        :title="detailList.preliminaryInvestigation"
                        style="white-space: unset; word-break: unset;"
                      >
                        {{ detailList.preliminaryInvestigation }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row
                  :gutter="24"
                >
                  <a-col :span="24">
                    <!-- 备注 -->
                    <a-form-item
                      :label="$t('issue.remark') + $t('colon')"
                    >
                      <p
                        v-if="detailList.remark"
                        :title="detailList.remark"
                        style="white-space: unset; word-break: unset;"
                      >
                        {{ detailList.remark }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div style="margin-bottom: 32px;"></div>
                <!-- <div
                  v-if="showMoreFlag"
                  class="showMore"
                  style="position:relative;height:63px;"
                  @click="showMore"
                >
                  <span>{{ $t('search.collapse_button') }}</span>
                  <img src="/static/question/retractIcon.png">
                </div> -->
              </div>
            </div>
          </a-card>
        </a-form>
      </div>
      <a-form
        :form="formDcontent"
        class="shadown-block-normal ant-advanced-search-form"
      >
        <!-- 提出人科长审核-->
        <a-card
          v-if="statusCode.statusNewCode==100105||statusCode.statusNewCode==100108"
          class="cardTitle"
        >
          <template #title>
            {{ $t('issue.creatorSelectorCheck') }}
          </template>
          <div class="ant-advanced-search-form">
            <div class="Dcontent1 D1back">
              <div v-if="pagePermission.A_0_0_2_3">
                <div class="examine">
                  <div class="Dtitle examineTitle">
                    <!-- 审核 -->
                    <span>{{ $t('issue_workflow.approval') }}</span>
                  </div>
                  <a-row>
                    <a-col :span="21">
                      <!-- 是否通过审核 -->
                      <a-form-item :label="$t('issue_workflow.approvalResult')">
                        <a-radio-group
                          v-decorator="[ 'isPass',{rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}]"
                          :options="verifyRadio"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="record.isPass==='0'">
                    <a-col :span="21">
                      <a-form-item
                        :label="$t('issue_workflow.rejectReason2')"
                        self-update
                      >
                        <v-textarea
                          v-decorator="['comment',{rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]} ]"
                          :placeholder="$t('search.please_input')"
                          :limit="160"
                          allow-clear
                        >
                        </v-textarea>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="record.isPass==='1'">
                    <a-col :span="21">
                      <a-form-item
                        :label="$t('issue.remark')"
                        self-update
                      >
                        <v-textarea
                          v-decorator="['notes',{rules: [{max: 320, message: $t('validate.less_then_160')}]} ]"
                          :placeholder="$t('search.please_input')"
                          :limit="160"
                          allow-clear
                        >
                        </v-textarea>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div v-if="statusCode.statusNewCode==100108&&pagePermission.A_0_0_2_2">
                <div
                  class="examineResult"
                  style="left:530px;"
                >
                  <!-- 审核结果 -->
                  <div v-if="backType==='003'">
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_workflow.approval_result') }}</span>
                    </div>
                    <!-- 审核不通过 -->
                    <a-form-item :label="$t('issue_workflow.approval')">
                      <!-- 不通过 -->
                      <p>{{ $t('issue_workflow.reject') }}</p>
                    </a-form-item>
                    <!-- 不通过理由 -->
                    <a-form-item :label="$t('issue_workflow.rejectReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                  </div>

                  <!-- 状态回退 -->
                  <div v-if="backType==='004'">
                    <!-- 标题 -->
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_action.rollback') }}</span>
                    </div>
                    <!-- 状态回退节点 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                      <p style="color:#0097E0">
                        {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                      </p>
                    </a-form-item>
                    <!-- 问题回退理由 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                    <!-- 回退时间 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                      <p>{{ OPERETION_DATE }}</p>
                    </a-form-item>
                    <!-- 回退人 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                      <p>{{ OP_USER_NAME }}</p>
                    </a-form-item>
                  </div>

                  <!-- 特殊关闭 -->
                  <div v-if="backType==='005'">
                    <!-- 标题 -->
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_action.specialShutdown') }}</span>
                    </div>

                    <!-- 特殊关闭理由 -->
                    <a-form-item :label="$t('issue_action.closeReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                    <!-- 特殊关闭时间 -->
                    <a-form-item :label="$t('issue_action.closeTime')">
                      <p>{{ OPERETION_DATE }}</p>
                    </a-form-item>
                    <!-- 特殊关闭人 -->
                    <a-form-item :label="$t('issue_action.closer')">
                      <p>{{ OP_USER_NAME }}</p>
                    </a-form-item>
                  </div>
                </div>
              </div>
              <div
                v-if="pagePermission.A_0_0_1_2&&(!pagePermission.A_0_0_2_3)"
                class="examineResult"
              >
                <a-row>
                  <a-col
                    :span="24"
                    style="text-align:center;"
                  >
                    <!-- 该问题正在提出人科长审核中 -->
                    {{ $t('issue_reason.creatorSelectCheck') }}
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-card>
        <!--问题管理工作流-->
        <a-card
          v-if="pagePermission.A3_2&&statusCode.statusNewCode>=100200"
          class="cardTitle"
        >
          <!-- 问题流程 -->
          <template #title>
            {{ $t('issue.subworkflow') }}
          </template>
          <template
            v-if="statusCode.statusNewCode>=200100"
            #extra
          >
            <a-button
              v-permission="'issue:detail:report_download'"
              type="primary"
              @click="issueReportDownload"
            >
              <!-- 下载单页报告按钮 -->
              {{ $t('issue_action.issue_report_download') }}
            </a-button>
          </template>
          <div class="ant-advanced-search-form">
            <div class="step">
              <a-steps :current="stepCurrent<6?stepCurrent-2:stepCurrent-3">
                <a-popover
                  slot="progressDot"
                  slot-scope="{index = index+3}"
                  :visible="false"
                >
                  <span class="new-steps-icon">
                    <!-- <span v-if="false">{{ index = index < 3 ? index+2:index+3 }}</span> -->
                    <img
                      v-if="(((index = index < 3 ? index+2:index+3) < stepCurrent ||statusCode.issueClosed||(record.isSign=='0' && statusCode.statusNewCode==700200))&&!statusSpecialClose)||((index < specialCloseNode||index==6)&&statusSpecialClose)"
                      src="/static/img/shixinyuan.png"
                    />
                    <img
                      v-if="(index === stepCurrent&&!(statusCode.issueClosed)&&!statusSpecialClose)||(index==specialCloseNode && statusSpecialClose)"
                      src="/static/img/kongxinyuan.png"
                    />
                    <img
                      v-if="((stepCurrent < index) && stepMax < index&&!statusSpecialClose)||(index>specialCloseNode && index<6&&statusSpecialClose)"
                      src="/static/img/huiseyuan.png"
                    />
                    <img
                      v-if="(stepCurrent < index) && stepMax >= index"
                      src="/static/img/shixinyuan_re.png"
                    />
                  </span>
                </a-popover>
                <a-step
                  style="cursor:pointer;"
                  class="stepTitle"
                  @click="goto(2)"
                >
                  <!-- D2-原因分析 -->
                  <template #title>
                    {{ $t('issue_workflow.steps.D2') }}
                  </template>
                </a-step>
                <a-step
                  style="cursor:pointer;"
                  class="stepTitle"
                  @click="goto(3)"
                >
                  <!-- D3-措施指定 -->
                  <template #title>
                    {{ $t('issue_workflow.steps.D3') }}
                  </template>
                </a-step>
                <a-step
                  style="cursor:pointer;"
                  class="stepTitle"
                  @click="goto(4)"
                >
                  <!-- D4-措施实施 -->
                  <template #title>
                    {{ $t('issue_workflow.steps.D4') }}
                  </template>
                </a-step>
                <a-step
                  style="cursor:pointer;"
                  class="stepTitle"
                  @click="goto(6)"
                >
                  <!-- D6-问题关闭 -->
                  <template #title>
                    {{ $t('issue_workflow.steps.D6') }}
                  </template>
                </a-step>
              </a-steps>
            </div>
            <div
              v-if="stepCurrent===0&&(pagePermission.A0_1_3||pagePermission.A0_5_2)"
              class="Dcontent D0content"
            >
              <div
                v-if="pagePermission.A0_5_2"
                class="examineResult"
              >
                <div
                  class="triangle_border_up"
                  style="left:110px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval_result') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>
              </div>
              <div v-if="pagePermission.A0_1_3">
                <div
                  class="triangle_border_up"
                  style="left:110px;"
                >
                  <span></span>
                </div>
                <a-row>
                  <a-col :span="21">
                    <!-- 是否立项 -->
                    <a-form-item :label="$t('issue_workflow.D0.publish')">
                      <a-radio-group
                        v-decorator="[
                          'isProject',
                          {rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D0.publish') }]}
                        ]"
                        :options="satisfy"
                        @change="satisfyChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div v-if="!satisfyFlag">
                  <a-row>
                    <a-col :span="21">
                      <!-- 理由 -->
                      <a-form-item
                        :label="$t('issue_workflow.D0.reason')"
                        self-update
                      >
                        <v-textarea
                          v-decorator="[
                            'comment',
                            {rules: [{ required: true,max: 320, message: $t('validate.less_then_160') }]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          :limit="160"
                          allow-clear
                        ></v-textarea>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                <div v-if="satisfyFlag">
                  <a-row>
                    <a-col :span="21">
                      <!-- 是否需要围堵措施 -->
                      <a-form-item :label="$t('issue_workflow.D0.needICA')">
                        <a-radio-group
                          v-decorator="[
                            'isNeedIca',
                            {rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D0.needICA') }]}
                          ]"
                          :options="contActionOption"
                          @change="conActionChange"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <div v-if="conActionFlag">
                    <a-row>
                      <a-col :span="21">
                        <!-- 填写人部门 -->
                        <a-form-item :label="$t('issue_workflow.D0.personDepartment')">
                          <net-single-tree-select
                            v-decorator="['icaWriterDepartment',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D0.personDepartment') }]}]"
                            :transform="deptTreeTransform"
                            :placeholder="$t('search.please_select')"
                            :query="{ id: '${value}'}"
                            allow-clear
                            :delay="false"
                            style="width:272px;height:32px;"
                            show-search
                            url="/sys/dept/deptList/getDeptTreeTwo"
                            @change="icaWriterDeptChange"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 填写人 -->
                        <a-form-item :label="$t('issue_workflow.D0.person')">
                          <net-select
                            v-decorator="[
                              'icaWriter',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D0.person') }]}
                            ]"
                            :placeholder="$t('search.please_select')"
                            :disabled="!record.icaWriterDepartment"
                            url="/sys/user/useList/getUsersByDeptPid"
                            :query="{ deptId: record.icaWriterDepartment,userId:'${value}' }"
                            :cache="false"
                            :delay="false"
                            :transform="userCochairOption"
                            allow-clear
                            style="width:272px;height:32px;"
                            @change="(value) => workflowRoleChange(value, 'icaWriter')"
                          >
                          </net-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 备注 -->
                        <a-form-item
                          :label="$t('issue.remark')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="[ 'icaRemark']"
                            :placeholder="$t('search.please_input')"
                            style="width:572px;"
                            :limit="1000"
                            allow-clear
                          ></v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <a-row v-if="satisfyFlag">
                    <a-col :span="21">
                      <!-- 问题定义 附件 -->
                      <a-form-item>
                        <template #label>
                          {{ $t('issue_workflow.attachment') }}
                        </template>
                        <a-upload
                          :headers="headers"
                          :multiple="true"
                          :file-list="d0FileList"
                          :before-upload="beforeUpload"
                          :remove="file => removeFile(record.fileList)(file)"
                          :action="getUploadUrl('/issue/v1/file/upload?recType=10021004')"
                          name="file"
                          @preview="download"
                          @change="info => changeFileList(record.fileList, d0FileList)(info)"
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
                </div>
              </div>
            </div>
            <div
              v-if="backCurrent===0&&(pagePermission.A0_2_2||pagePermission.A0_1_2)"
              class="Dcontent D0back"
            >
              <div v-if="pagePermission.A0_2_2||pagePermission.A0_1_2">
                <div
                  class="triangle_border_up"
                  style="left:110px;"
                >
                  <span></span>
                </div>
                <div
                  v-if="record.isNeedIca==='1'||pagePermission.A0_4_2"
                  class="Dtitle examineTitle"
                >
                  <span>{{ $t('issue_workflow.D0.icaWriter') }}</span>
                </div>
                <a-row>
                  <a-col :span="21">
                    <!-- 立项条件 -->
                    <a-form-item :label="$t('issue_workflow.D0.publist_condition')">
                      <p>{{ problemDefinitionData.isProject==='1'? $t('issue_workflow.yes') : $t('issue_workflow.no') }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div v-if="problemDefinitionData.isProject==='1'">
                  <a-row>
                    <a-col :span="21">
                      <!-- 是否需要围堵措施  -->
                      <a-form-item :label="$t('issue_workflow.D0.needICA')">
                        <p>{{ problemDefinitionData.isNeedIca==='1'? $t('issue_workflow.yes') : $t('issue_workflow.no') }}</p>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <div v-if="problemDefinitionData.isNeedIca==='1'&&conActionFlag">
                    <a-row>
                      <a-col :span="21">
                        <!-- 填写人部门   -->
                        <a-form-item :label="$t('issue_workflow.D0.personDepartment')">
                          <p>{{ problemDefinitionData.icaWriterDepartmentName }}</p>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 填写人   -->
                        <a-form-item :label="$t('issue_workflow.D0.person')">
                          <p>{{ problemDefinitionData.icaWriterName }}</p>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <!-- 备注 -->
                    <a-row>
                      <a-col :span="21">
                        <!-- 填写人   -->
                        <a-form-item :label="$t('issue.remark')">
                          <p>{{ problemDefinitionData.icaRemark }}</p>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="problemDefinitionData.isProject==='1'">
                      <a-col :span="21">
                        <!-- 附件  -->
                        <a-form-item
                          :label="$t('issue_workflow.attachment') "
                          style="height:auto;"
                        >
                          <!-- 问题定义附件 -->
                          <div
                            v-if="d0FileList && d0FileList.length"
                            class="ant-upload-list ant-upload-list-text"
                            style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                          >
                            <div
                              v-for="(file, index) in d0FileList"
                              :key="index"
                              class="ant-upload-list-item ant-upload-list-item-done"
                              style="margin-top: 0; margin-right: 14px;"
                            >
                              <div class="ant-upload-list-item-info">
                                <span>
                                  <a-icon
                                    type="paper-clip"
                                    style="top: 3px; left: 0;"
                                  />
                                  <span
                                    :title="file.name"
                                    style="padding-left: 0;"
                                    class="ant-upload-list-item-name"
                                  >
                                    <a
                                      :title="file.name"
                                      :href="getDownloadURL(file.url, file.name)"
                                      :download="file.name"
                                      rel="noopener noreferrer"
                                      class="ant-upload-list-item-name"
                                      style="padding-left: 14px;"
                                    >
                                      {{ file.name }}
                                    </a>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <div
                      v-if="pagePermission.A0_4_3"
                      class="Dtitle examineTitle"
                    >
                      <span>{{ $t('issue_workflow.D0.containmentMeasures') }}</span>
                    </div>
                    <!-- 围堵措施填写 -->
                    <a-row
                      v-if="pagePermission.A0_4_3"
                      class="ica-edit"
                    >
                      <a-col :span="21">
                        <!-- 围堵措施 -->
                        <a-form-item
                          :label="$t('issue_workflow.D0.ICA')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="[ 'icaDescriptionD1',{rules: [{ required: true, message: $t('search.please_input') + $t('issue_workflow.D0.ICA') }]}]"
                            :placeholder="$t('search.please_input')"
                            style="width:572px;"
                            :limit="1000"
                            allow-clear
                          ></v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row
                      v-if="pagePermission.A0_4_3"
                      class="ica-edit"
                    >
                      <a-col :span="21">
                        <!-- 围堵措施 附件 -->
                        <a-form-item>
                          <template #label>
                            {{ $t('issue_workflow.attachment') }}
                          </template>
                          <a-upload
                            :headers="headers"
                            :multiple="true"
                            :file-list="icaFiles"
                            :before-upload="beforeUpload"
                            :remove="file => removeFile(record.icaFiles)(file)"
                            :action="getUploadUrl('/issue/v1/file/upload?recType=10021013')"
                            name="file"
                            @preview="download"
                            @change="info => changeFileList(record.icaFiles, icaFiles)(info)"
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
                    <div
                      v-if="pagePermission.A0_4_2"
                      class="Dtitle examineTitle"
                    >
                      <span>{{ $t('issue_workflow.D0.containmentMeasures') }}</span>
                    </div>
                    <a-row v-if="pagePermission.A0_4_2">
                      <a-col :span="21">
                        <!-- 围堵措施   -->
                        <a-form-item :label="$t('issue_workflow.D0.containmentMeasures')">
                          <p>{{ problemDefinitionData.icaDescriptionD1 }}</p>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="pagePermission.A0_4_2">
                      <a-col :span="21">
                        <a-form-item
                          :label="$t('issue_workflow.attachment') "
                          style="height:auto;"
                        >
                          <!-- 围堵措施附件 -->
                          <div
                            v-if="icaFiles && icaFiles.length"
                            class="ant-upload-list ant-upload-list-text"
                            style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                          >
                            <div
                              v-for="(file, index) in icaFiles"
                              :key="index"
                              class="ant-upload-list-item ant-upload-list-item-done"
                              style="margin-top: 0; margin-right: 14px;"
                            >
                              <div class="ant-upload-list-item-info">
                                <span>
                                  <a-icon
                                    type="paper-clip"
                                    style="top: 3px; left: 0;"
                                  />
                                  <span
                                    :title="file.name"
                                    style="padding-left: 0;"
                                    class="ant-upload-list-item-name"
                                  >
                                    <a
                                      :title="file.name"
                                      :href="getDownloadURL(file.url, file.name)"
                                      :download="file.name"
                                      rel="noopener noreferrer"
                                      class="ant-upload-list-item-name"
                                      style="padding-left: 14px;"
                                    >
                                      {{ file.name }}
                                    </a>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>

                <div v-if="problemDefinitionData.isProject==='0'">
                  <a-row>
                    <a-col :span="21">
                      <!-- 理由  -->
                      <a-form-item :label="$t('issue_workflow.D0.reason')">
                        <p>{{ examineReason }}</p>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
                <!-- D0审核 -->
                <div v-if="(stepCurrent===backCurrent)&&(pagePermission.A0_5_3)">
                  <div class="examine">
                    <div class="Dtitle examineTitle">
                      <!-- 审核 -->
                      <span>{{ $t('issue_workflow.approval') }}</span>
                    </div>
                    <a-row>
                      <a-col :span="21">
                        <!-- 是否通过审核 -->
                        <a-form-item :label="$t('issue_workflow.approvalResult')">
                          <a-radio-group
                            v-decorator="[ 'isPass',{rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}]"
                            :options="verifyRadio"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="record.isPass==='0'">
                      <a-col :span="21">
                        <!-- 不通过原因 -->
                        <a-form-item
                          :label="$t('issue_workflow.rejectReason2')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="['comment',{rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]} ]"
                            :placeholder="$t('search.please_input')"
                            :limit="160"
                            allow-clear
                          >
                          </v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="record.isPass==='1'">
                      <a-col :span="21">
                        <!-- 备注 -->
                        <a-form-item
                          :label="$t('issue.remark')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="['notes',{rules: [{max: 320, message: $t('validate.less_then_160')}]} ]"
                            :placeholder="$t('search.please_input')"
                            :limit="160"
                            allow-clear
                          >
                          </v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="((pagePermission.A0_3_2&&pagePermission.A0_1_1)||pagePermission.A1_2_2||pagePermission.A2_4_2||pagePermission.A3_4_2||pagePermission.A4_4_2||pagePermission.A5_6_2||pagePermission.A6_3_2)&&(backCurrent === stepCurrent)"
              class="Dcontent D0back"
            >
              <a-row>
                <a-col
                  :span="24"
                  style="text-align:center;"
                >
                  <!-- 该问题正在立项中 -->
                  <p v-if="pagePermission.A0_3_2&&pagePermission.A0_1_1">
                    {{ $t('issue_reason.publishing') }}
                  </p>
                  <!-- 该问题正在责任判定中 -->
                  <p v-if="pagePermission.A1_2_2">
                    {{ $t('issue_reason.defining') }}
                  </p>
                  <!-- 问题原因正在分析填写中 -->
                  <p v-if="pagePermission.A2_4_2">
                    {{ $t('issue_reason.analysising') }}
                  </p>
                  <!-- 问题措施正在制定中 -->
                  <p v-if="pagePermission.A3_4_2">
                    {{ $t('issue_reason.sovling') }}
                  </p>
                  <!-- 该问题措施实施填写中 -->
                  <p v-if="pagePermission.A4_4_2">
                    {{ $t('issue_reason.implementing') }}
                  </p>
                  <!-- 该问题效果验证内容填写中 -->
                  <p v-if="pagePermission.A5_6_2">
                    {{ $t('issue_reason.feedbacking') }}
                  </p>
                  <!-- 该问题关闭中 -->
                  <p v-if="pagePermission.A6_3_2">
                    {{ $t('issue_reason.wait_main_closing') }}
                  </p>
                </a-col>
              </a-row>
            </div>
            <div
              v-if="stepCurrent===1&&backFlag===false&&(pagePermission.A1_1_3||(pagePermission.A1_18_2&&(backType==='003'||backType==='004'||backType==='005'))||((pagePermission.A1_3_3||pagePermission.A1_3_2||pagePermission.A1_6_3||pagePermission.A1_6_2||pagePermission.A1_9_3||pagePermission.A1_9_2||pagePermission.A1_12_3||pagePermission.A1_12_2||pagePermission.A1_15_3||pagePermission.A1_15_2)&&200105< statusCode.statusNewCode))"
              class="Dcontent D1content"
            >
              <div>
                <div
                  class="triangle_border_up"
                  style="left:250px;"
                >
                  <span></span>
                </div>
                <div
                  v-if="pagePermission.A1_18_2"
                  class="examineResult"
                >
                  <!-- 审核结果 -->
                  <div v-if="backType==='003'">
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_workflow.D5.leaderReview') }}</span>
                    </div>
                    <!-- 审核不通过 -->
                    <a-form-item :label="$t('issue_workflow.approval')">
                      <!-- 不通过 -->
                      <p>{{ $t('issue_workflow.reject') }}</p>
                    </a-form-item>
                    <!-- 不通过理由 -->
                    <a-form-item :label="$t('issue_workflow.rejectReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                  </div>

                  <!-- 状态回退 -->
                  <div v-if="backType==='004'">
                    <!-- 标题 -->
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_action.rollback') }}</span>
                    </div>
                    <!-- 状态回退节点 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                      <p style="color:#0097E0">
                        {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                      </p>
                    </a-form-item>
                    <!-- 问题回退理由 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                    <!-- 回退时间 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                      <p>{{ OPERETION_DATE }}</p>
                    </a-form-item>
                    <!-- 回退人 -->
                    <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                      <p>{{ OP_USER_NAME }}</p>
                    </a-form-item>
                  </div>

                  <!-- 特殊关闭 -->
                  <div v-if="backType==='005'">
                    <!-- 标题 -->
                    <div class="Dtitle examineTitle">
                      <span>{{ $t('issue_action.specialShutdown') }}</span>
                    </div>

                    <!-- 特殊关闭理由 -->
                    <a-form-item :label="$t('issue_action.closeReason')">
                      <p>{{ examineReason }}</p>
                    </a-form-item>
                    <!-- 特殊关闭时间 -->
                    <a-form-item :label="$t('issue_action.closeTime')">
                      <p>{{ OPERETION_DATE }}</p>
                    </a-form-item>
                    <!-- 特殊关闭人 -->
                    <a-form-item :label="$t('issue_action.closer')">
                      <p>{{ OP_USER_NAME }}</p>
                    </a-form-item>
                  </div>
                </div>
                <div v-if="(pagePermission.A1_1_3)">
                  <a-row style="margin-left:340px;">
                    <a-col :span="21">
                      <a-form-item>
                        <a-radio-group
                          v-decorator="['type']"
                          :options="determineRadio"
                          @change="determineChange"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <div v-if="NeedFlage">
                    <a-row>
                      <a-col :span="21">
                        <!-- 「责任部门」下拉 -->
                        <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
                          <net-single-tree-select
                            v-decorator="['owerDeptLv1',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
                            :transform="responseDeptTreeTransform"
                            :placeholder="$t('search.please_select')"
                            :query="{ nameCode: '${value}' }"
                            :delay="false"
                            allow-clear
                            style="width:272px;height:32px;"
                            show-search
                            url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
                            @change="DeptChange"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 责任人 -->
                        <a-form-item :label="$t('issue.champion')">
                          <net-select
                            v-decorator="[
                              'champion',
                              {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                            ]"
                            :placeholder="$t('search.please_select')"
                            :disabled="!record.owerDeptLv1"
                            url="/masterdata/v1/workflowgroupmember"
                            :query="{workflowGroupNameCode:record.owerDeptLv1}"
                            :cache="false"
                            :delay="false"
                            :transform="userOption"
                            allow-clear
                            style="width:272px;height:32px;"
                            @change="(value) => worlkChampionOrProposer(value, 'champion' ,false)"
                          >
                          </net-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 「cochair部门」下拉 -->
                        <a-form-item :label="$t('issue_workflow.D1.cochairDepartment')">
                          <net-single-tree-select
                            v-decorator="['cochairDepartment']"
                            :transform="deptTreeTransform"
                            :placeholder="$t('search.please_select')"
                            :query="{ id: '${value}'}"
                            allow-clear
                            :delay="false"
                            style="width:272px;height:32px;"
                            show-search
                            url="/sys/dept/deptList/getDeptTreeTwo"
                            @change="cochairDeptChange"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- cochair -->
                        <a-form-item :label="$t('issue_workflow.D1.cochair')">
                          <net-select
                            v-decorator="[
                              'cochair'
                            ]"
                            :placeholder="$t('search.please_select')"
                            :disabled="!record.cochairDepartment"
                            url="/sys/user/useList/getUsersByDeptPid"
                            :query="{ deptId: record.cochairDepartment,userId:'${value}' }"
                            :cache="false"
                            :delay="false"
                            :transform="userCochairOption"
                            allow-clear
                            style="width:272px;height:32px;"
                            @change="(value) => workflowRoleChange(value, 'coChair')"
                          >
                          </net-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="21">
                        <!-- 附件 -->
                        <a-form-item>
                          <template #label>
                            {{ $t('issue_workflow.attachment') }}
                          </template>
                          <!-- 责任判定 -->
                          <a-upload
                            :headers="headers"
                            :multiple="true"
                            :file-list="d1FileList"
                            :before-upload="beforeUpload"
                            :remove="file => removeFile(record.fileList)(file)"
                            :action="getUploadUrl('/issue/v1/file/upload?recType=10021006')"
                            name="file"
                            @preview="download"
                            @change="info => changeFileList(record.fileList, d1FileList)(info)"
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
                  </div>
                  <div v-if="!NeedFlage">
                    <div class="processList clearfix">
                      <div class="processTitle">
                        <!-- 请指定7钻分析责任人: -->
                        <span>*</span>{{ $t('issue_workflow.D1.champion_span') }}
                      </div>
                      <div class="processUl">
                        <ul>
                          <li class="clearfix">
                            <!-- 7钻流程 -->
                            <span>{{ $t('issue_workflow.D1.7thDiamond_flow') }} </span>
                            <span>{{ $t('issue_workflow.D1.analysis_champion') }}</span>
                          </li>
                          <li class="clearfix">
                            <!-- 第1钻： 过程是否正确？ -->
                            <span>{{ $t('issue_workflow.D1.1stDiamond') + $t('colon') + $t('issue_workflow.D1.rightProcess') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-select
                                v-decorator="[
                                  'diamondOwner1',
                                  {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                ]"
                                :placeholder="$t('search.please_select')"
                                url="/masterdata/v1/workflowgroupmember"
                                :query="{workflowGroupNameCode:'1010000000000000027'}"
                                :cache="false"
                                :delay="false"
                                :transform="userOption"
                                allow-clear
                                style="width:272px;height:32px;"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner1')"
                              >
                              </net-select>
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第2钻 工具是否正确? -->
                            <span>{{ $t('issue_workflow.D1.2ndDiamond') + $t('colon') + $t('issue_workflow.D1.rightTools') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-select
                                v-decorator="[
                                  'diamondOwner1',
                                  {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                ]"
                                :placeholder="$t('search.please_select')"
                                url="/masterdata/v1/workflowgroupmember"
                                :query="{workflowGroupNameCode:'1010000000000000027'}"
                                :cache="false"
                                :delay="false"
                                :transform="userOption"
                                allow-clear
                                style="width:272px;height:32px;"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner1')"
                              >
                              </net-select>
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第3钻 物料是否正确? -->
                            <span>{{ $t('issue_workflow.D1.3rdDiamond') + $t('colon') + $t('issue_workflow.D1.rightMaterials') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-select
                                v-decorator="[
                                  'diamondOwner1',
                                  {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                ]"
                                :placeholder="$t('search.please_select')"
                                url="/masterdata/v1/workflowgroupmember"
                                :query="{workflowGroupNameCode:'1010000000000000027'}"
                                :cache="false"
                                :delay="false"
                                :transform="userOption"
                                allow-clear
                                style="width:272px;height:32px;"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner1')"
                              >
                              </net-select>
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第4钻 物料规格检查? -->
                            <span>{{ $t('issue_workflow.D1.4thDiamond') + $t('colon') + $t('issue_workflow.D1.specification') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-select
                                v-decorator="[
                                  'diamondOwner4',
                                  {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                ]"
                                :placeholder="$t('search.please_select')"
                                url="/masterdata/v1/workflowgroupmember"
                                :query="{workflowGroupNameCode:'1010000000000000022'}"
                                :cache="false"
                                :delay="false"
                                :transform="userOption"
                                allow-clear
                                style="width:272px;height:32px;"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner4')"
                              >
                              </net-select>
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第5钻 过程变更 -->
                            <span>{{ $t('issue_workflow.D1.5thDiamond') + $t('colon') + $t('issue_workflow.D1.processChange') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-select
                                v-decorator="[
                                  'diamondOwner5',
                                  {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                ]"
                                :placeholder="$t('search.please_select')"
                                url="/masterdata/v1/workflowgroupmember"
                                :query="{workflowGroupNameCode:'1009000000000000003'}"
                                :cache="false"
                                :delay="false"
                                :transform="userOption"
                                allow-clear
                                style="width:272px;height:32px;"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner5')"
                              >
                              </net-select>
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第6钻 部件变更 -->
                            <span>{{ $t('issue_workflow.D1.6thDiamond') + $t('colon') + $t('issue_workflow.D1.partChange') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-single-tree-select
                                v-decorator="['diamondOwner6',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.champion_short') }]} ]"
                                :transform="demondUserTreeTransform"
                                :placeholder="$t('search.please_select')"
                                allow-clear
                                style="width:272px;height:32px;"
                                show-search
                                :url="`/masterdata/v1/workflowgroupname/deptUserTree`"
                                :query="{userId:'${value}',typeCode:'RESPONSIBLE_DEPARTMENT',nameCode:'1009000000000000004'}"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner6')"
                              />
                            </a-form-item>
                          </li>
                          <li class="clearfix">
                            <!-- 第7钻 是否极端复杂问题 -->
                            <span>{{ $t('issue_workflow.D1.7thDiamond') + $t('colon') + $t('issue_workflow.D1.complex') + $t('question_mark') }}</span>
                            <a-form-item>
                              <net-single-tree-select
                                v-decorator="['diamondOwner7',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.champion_short') }]} ]"
                                :transform="demondUserTreeTransform"
                                :placeholder="$t('search.please_select')"
                                allow-clear
                                style="width:272px;height:32px;"
                                show-search
                                :url="`/masterdata/v1/workflowgroupname/deptUserTree`"
                                :query="{userId:'${value}',typeCode:'RESPONSIBLE_DEPARTMENT',nameCode:'1009000000000000004'}"
                                @change="(value) => workflowRoleChange(value, 'diamondOwner7')"
                              />
                            </a-form-item>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="200105< statusCode.statusNewCode && !NeedFlage"
                  class="analysisList clearfix"
                >
                  <!-- 指定七钻负责人-->
                  <div class="processList clearfix">
                    <div class="processTitle">
                      <!-- 请指定7钻分析责任人: -->
                      <span>*</span>{{ $t('issue_workflow.D1.drilloOwner') }}
                    </div>
                    <div class="processUl">
                      <ul>
                        <li class="clearfix">
                          <!-- 7钻流程 -->
                          <span>{{ $t('issue_workflow.D1.7thDiamond_flow') }} </span>
                          <span>{{ $t('issue_workflow.D1.analysis_champion') }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第1钻： 过程是否正确？ -->
                          <span>{{ $t('issue_workflow.D1.1stDiamond') + $t('colon') + $t('issue_workflow.D1.rightProcess') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner1 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第2钻 工具是否正确? -->
                          <span>{{ $t('issue_workflow.D1.2ndDiamond') + $t('colon') + $t('issue_workflow.D1.rightTools') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner1 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第3钻 物料是否正确? -->
                          <span>{{ $t('issue_workflow.D1.3rdDiamond') + $t('colon') + $t('issue_workflow.D1.rightMaterials') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner1 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第4钻 物料规格检查? -->
                          <span>{{ $t('issue_workflow.D1.4thDiamond') + $t('colon') + $t('issue_workflow.D1.specification') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner4 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第5钻 过程变更 -->
                          <span>{{ $t('issue_workflow.D1.5thDiamond') + $t('colon') + $t('issue_workflow.D1.processChange') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner5 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第6钻 部件变更 -->
                          <span>{{ $t('issue_workflow.D1.6thDiamond') + $t('colon') + $t('issue_workflow.D1.partChange') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner6 }}</span>
                        </li>
                        <li class="clearfix">
                          <!-- 第7钻 是否极端复杂问题 -->
                          <span>{{ $t('issue_workflow.D1.7thDiamond') + $t('colon') + $t('issue_workflow.D1.complex') + $t('question_mark') }}</span>
                          <span>{{ issueDefinitionData.diamondOwner7 }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="analysisTitle">
                    <!-- 7钻分析 -->
                    <span v-if="statusCode.maxDiamonds==2">{{ $t('issue_workflow.D1.1-3stDiamond') + $t('analysis') }}</span>
                    <span v-if="statusCode.maxDiamonds==3">{{ $t('issue_workflow.D1.4thDiamond') + $t('analysis') }}</span>
                    <span v-if="statusCode.maxDiamonds==4">{{ $t('issue_workflow.D1.5thDiamond') + $t('analysis') }}</span>
                    <span v-if="statusCode.maxDiamonds==5">{{ $t('issue_workflow.D1.6thDiamond') + $t('analysis') }}</span>
                    <span v-if="statusCode.maxDiamonds==6">{{ $t('issue_workflow.D1.7thDiamond') + $t('analysis') }}</span>
                  </div>
                  <div class="analysisStep">
                    <ul>
                      <li :class="{'activefirst': statusCode.statusNewCode>=200100&&statusCode.maxDiamonds>=1}">
                        <!-- 第1钻 -->
                        <span>{{ $t('issue_workflow.D1.1stDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.rightProcess') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=200100&&statusCode.maxDiamonds>=1}">
                        <div></div>
                        <!-- 第2钻 -->
                        <span>{{ $t('issue_workflow.D1.2ndDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.rightTools') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=200100&&statusCode.maxDiamonds>=1}">
                        <div></div>
                        <!-- 第3钻 -->
                        <span>{{ $t('issue_workflow.D1.3rdDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.rightMaterials') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=200500&&statusCode.maxDiamonds>=3}">
                        <div></div>
                        <!-- 第4钻 -->
                        <span>{{ $t('issue_workflow.D1.4thDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.specification') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=200800&&statusCode.maxDiamonds>=4}">
                        <div></div>
                        <!-- 第5钻 -->
                        <span>{{ $t('issue_workflow.D1.5thDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.processChange') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=201100&&statusCode.maxDiamonds>=5}">
                        <div></div>
                        <!-- 第6钻 -->
                        <span>{{ $t('issue_workflow.D1.6thDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.partChange') }}</p>
                        <div></div>
                      </li>
                      <li :class="{'activefirst': statusCode.statusNewCode>=201400&&statusCode.maxDiamonds>=6}">
                        <div></div>
                        <!-- 第7钻 -->
                        <span>{{ $t('issue_workflow.D1.7thDiamond') }}</span>
                        <p>{{ $t('issue_workflow.D1.complex') }}</p>
                        <div></div>
                      </li>
                    </ul>
                  </div>
                  <div class="analysisTable">
                    <div
                      v-if="pagePermission.A1_5_2||pagePermission.A1_8_2||pagePermission.A1_11_2||pagePermission.A1_14_2||pagePermission.A1_17_2||pagePermission.A2_3_2"
                    >
                      <!-- 审核结果 -->
                      <div v-if="backType==='003'">
                        <div class="Dtitle">
                          <span>{{ $t('issue_workflow.approval_result') }}</span>
                        </div>
                        <!-- 审核不通过 -->
                        <a-form-item :label="$t('issue_workflow.approval')">
                          <!-- 不通过 -->
                          <p>{{ $t('issue_workflow.reject') }}</p>
                        </a-form-item>
                        <!-- 不通过理由 -->
                        <a-form-item :label="$t('issue_workflow.rejectReason')">
                          <p>{{ examineReason }}</p>
                        </a-form-item>
                      </div>

                      <!-- 状态回退 -->
                      <div v-if="backType==='004'">
                        <!-- 标题 -->
                        <div class="Dtitle examineTitle">
                          <span>{{ $t('issue_action.rollback') }}</span>
                        </div>
                        <!-- 状态回退节点 -->
                        <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                          <p style="color:#0097E0">
                            {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                          </p>
                        </a-form-item>
                        <!-- 问题回退理由 -->
                        <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                          <p>{{ examineReason }}</p>
                        </a-form-item>
                        <!-- 回退时间 -->
                        <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                          <p>{{ OPERETION_DATE }}</p>
                        </a-form-item>
                        <!-- 回退人 -->
                        <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                          <p>{{ OP_USER_NAME }}</p>
                        </a-form-item>
                      </div>

                      <!-- 特殊关闭 -->
                      <div v-if="backType==='005'">
                        <!-- 标题 -->
                        <div class="Dtitle examineTitle">
                          <span>{{ $t('issue_action.specialShutdown') }}</span>
                        </div>

                        <!-- 特殊关闭理由 -->
                        <a-form-item :label="$t('issue_action.closeReason')">
                          <p>{{ examineReason }}</p>
                        </a-form-item>
                        <!-- 特殊关闭时间 -->
                        <a-form-item :label="$t('issue_action.closeTime')">
                          <p>{{ OPERETION_DATE }}</p>
                        </a-form-item>
                        <!-- 特殊关闭人 -->
                        <a-form-item :label="$t('issue_action.closer')">
                          <p>{{ OP_USER_NAME }}</p>
                        </a-form-item>
                      </div>
                    </div>
                    <div
                      v-if="pagePermission.A1_3_3||pagePermission.A1_6_3||pagePermission.A1_9_3||pagePermission.A1_12_3||pagePermission.A1_15_3||pagePermission.A1_3_2"
                    >
                      <!-- 6钻分析 -->
                      <a-row>
                        <a-form-item class="item-title">
                          <span v-if="statusCode.maxDiamonds==2">{{ $t('issue_workflow.D1.1-3stDiamond') + $t('analysising') }}</span>
                          <span v-if="statusCode.maxDiamonds==3">{{ $t('issue_workflow.D1.4thDiamond') + $t('analysising') }}</span>
                          <span v-if="statusCode.maxDiamonds==4">{{ $t('issue_workflow.D1.5thDiamond') + $t('analysising') }}</span>
                          <span v-if="statusCode.maxDiamonds==5">{{ $t('issue_workflow.D1.6thDiamond') + $t('analysising') }}</span>
                          <span v-if="statusCode.maxDiamonds==6">{{ $t('issue_workflow.D1.7thDiamond') + $t('analysising') }}</span>
                        </a-form-item>
                      </a-row>
                      <!-- <a-table
                        :data-source="analysisData"
                        :columns="columnsAnalysis"
                        :pagination="false"
                        row-key="id"
                      >
                        <span
                          slot="operation"
                          slot-scope="text, row"
                        >
                          <a
                            href="javascript:;"
                            @click="showAnalysis(row)"
                          >{{ row.operation }}</a>
                        </span>
                      </a-table> -->
                      <a-table
                        :data-source="analysisData"
                        :pagination="false"
                        row-key="id"
                      >
                        <template v-for="col in columnsAnalysis">
                          <a-table-column
                            :key="col.dataIndex"
                            v-bind="filterTitle(col)"
                            :class="[col.dataIndex !== 'files' ? 'spantable' : '']"
                          >
                            <span slot="title">{{ $t(`AnalysisTable.${col.dataIndex}`) }}</span>
                            <template slot-scope="text,row">
                              <a-tooltip>
                                <template #title>
                                  {{ col.dataIndex==='files' ||col.dataIndex==='operation' ? '' : text }}
                                </template>
                                {{ col.dataIndex==='files' ||col.dataIndex==='operation' ? '' : text }}
                              </a-tooltip>
                              <span
                                v-if="col.dataIndex==='operation'"
                              >
                                <a
                                  href="javascript:;"
                                  @click="showAnalysis(row)"
                                >
                                  {{ row.operation }}
                                </a>
                              </span>
                              <template
                                v-if="col.dataIndex==='files'&&row.files.length"
                              >
                                <a-icon type="paper-clip" />
                                <a-badge
                                  :count="row.files.length"
                                  :number-style="{backgroundColor: '#d9d9d9', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                                  show-zero
                                />
                              </template>
                            </template>
                          </a-table-column>
                        </template>
                      </a-table>
                    </div>
                    <div
                      v-if="pagePermission.A1_4_3||pagePermission.A1_7_3||pagePermission.A1_10_3||pagePermission.A1_13_3||pagePermission.A1_16_3||pagePermission.A2_2_3"
                    >
                      <a-row>
                        <a-col :span="21">
                          <a-form-item :label="$t('issue_workflow.approval') + $t('colon')">
                            <a-radio-group
                              v-decorator="[ 'verifySeven',{rules: [{ required: true, message:$t('search.please_select')+$t('issue_workflow.approval') + $t('colon') }]}]"
                              :options="verifyRadio"
                              @change="verifySevenChange"
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <div v-if=" record.verifySeven==='1' ">
                        <!-- 结束7钻分析 -->
                        <a-row v-if="!pagePermission.A1_16_3">
                          <a-col :span="21">
                            <a-form-item :label="$t('issue_workflow.D1.endAnalysis')">
                              <a-radio-group
                                v-decorator="[ 'endSeven',{rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.D1.endAnalysis') }]}]"
                                :options="endSevenRadio"
                                @change="sevenRadioChange"
                              />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <div v-if=" record.endSeven==='1' ">
                          <a-row>
                            <a-col :span="21">
                              <!-- 「责任部门」下拉 -->
                              <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
                                <net-single-tree-select
                                  v-decorator="['owerDeptLv1',{rules: [{ required: true, message: $t('search.please_select') + $t('issue_workflow.D1.resposibleDepartment') }]} ]"
                                  :transform="responseDeptTreeTransform"
                                  :placeholder="$t('search.please_select')"
                                  :query="{ nameCode: '${value}' }"
                                  :delay="false"
                                  allow-clear
                                  style="width:272px;height:32px;"
                                  show-search
                                  url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
                                  @change="DeptChange"
                                />
                              </a-form-item>
                            </a-col>
                          </a-row>
                          <a-row>
                            <a-col :span="21">
                              <!-- 责任人 -->
                              <a-form-item :label="$t('issue.champion')">
                                <net-select
                                  v-decorator="[
                                    'champion',
                                    {rules:[{required:true, message: $t('search.please_select') + $t('issue.champion')}]}
                                  ]"
                                  :placeholder="$t('search.please_select')"
                                  :disabled="!record.owerDeptLv1"
                                  url="/masterdata/v1/workflowgroupmember"
                                  :query="{workflowGroupNameCode:record.owerDeptLv1}"
                                  :cache="false"
                                  :delay="false"
                                  :transform="userOption"
                                  allow-clear
                                  style="width:272px;height:32px;"
                                  @change="(value) => worlkChampionOrProposer(value, 'champion', false)"
                                >
                                </net-select>
                              </a-form-item>
                            </a-col>
                            <!-- 上传附件新加 -->
                            <a-col :span="21">
                              <!-- 附件 -->
                              <a-form-item :label="$t('issue_workflow.attachment')">
                                <!-- 七钻分析 -->
                                <a-upload
                                  :headers="headers"
                                  :multiple="true"
                                  :file-list="d1FileList"
                                  :before-upload="beforeUpload"
                                  :remove="file => removeFile(record.fileList)(file)"
                                  :action="getUploadUrl('/issue/v1/file/upload?recType=10021006')"
                                  name="file"
                                  @preview="download"
                                  @change="info => changeFileList(record.fileList, d1FileList)(info)"
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
                        </div>
                      </div>

                      <a-row v-if="record.verifySeven==='0'">
                        <a-col :span="21">
                          <!-- 不通过原因 -->
                          <a-form-item
                            :label="$t('issue_workflow.rejectReason2') + $t('colon')"
                            self-update
                          >
                            <v-textarea
                              v-decorator="['comment',{rules: [{ required: validInput, max: 320, message: $t('validate.less_then_160')}]} ]"
                              :placeholder="$t('search.please_input')"
                              :limit="160"
                              allow-clear
                            >
                            </v-textarea>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row v-if="record.verifySeven==='1'">
                        <a-col :span="21">
                          <!-- 备注 -->
                          <a-form-item
                            :label="$t('issue_workflow.remark')"
                            self-update
                          >
                            <v-textarea
                              v-decorator="['notes',{rules: [{ max: 320, message: $t('validate.less_then_160')}]} ]"
                              :placeholder="$t('search.please_input')"
                              :limit="160"
                              allow-clear
                            >
                            </v-textarea>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="backCurrent==1&&pagePermission.A1_1_2&&(statusCode.statusNewCode>=300100||statusCode.statusNewCode=='200105')"
              class="Dcontent D1back"
            >
              <div
                class="triangle_border_up"
                style="left:250px;"
              >
                <span></span>
              </div>
              <div
                class="Dtitle"
              >
                <!-- 提出人验证 -->
                <span>{{ issueDefinitionData.type==='0'? $t('issue_workflow.D1.confirm'):$t('issue_workflow.D1.needAnalysis') }}</span>
              </div>

              <div v-if="true">
                <a-row>
                  <a-col :span="21">
                    <!-- 责任部门 -->
                    <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
                      <p>{{ issueDefinitionData.owerDeptLv1Name }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <!-- 责任人 -->
                    <a-form-item :label="$t('issue.champion')">
                      <p>{{ issueDefinitionData.championName }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-row v-if="NeedFlage">
                    <a-col :span="21">
                      <!-- 责任部门 -->
                      <a-form-item :label="$t('issue_workflow.D1.cochairDepartment')">
                        <p>{{ issueDefinitionData.cochairDepartmentName }}</p>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row v-if="NeedFlage">
                    <a-col :span="21">
                      <!-- 责任人 -->
                      <a-form-item :label="$t('issue_workflow.D1.cochair')">
                        <p>{{ issueDefinitionData.cochairName }}</p>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="21">
                      <!-- 附件 -->
                      <a-form-item
                        :label="$t('issue_workflow.attachment')"
                        style="height:auto;"
                      >
                        <!-- 责任判定附件 -->
                        <div
                          v-if="d1FileList && d1FileList.length"
                          class="ant-upload-list ant-upload-list-text"
                          style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                        >
                          <div
                            v-for="(file, index) in d1FileList"
                            :key="index"
                            class="ant-upload-list-item ant-upload-list-item-done"
                            style="margin-top: 0; margin-right: 14px;"
                          >
                            <div class="ant-upload-list-item-info">
                              <span>
                                <a-icon
                                  type="paper-clip"
                                  style="top: 3px; left: 0;"
                                />
                                <span
                                  :title="file.name"
                                  style="padding-left: 0;"
                                  class="ant-upload-list-item-name"
                                >
                                  <a
                                    :title="file.name"
                                    :href="getDownloadURL(file.url, file.name)"
                                    :download="file.name"
                                    rel="noopener noreferrer"
                                    class="ant-upload-list-item-name"
                                    style="padding-left: 14px;"
                                  >
                                    {{ file.name }}
                                  </a>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-row>
              </div>
              <div v-if="!NeedFlage">
                <div
                  class="Dtitle examineTitle"
                >
                  <!-- 提出人验证 -->
                  <span>{{ $t('issue_workflow.D1.7thDiamond_flow') }}</span>
                </div>

                <div class="processList clearfix">
                  <!-- 7钻分析责任人 -->
                  <!-- <a-table
                    :data-source="analysisData"
                    :columns="analysisHistory"
                    :pagination="false"
                    row-key="id"
                  >
                    <span
                      slot="operation"
                      slot-scope="text, row"
                    >
                      <a
                        href="javascript:;"
                        @click="showAnalysis(row)"
                      >{{ row.operation }}</a>
                    </span>
                  </a-table> -->
                  <a-table
                    :data-source="analysisData"
                    :pagination="false"
                    row-key="id"
                  >
                    <template v-for="col in analysisHistory">
                      <a-table-column
                        :key="col.dataIndex"
                        v-bind="filterTitle(col)"
                        :class="[col.dataIndex !== 'files' ? 'spantable' : '']"
                      >
                        <span slot="title">{{ $t(`AnalysisTable.${col.dataIndex}`) }}</span>
                        <template slot-scope="text,row">
                          <a-tooltip>
                            <template #title>
                              {{ col.dataIndex==='files' ||col.dataIndex==='operation' ? '' : text }}
                            </template>
                            {{ col.dataIndex==='files' ||col.dataIndex==='operation' ? '' : text }}
                          </a-tooltip>
                          <span
                            v-if="col.dataIndex==='operation'"
                          >
                            <a
                              href="javascript:;"
                              @click="showAnalysis(row)"
                            >
                              <!-- 查看  -->
                              {{ row.operation }}
                            </a>
                          </span>
                          <template
                            v-if="col.dataIndex==='files'&&row.files.length"
                          >
                            <a-icon type="paper-clip" />
                            <a-badge
                              :count="row.files.length"
                              :number-style="{backgroundColor: '#d9d9d9', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                              show-zero
                            />
                          </template>
                        </template>
                      </a-table-column>
                    </template>
                  </a-table>
                </div>
              </div>
            </div>
            <div
              v-if="(stepCurrent===2&&backFlag===false)&&(pagePermission.A2_1_3||pagePermission.A2_3_2&&(backType==='003'||backType==='004'||backType==='005'))"
              class="Dcontent D2content"
            >
              <div
                v-if="pagePermission.A2_3_2&&(backType==='003'||backType==='004'||backType==='005')"
                class="examineResult"
              >
                <div
                  class="triangle_border_up"
                  style="left:200px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval_result') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>

                <!-- 状态回退 -->
                <div v-if="backType==='004'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.rollback') }}</span>
                  </div>
                  <!-- 状态回退节点 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                    <p style="color:#0097E0">
                      {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                    </p>
                  </a-form-item>
                  <!-- 问题回退理由 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 回退时间 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 回退人 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>

                <!-- 特殊关闭 -->
                <div v-if="backType==='005'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.specialShutdown') }}</span>
                  </div>

                  <!-- 特殊关闭理由 -->
                  <a-form-item :label="$t('issue_action.closeReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 特殊关闭时间 -->
                  <a-form-item :label="$t('issue_action.closeTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 特殊关闭人 -->
                  <a-form-item :label="$t('issue_action.closer')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>
              </div>
              <div v-if="pagePermission.A2_1_3">
                <div
                  class="triangle_border_up"
                  style="left:200px;"
                >
                  <span></span>
                </div>
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D2.cause')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'rootCauseDescription',
                          {
                            rules:[
                              {required: validInput, message: $t('search.please_input') }
                            ]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;margin-bottom:20px;"
                        :limit="1000"
                        allow-clear
                      ></v-textarea>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <!-- 附件 -->
                    <a-form-item>
                      <template #label>
                        {{ $t('issue_workflow.attachment') }}
                      </template>
                      <!-- 原因分析 -->
                      <a-upload
                        :headers="headers"
                        :multiple="true"
                        :file-list="d2FileList"
                        :before-upload="beforeUpload"
                        :remove="file => removeFile(record.fileList)(file)"
                        :action="getUploadUrl('/issue/v1/file/upload?recType=10021007')"
                        name="file"
                        @preview="download"
                        @change="info => changeFileList(record.fileList, d2FileList)(info)"
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
              </div>
            </div>
            <div
              v-if="backCurrent===2&&pagePermission.A2_1_2&&statusCode.statusNewCode!=300100"
              class="Dcontent D2back"
            >
              <div v-if="pagePermission.A2_1_2">
                <div
                  class="triangle_border_up"
                  style="left:200px;"
                >
                  <span></span>
                </div>
                <a-row>
                  <!-- 根本原因 -->
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D2.cause')">
                      <p>{{ rootCauseData.rootCauseDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <!-- 附件 -->
                    <a-form-item
                      :label="$t('issue_workflow.attachment')"
                      style="height:auto;"
                    >
                      <!-- 原因分析附件 -->
                      <div
                        v-if="d2FileList && d2FileList.length"
                        class="ant-upload-list ant-upload-list-text"
                        style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                      >
                        <div
                          v-for="(file, index) in d2FileList"
                          :key="index"
                          class="ant-upload-list-item ant-upload-list-item-done"
                          style="margin-top: 0; margin-right: 14px;"
                        >
                          <div class="ant-upload-list-item-info">
                            <span>
                              <a-icon
                                type="paper-clip"
                                style="top: 3px; left: 0;"
                              />
                              <span
                                :title="file.name"
                                style="padding-left: 0;"
                                class="ant-upload-list-item-name"
                              >
                                <a
                                  :title="file.name"
                                  :href="getDownloadURL(file.url, file.name)"
                                  :download="file.name"
                                  rel="noopener noreferrer"
                                  class="ant-upload-list-item-name"
                                  style="padding-left: 14px;"
                                >
                                  {{ file.name }}
                                </a>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div v-if="(stepCurrent===backCurrent)&&(pagePermission.A2_2_3)">
                  <div class="examine">
                    <div class="Dtitle examineTitle">
                      <!-- 审核 -->
                      <span>{{ $t('issue_workflow.approval') }}</span>
                    </div>
                    <a-row>
                      <a-col :span="21">
                        <!-- 是否通过审核 -->
                        <a-form-item :label="$t('issue_workflow.approvalResult')">
                          <a-radio-group
                            v-decorator="[ 'isPass',{rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}]"
                            :options="verifyRadio"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="record.isPass==='0'">
                      <a-col :span="21">
                        <!-- 不通过原因 -->
                        <a-form-item
                          :label="$t('issue_workflow.rejectReason2')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="['comment',{rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]} ]"
                            :placeholder="$t('search.please_input')"
                            :limit="160"
                            allow-clear
                          >
                          </v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row v-if="record.isPass==='1'">
                      <a-col :span="21">
                        <!-- 备注 -->
                        <a-form-item
                          :label="$t('issue.remark')"
                          self-update
                        >
                          <v-textarea
                            v-decorator="['notes',{rules: [{max: 320, message: $t('validate.less_then_160')}]} ]"
                            :placeholder="$t('search.please_input')"
                            :limit="160"
                            allow-clear
                          >
                          </v-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="(stepCurrent===3&&backFlag===false)&&((pagePermission.A3_3_2&&(backType==='003'||backType==='004'||backType==='005'))||pagePermission.A3_1_3)"
              class="Dcontent D3content"
            >
              <div
                v-if="pagePermission.A3_3_2"
                class="examineResult"
                style="left:620px;"
              >
                <div
                  class="triangle_border_up"
                  style="left:380px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval_result') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>

                <!-- 状态回退 -->
                <div v-if="backType==='004'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.rollback') }}</span>
                  </div>
                  <!-- 状态回退节点 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                    <p style="color:#0097E0">
                      {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                    </p>
                  </a-form-item>
                  <!-- 问题回退理由 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 回退时间 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 回退人 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>

                <!-- 特殊关闭 -->
                <div v-if="backType==='005'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.specialShutdown') }}</span>
                  </div>

                  <!-- 特殊关闭理由 -->
                  <a-form-item :label="$t('issue_action.closeReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 特殊关闭时间 -->
                  <a-form-item :label="$t('issue_action.closeTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 特殊关闭人 -->
                  <a-form-item :label="$t('issue_action.closer')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>
              </div>
              <div v-if="pagePermission.A3_1_3">
                <div class="Dtitle">
                  <!-- 措施制定 -->
                  <span>{{ $t('issue_workflow.D3.processName') }}</span>
                </div>
                <!-- 短期措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D3.shortSolution')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'icaDescription'
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施断点vin -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      self-update
                      :label="$t('issue_workflow.D3.shortTermVin')"
                    >
                      <v-input
                        v-decorator="[
                          'icaBreakpointVin',
                          {rules: [{ validator: vinVer }]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        allow-clear
                        style="width: 231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施断点时间 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.shortTermTime')">
                      <a-date-picker
                        v-decorator="[
                          'icaBreakpointTime',

                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate1"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D3.longSolution')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'pcaDescription',
                          {rules: [
                            { required: true, message: $t('search.please_input')+$t('issue_workflow.D3.longSolution') }
                          ]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 市场车辆处理措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D3.marketMeasures')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'carTreatmentMeasures'
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 小批量验证 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D3.pilotVlidate')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'smallBatchValidation',
                        ]"
                        allow-clear
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 附件 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item>
                      <template #label>
                        {{ $t('issue_workflow.attachment') }}
                      </template>
                      <!-- 措施制定 -->
                      <a-upload
                        :multiple="true"
                        :headers="headers"
                        :file-list="d3FileList"
                        :before-upload="beforeUpload"
                        :remove="file => removeFile(record.fileList)(file)"
                        :action="getUploadUrl('/issue/v1/file/upload?recType=10021008')"
                        name="file"
                        @preview="download"
                        @change="info => changeFileList(record.fileList, d3FileList)(info)"
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
                <!-- 长期措施实施计划日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D3.longSolutionImplementDate')"
                    >
                      <a-date-picker
                        v-decorator="[
                          'pcaPlanTime',
                          {rules: [
                            { required: true, message: $t('search.please_select')+$t('issue_workflow.D3.longSolutionImplementDate') },
                          ]}
                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate1"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施验证计划日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.longSolutionValidationDate')">
                      <a-date-picker
                        v-decorator="[
                          'pcaValidPlanTime',
                          {rules: [
                            { required: true, message:$t('search.please_select')+$t('issue_workflow.D3.longSolutionValidationDate') },
                          ]}
                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate2"
                        :disabled="!record.pcaPlanTime"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 计划关闭日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.closureDate')">
                      <a-date-picker
                        v-decorator="[
                          'estimatedClosureTime',
                          {rules: [
                            { required: true, message:$t('search.please_select')+$t('issue_workflow.D3.closureDate') },
                          ]}
                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate3"
                        :disabled="!record.pcaValidPlanTime"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div
              v-if="backCurrent==3&&pagePermission.A3_1_2&&statusCode.statusNewCode!=400100"
              class="Dcontent D3back"
            >
              <div v-if="pagePermission.A3_1_2&&statusCode.statusNewCode!=400100">
                <div
                  class="triangle_border_up"
                  style="left:380px;"
                >
                  <span></span>
                </div>
                <!-- <div class="Dtitle">
                  <span>措施制定</span>
                </div> -->
                <!-- 短期措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.shortSolution')">
                      <p>{{ stepMeasures.icaDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施断点vin -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.shortTermVin')">
                      <p>{{ stepMeasures.icaBreakpointVin }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施断点时间 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.shortTermTime')">
                      <p>{{ stepMeasures.icaBreakpointTime| GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.longSolution')">
                      <p>{{ stepMeasures.pcaDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 市场车辆处理措施 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.marketMeasures')">
                      <p>{{ stepMeasures.carTreatmentMeasures }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 小批量验证 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.pilotVlidate')">
                      <p>{{ stepMeasures.smallBatchValidation }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.attachment')"
                      style="height:auto;"
                    >
                      <!-- 措施制定附件 -->
                      <div
                        v-if="d3FileList && d3FileList.length"
                        class="ant-upload-list ant-upload-list-text"
                        style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                      >
                        <div
                          v-for="(file, index) in d3FileList"
                          :key="index"
                          class="ant-upload-list-item ant-upload-list-item-done"
                          style="margin-top: 0; margin-right: 14px;"
                        >
                          <div class="ant-upload-list-item-info">
                            <span>
                              <a-icon
                                type="paper-clip"
                                style="top: 3px; left: 0;"
                              />
                              <span
                                :title="file.name"
                                style="padding-left: 0;"
                                class="ant-upload-list-item-name"
                              >
                                <a
                                  :title="file.name"
                                  :href="getDownloadURL(file.url, file.name)"
                                  :download="file.name"
                                  rel="noopener noreferrer"
                                  class="ant-upload-list-item-name"
                                  style="padding-left: 14px;"
                                >
                                  {{ file.name }}
                                </a>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施实施计划日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.longSolutionImplementDate')">
                      <p>{{ stepMeasures.pcaPlanTime | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施验证计划日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.longSolutionValidationDate')">
                      <p>{{ stepMeasures.pcaValidPlanTime | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 计划关闭日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D3.closureDate')">
                      <p>{{ stepMeasures.estimatedClosureTime | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div v-if="(stepCurrent===backCurrent)&&pagePermission.A3_2_3">
              <div class="Dcontent1 examine">
                <!-- 审核 -->
                <div class="Dtitle examineTitle">
                  <span>{{ $t('issue_workflow.approval') }}</span>
                </div>
                <!-- 是否通过审核 -->
                <a-form-item :label="$t('issue_workflow.approvalResult')">
                  <a-radio-group
                    v-decorator="[
                      'isPass',
                      {rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <!-- 不通过理由 -->
                <a-form-item
                  v-if="record.isPass==='0'"
                  :label="$t('issue_workflow.rejectReason')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'comment',
                      {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
                <!-- 备注 -->
                <a-form-item
                  v-if="record.isPass==='1'"
                  :label="$t('issue_workflow.remark')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'notes',
                      {rules: [{ max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>
            <div
              v-if="(stepCurrent===4&&backFlag===false)&&((pagePermission.A4_3_2&&(backType==='003'||backType==='004'||backType==='005'))||pagePermission.A4_1_3)"
              class="Dcontent D4content"
            >
              <div
                v-if="pagePermission.A4_3_2"
                class="examineResult"
              >
                <div
                  class="triangle_border_up"
                  style="left:570px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval_result') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>

                <!-- 状态回退 -->
                <div v-if="backType==='004'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.rollback') }}</span>
                  </div>
                  <!-- 状态回退节点 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                    <p style="color:#0097E0">
                      {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                    </p>
                  </a-form-item>
                  <!-- 问题回退理由 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 回退时间 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 回退人 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>

                <!-- 特殊关闭 -->
                <div v-if="backType==='005'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.specialShutdown') }}</span>
                  </div>

                  <!-- 特殊关闭理由 -->
                  <a-form-item :label="$t('issue_action.closeReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 特殊关闭时间 -->
                  <a-form-item :label="$t('issue_action.closeTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 特殊关闭人 -->
                  <a-form-item :label="$t('issue_action.closer')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>
              </div>
              <div v-if="pagePermission.A4_1_3">
                <!-- 短期效果 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D4.shortEffect')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'icaExecDescription'
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施实施日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.sortSolutionImplementDate')">
                      <a-date-picker
                        v-decorator="[
                          'icaExecTime'
                        ]"
                        :placeholder="$t('search.please_select')"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施实施描述 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D4.longTermEffect')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'pcaExecDescription',
                          {rules: [
                            { required: true, message:$t('search.please_input')+$t('issue_workflow.D4.longTermEffect') }
                          ]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 附件 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item>
                      <template #label>
                        {{ $t('issue_workflow.attachment') }}
                      </template>
                      <!-- 措施实施 -->
                      <a-upload
                        :headers="headers"
                        :multiple="true"
                        :file-list="d4FileList"
                        :before-upload="beforeUpload"
                        :remove="file => removeFile(record.fileList)(file)"
                        :action="getUploadUrl('/issue/v1/file/upload?recType=10021009')"
                        name="file"
                        @preview="download"
                        @change="info => changeFileList(record.fileList, d4FileList)(info)"
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
                <!-- 长期措施实施日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.longSolutionImplementDate')">
                      <a-date-picker
                        v-decorator="[
                          'pcaExecTime',
                          {rules: [{ required: true, message: $t('search.please_input')+$t('issue_workflow.D4.longSolutionImplementDate') }]}
                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabled-date="disabledDate"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div
              v-if="backCurrent===4&&pagePermission.A4_1_2&&statusCode.statusNewCode!=500100"
              class="Dcontent D4back"
            >
              <div v-if="pagePermission.A4_1_2">
                <div
                  class="triangle_border_up"
                  style="left:570px;"
                >
                  <span></span>
                </div>
                <!-- 短期效果 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.shortEffect')">
                      <p>{{ stepImplementation.icaExecDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 短期措施实施日期  -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.sortSolutionImplementDate')">
                      <p>{{ stepImplementation.icaExecTime | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施实施描述 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.longTermEffect')">
                      <p>{{ stepImplementation.pcaExecDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 附件 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.attachment')"
                      style="height:auto;"
                    >
                      <!-- 措施实施附件 -->
                      <div
                        v-if="d4FileList && d4FileList.length"
                        class="ant-upload-list ant-upload-list-text"
                        style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                      >
                        <div
                          v-for="(file, index) in d4FileList"
                          :key="index"
                          class="ant-upload-list-item ant-upload-list-item-done"
                          style="margin-top: 0; margin-right: 14px;"
                        >
                          <div class="ant-upload-list-item-info">
                            <span>
                              <a-icon
                                type="paper-clip"
                                style="top: 3px; left: 0;"
                              />
                              <span
                                :title="file.name"
                                style="padding-left: 0;"
                                class="ant-upload-list-item-name"
                              >
                                <a
                                  :title="file.name"
                                  :href="getDownloadURL(file.url, file.name)"
                                  :download="file.name"
                                  rel="noopener noreferrer"
                                  class="ant-upload-list-item-name"
                                  style="padding-left: 14px;"
                                >
                                  {{ file.name }}
                                </a>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 长期措施实施日期 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D4.longSolutionImplementDate')">
                      <p>{{ stepImplementation.pcaExecTime | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div
                v-if="(stepCurrent===backCurrent)&&pagePermission.A4_2_3"
                class="examine"
              >
                <div class="Dtitle examineTitle">
                  <!-- 审核 -->
                  <span>{{ $t('issue_workflow.approval') }}</span>
                </div>
                <!-- 是否通过审核 -->
                <a-form-item :label="$t('issue_workflow.approvalResult')">
                  <a-radio-group
                    v-decorator="[
                      'isPass',
                      {rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <!-- 不通过理由 -->
                <a-form-item
                  v-if="record.isPass==='0'"
                  :label="$t('issue_workflow.rejectReason')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'comment',
                      {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
                <!-- 备注 -->
                <a-form-item
                  v-if="record.isPass==='1'"
                  :label="$t('issue_workflow.remark')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'notes',
                      {rules: [{ max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>

            <div
              v-if="(stepCurrent===5&&backFlag===false)&&((pagePermission.A5_3_2&&(backType==='003'||backType==='004'||backType==='005'))||pagePermission.A5_1_3)"
              class="Dcontent D5content"
            >
              <div
                v-if="pagePermission.A5_3_2"
                class="examineResult"
              >
                <div
                  class="triangle_border_up"
                  style="left:810px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval_result') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>

                <!-- 状态回退 -->
                <div v-if="backType==='004'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.rollback') }}</span>
                  </div>
                  <!-- 状态回退节点 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                    <p style="color:#0097E0">
                      {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                    </p>
                  </a-form-item>
                  <!-- 问题回退理由 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 回退时间 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 回退人 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>

                <!-- 特殊关闭 -->
                <div v-if="backType==='005'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.specialShutdown') }}</span>
                  </div>

                  <!-- 特殊关闭理由 -->
                  <a-form-item :label="$t('issue_action.closeReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 特殊关闭时间 -->
                  <a-form-item :label="$t('issue_action.closeTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 特殊关闭人 -->
                  <a-form-item :label="$t('issue_action.closer')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>
              </div>
              <div v-if="pagePermission.A5_1_3">
                <!-- 效果验证 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D5.effectValidation')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'description',
                          {rules: [{ required: true, message:$t('search.please_input')+$t('issue_workflow.D5.effectValidation') }]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 经验教训 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="$t('issue_workflow.D5.lessonsLearn')"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'lessonsLearn'
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 附件 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item>
                      <template #label>
                        {{ $t('issue_workflow.attachment') }}
                      </template>
                      <!-- 效果验证 -->
                      <a-upload
                        :headers="headers"
                        :multiple="true"
                        :file-list="d5FileList"
                        :before-upload="beforeUpload"
                        :remove="file => removeFile(record.fileList)(file)"
                        :action="getUploadUrl('/issue/v1/file/upload?recType=10021010')"
                        name="file"
                        @preview="download"
                        @change="info => changeFileList(record.fileList, d5FileList)(info)"
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
                <!-- 断点VIN -->
                <a-row style="margin-left:190px;">
                  <a-col :span="10">
                    <a-form-item
                      :label="$t('issue_workflow.D5.breakpointVIN')"
                      self-update
                    >
                      <v-input
                        v-decorator="[
                          'breakpointVin',
                          {rules: [{ validator: vinVer }]}
                        ]"
                        allow-clear
                        :placeholder="$t('search.please_input')"
                      />
                    </a-form-item>
                  </a-col>
                  <!-- 断点时间 -->
                  <a-col :span="10">
                    <a-form-item :label="$t('issue_workflow.D5.breakpointDate')">
                      <a-date-picker
                        v-decorator="[
                          'breakpointDate',

                        ]"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        style="width:231px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div
                  class="fileUpdate clearfix"
                  style="margin-bottom:24px;margin-left:10px;"
                >
                  <!-- 涉及文件更新 -->
                  <a-col :span="21">
                    <a-form-item
                      :label="$t(`issue_workflow.D5.DocumentUpdated`)"
                    >
                      <div class="updateTable">
                        <a-table
                          :data-source="updateData"
                          :pagination="false"
                          row-key="id"
                        >
                          <template v-for="col in columnsUpdate">
                            <a-table-column
                              :key="col.dataIndex"
                              v-bind="filterTitle(col)"
                              :class="[col.dataIndex !== 'files' ? 'spantable' : '']"
                            >
                              <span slot="title">{{ $t(`fileUpdateTable.${col.dataIndex}`) }}</span>
                              <template slot-scope="text, row">
                                <a-tooltip>
                                  <template #title>
                                    {{ col.dataIndex==='files' ? '' : text }}
                                  </template>
                                  {{ col.dataIndex==='files' ? '' : text }}
                                </a-tooltip>
                                <span
                                  v-if="col.dataIndex==='operation'"
                                >
                                  <a
                                    v-if="pagePermission.A5_1_3"
                                    href="javascript:;"
                                    @click="showUpdate(row)"
                                  >
                                    <!-- 编辑 -->
                                    {{ $t(`fileUpdateTable.edit`) }}
                                  </a>
                                  {{ `\0\0` }}
                                  <a
                                    v-if="pagePermission.A5_1_1"
                                    href="javascript:;"
                                    @click="UpdateFind(row)"
                                  >
                                    <!-- 查看  -->
                                    {{ $t(`fileUpdateTable.view`) }}
                                  </a>
                                  {{ `\0\0` }}
                                  <a
                                    v-if="row.delFlag==='2'"
                                    href="javascript:;"
                                    style="margin-left:10px;"
                                    @click="DelUpdate(row)"
                                  >
                                    <!-- 删除 -->
                                    {{ $t(`fileUpdateTable.delete`) }}
                                  </a>
                                </span>
                                <template
                                  v-if="col.dataIndex==='files'&&row.files.length"
                                >
                                  <a-icon type="paper-clip" />
                                  <a-badge
                                    :count="row.files.length"
                                    :number-style="{backgroundColor: '#d9d9d9', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                                    show-zero
                                  />
                                </template>
                              </template>
                            </a-table-column>
                          </template>
                        </a-table>
                        <div
                          style="text-align:center;cursor:pointer;color: rgba(0, 0, 0, 0.85);"
                          @click="showUpdate()"
                        >
                          <a-icon type="plus-circle" />
                          <!-- 添加新的更新文件 -->
                          {{ $t('issue_workflow.D5.addUpdateFile') }}
                        </div>
                      </div>
                    </a-form-item>
                  </a-col>
                </div>
              </div>
            </div>

            <div
              v-if="(backCurrent==5&&(pagePermission.A5_1_2||pagePermission.A5_7_2)&&statusCode.statusNewCode!=600100)"
              class="Dcontent D5back"
            >
              <div
                v-if="statusCode.statusMaxCode === '700200' && pagePermission.A5_7_2"
                class="examineResult"
              >
                <div
                  style="left:760px;"
                >
                  <span></span>
                </div>
                <!-- 审核结果 -->
                <div v-if="backType==='003'">
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.D5.leaderReview') }}</span>
                  </div>
                  <!-- 审核不通过 -->
                  <a-form-item :label="$t('issue_workflow.approval')">
                    <!-- 不通过 -->
                    <p>{{ $t('issue_workflow.reject') }}</p>
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item :label="$t('issue_workflow.rejectReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                </div>

                <!-- 状态回退 -->
                <div v-if="backType==='004'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.rollback') }}</span>
                  </div>
                  <!-- 状态回退节点 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallBackDetail')">
                    <p style="color:#0097E0">
                      {{ BEFORE_NODE }}->{{ CURRENT_NODE }}
                    </p>
                  </a-form-item>
                  <!-- 问题回退理由 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 回退时间 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 回退人 -->
                  <a-form-item :label="$t('issue_workflow.D0.fallbackPerson')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>

                <!-- 特殊关闭 -->
                <div v-if="backType==='005'">
                  <!-- 标题 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_action.specialShutdown') }}</span>
                  </div>

                  <!-- 特殊关闭理由 -->
                  <a-form-item :label="$t('issue_action.closeReason')">
                    <p>{{ examineReason }}</p>
                  </a-form-item>
                  <!-- 特殊关闭时间 -->
                  <a-form-item :label="$t('issue_action.closeTime')">
                    <p>{{ OPERETION_DATE }}</p>
                  </a-form-item>
                  <!-- 特殊关闭人 -->
                  <a-form-item :label="$t('issue_action.closer')">
                    <p>{{ OP_USER_NAME }}</p>
                  </a-form-item>
                </div>
              </div>

              <div v-if="pagePermission.A5_1_2">
                <div
                  class="triangle_border_up"
                  style="left:810px;"
                >
                  <span></span>
                </div>
                <!-- 效果验证 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D5.effectValidation')">
                      <p>{{ stepEffect.description }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row style="margin-left:200px;">
                  <!-- 断点VIN -->
                  <a-col :span="10">
                    <a-form-item :label="$t('issue_workflow.D5.breakpointVIN')">
                      <p>{{ stepEffect.breakpointVin }}</p>
                    </a-form-item>
                  </a-col>
                  <!-- 断点时间 -->
                  <a-col :span="10">
                    <a-form-item :label="$t('issue_workflow.D5.breakpointDate')">
                      <p>{{ stepEffect.breakpointDate | GLOBAL_SELECT_DATE_FORMAT }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 经验教训 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.D5.lessonsLearn')">
                      <p>{{ stepEffect.lessonsLearn }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 附件 -->
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="$t('issue_workflow.attachment')">
                      <!-- 效果验证附件 -->
                      <div
                        v-if="d5FileList && d5FileList.length"
                        class="ant-upload-list ant-upload-list-text"
                        style="overflow-y: auto; max-height: 82px; margin-top: 8px; z-index: 10;"
                      >
                        <div
                          v-for="(file, index) in d5FileList"
                          :key="index"
                          class="ant-upload-list-item ant-upload-list-item-done"
                          style="margin-top: 0; margin-right: 14px;"
                        >
                          <div class="ant-upload-list-item-info">
                            <span>
                              <a-icon
                                type="paper-clip"
                                style="top: 3px; left: 0;"
                              />
                              <span
                                :title="file.name"
                                style="padding-left: 0;"
                                class="ant-upload-list-item-name"
                              >
                                <a
                                  :title="file.name"
                                  :href="getDownloadURL(file.url, file.name)"
                                  :download="file.name"
                                  rel="noopener noreferrer"
                                  class="ant-upload-list-item-name"
                                  style="padding-left: 14px;"
                                >
                                  {{ file.name }}
                                </a>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <!-- 涉及文件更新 -->
                <a-row style="margin-left: -66px;margin-bottom:24px;margin-top:12px;">
                  <a-form-item :label="$t('issue_workflow.D5.DocumentUpdated')">
                    <div
                      class="updateTable"
                      style="margin-bottom:24px;"
                    >
                      <a-table
                        :data-source="updateData"
                        :pagination="false"
                        row-key="id"
                      >
                        <template v-for="col in columnsUpdate">
                          <a-table-column
                            :key="col.dataIndex"
                            v-bind="filterTitle(col)"
                            :class="[col.dataIndex !== 'files' ? 'spantable' : '']"
                          >
                            <span slot="title">{{ $t(`fileUpdateTable.${col.dataIndex}`) }}</span>
                            <template slot-scope="text,row">
                              <a-tooltip>
                                <template #title>
                                  {{ col.dataIndex==='files' ? '' : text }}
                                </template>
                                {{ col.dataIndex==='files' ? '' : text }}
                              </a-tooltip>
                              <span
                                v-if="col.dataIndex==='operation'"
                              >
                                <a
                                  href="javascript:;"
                                  @click="UpdateFind(row)"
                                >
                                  <!-- 查看  -->
                                  {{ $t(`fileUpdateTable.view`) }}
                                </a>
                              </span>
                              <template
                                v-if="col.dataIndex==='files'&&row.files.length"
                              >
                                <a-icon type="paper-clip" />
                                <a-badge
                                  :count="row.files.length"
                                  :number-style="{backgroundColor: '#d9d9d9', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                                  show-zero
                                />
                              </template>
                            </template>
                          </a-table-column>
                        </template>
                      </a-table>
                    </div>
                  </a-form-item>
                </a-row>

                <div
                  v-if="parseInt(statusCode.statusNewCode, 10) >600600||stepCurrent<5"
                >
                  <div
                    class="Dtitle examineTitle"
                    style="padding-bottom:24px;"
                  >
                    <!-- 提出人验证 -->
                    <span>{{ $t('issue_workflow.personverification') }}</span>
                  </div>
                  <!-- 验证结果 -->
                  <a-row :gutter="24">
                    <a-col :span="21">
                      <a-form-item
                        :label="$t('issue_workflow.D5.validationConclusion')"
                        :span="22"
                        self-update
                      >
                        <p>{{ stepEffect.proposerVerification }}</p>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div
                v-if="(stepCurrent===backCurrent)&&(pagePermission.A5_2_3||pagePermission.A4_2_3)"
                class="examine"
              >
                <div class="Dtitle examineTitle">
                  <!-- 审核 -->
                  <span>{{ $t('issue_workflow.approval') }}</span>
                </div>
                <!-- 是否通过审核 -->
                <a-form-item :label="$t('issue_workflow.approvalResult')">
                  <a-radio-group
                    v-decorator="[
                      'isPass',
                      {rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <!-- 不通过理由 -->
                <a-form-item
                  v-if="record.isPass==='0'"
                  :label="$t('issue_workflow.rejectReason')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'comment',
                      {rules: [{ required: true,max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
                <!-- 备注 -->
                <a-form-item
                  v-if="record.isPass==='1'"
                  :label="$t('issue_workflow.remark')"
                  self-update
                >
                  <v-textarea
                    v-decorator="[
                      'notes',
                      {rules: [{ max: 320, message: $t('validate.less_then_160')}]}
                    ]"
                    :placeholder="$t('search.please_input')"
                    style="width:572px;"
                    :limit="160"
                    allow-clear
                  />
                </a-form-item>
              </div>
              <div v-if="pagePermission.A5_4_3">
                <div class="Dtitle examineTitle">
                  <!-- 提出人验证 -->
                  <span>{{ $t('issue_workflow.personverification') }}</span>
                </div>
                <a-row :gutter="24">
                  <a-col :span="21">
                    <!-- 验证结果 -->
                    <a-form-item
                      :label="$t('issue_workflow.validationResults')"
                      :span="22"
                      self-update
                    >
                      <v-textarea
                        v-decorator="[
                          'proposerVerification',
                          {rules: [
                            {required: true, message: $t('search.please_input')+ $t('issue_workflow.validationResults')}
                          ]}
                        ]"
                        :placeholder="$t('search.please_input')"
                        style="width:572px;"
                        :limit="1000"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div
                  v-if="pagePermission.A5_2_3"
                  class="Dcontent1 examine"
                >
                  <!-- 审核 -->
                  <div class="Dtitle examineTitle">
                    <span>{{ $t('issue_workflow.approval') }}</span>
                  </div>
                  <!-- 是否通过审核 -->
                  <a-form-item :label="$t('issue_workflow.approvalResult')">
                    <a-radio-group
                      v-decorator="[
                        'isPass',
                        {rules: [{ required: true, message: $t('search.please_select')+$t('issue_workflow.approvalResult') }]}
                      ]"
                      :options="recurrencePreventionRadio"
                    />
                  </a-form-item>
                  <!-- 不通过理由 -->
                  <a-form-item
                    v-if="record.isPass==='0'"
                    :label="$t('issue_workflow.rejectReason')"
                    self-update
                  >
                    <v-textarea
                      v-decorator="[
                        'comment',
                        {rules: [{ required: true, message: $t('search.please_input')+$t('issue_workflow.rejectReason') }]}
                      ]"
                      :placeholder="$t('search.please_input')"
                      style="width:572px;"
                      :limit="160"
                      allow-clear
                    />
                  </a-form-item>
                  <!-- 备注 -->
                  <a-form-item
                    v-if="record.isPass==='1'"
                    :label="$t('issue_workflow.remark')"
                    self-update
                  >
                    <v-textarea
                      v-decorator="[
                        'notes',
                        {rules: [{ max: 320, message: $t('validate.less_then_160')}]}
                      ]"
                      :placeholder="$t('search.please_input')"
                      style="width:572px;"
                      :limit="160"
                      allow-clear
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
            <!-- 正常关闭 -->
            <div
              v-if="(backCurrent==6)&&pagePermission.A6_1_2&&(statusCode.statusNewCode=700300)"
              class="Dcontent D6back"
            >
              <!-- 特殊关闭 -->
              <div
                v-if="statusSpecialClose"
                class="triangle_border_up"
                style="left:740px;"
              >
                <span></span>
              </div>
              <a-row>
                <a-col>
                  <a-col
                    :span="24"
                    style="text-align:center;"
                  >
                    <!-- 该问题已跟随主问题关闭 -->
                    <p>
                      {{ $t('issue_reason.closed_with_main_issue') }}
                    </p>
                  </a-col>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-card>
      </a-form>
      <!-- 重复关联问题列表 -->
      <!-- <div
        v-if="visibleDuplicateTable"
        class="cardTitle"
        style="margin:16px auto;"
      >
        <div
          class="collapse-title"
        >
          {{ $t('issue_action.DAQuestionList') }}
        </div>
        <div
          v-if="DetailSuppely"
        >
          <a-table
            :data-source="dataDuplicate"
            :pagination="true"
            row-key="id"
            class="duplicate-table"
          >
            <template v-for="col in columnsDuplicate">
              <a-table-column
                :key="col.dataIndex"
                v-bind="col"
                :title="$t(`duplicateTable.${col.dataIndex}`)"
              >
                <template slot-scope="text,row">
                  <a-tooltip v-if="col.dataIndex!=='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    {{ text }}
                  </a-tooltip>
                  <a-tooltip v-if="col.dataIndex==='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    <span>
                      <a
                        href="javascript:;"
                        @click="gotoDetail(row)"
                      >
                        {{ row.code }}
                      </a>
                    </span>
                  </a-tooltip>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </div> -->
      <a-form
        v-if="visibleDuplicateTable"
        class="shadown-block-normal ant-advanced-search-form"
        style="padding-top: 4px;"
      >
        <div
          class="collapse-title"
        >
          {{ $t('issue_action.DAQuestionList') }}
        </div>
        <!-- 重复关联表格 -->
        <div
          v-if="DetailSuppely"
          style="margin:0 32px 16px;"
          class="duplicate-table"
        >
          <a-table
            :data-source="dataDuplicate"
            :pagination="true"
            row-key="id"
          >
            <template v-for="col in columnsDuplicate">
              <a-table-column
                :key="col.dataIndex"
                v-bind="col"
                :title="$t(`duplicateTable.${col.dataIndex}`)"
              >
                <template slot-scope="text,row">
                  <a-tooltip v-if="col.dataIndex!=='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    {{ text }}
                  </a-tooltip>
                  <a-tooltip v-if="col.dataIndex==='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    <span>
                      <a
                        href="javascript:;"
                        @click="gotoDetail(row)"
                      >
                        {{ row.code }}
                      </a>
                    </span>
                  </a-tooltip>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-form>
      <!-- 问题裂变 -->
      <a-form
        v-if="visibleFission"
        class="shadown-block-normal ant-advanced-search-form"
        style="padding-top: 4px;"
      >
        <!-- 裂变问题 -->
        <div
          class="collapse-title"
        >
          {{ $t('fissionApplication.fissionTitle') }}
        </div>
        <div
          style="margin:0 32px 16px;"
          class="duplicate-table"
        >
          <a-table
            v-if="visibleFission"
            :data-source="dataFission"
            :pagination="true"
            row-key="id"
          >
            <template v-for="col in columnsFission">
              <a-table-column
                :key="col.dataIndex"
                v-bind="col"
                :title="$t(`duplicateTable.${col.dataIndex}`)"
              >
                <template slot-scope="text,row">
                  <a-tooltip v-if="col.dataIndex!=='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    {{ text }}
                  </a-tooltip>
                  <a-tooltip v-if="col.dataIndex==='code'">
                    <template #title>
                      {{ text }}
                    </template>
                    <span>
                      <a
                        href="javascript:;"
                        @click="gotoDetail(row)"
                      >
                        {{ row.code }}
                      </a>
                    </span>
                  </a-tooltip>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-form>
      <a-form
        v-if="pagePermission.A4_2"
        class="shadown-block-normal ant-advanced-search-form"
        style="padding-top: 4px;"
      >
        <div
          class="collapse-title"
          @click="SuppelyOpen"
        >
          <a-icon
            :type="SuppelyIcon"
          />
          <!-- 操作记录 -->
          {{ $t('operationTable.operation') }}
        </div>
        <!-- 操作记录表格 -->
        <div
          v-if="DetailSuppely"
          style="margin:0 32px 16px;"
          class="recordTable"
        >
          <a-table
            :data-source="dataRecord"
            :pagination="true"
            row-key="id"
            class="duplicate-table"
          >
            <template v-for="col in columnsRecord">
              <a-table-column
                :key="col.dataIndex"
                v-bind="col"
                :title="$t(`operationTable.${col.dataIndex}`)"
              >
                <template slot-scope="text">
                  <a-tooltip>
                    <template #title>
                      {{ text }}
                    </template>
                    {{ text }}
                  </a-tooltip>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      <!-- </a-collapse-panel>
        </a-collapse> -->
      </a-form>
    </div>
  </div>
</template>
<script>
import {
  autoUpdateFileds,
  createFormFields,
} from '@util/formhelper.js';
import {
  createNamespacedHelpers,
} from 'vuex';
import moment from 'moment';
import { clearObserver, transform, treeTransform } from '@util/datahelper.js';
import timeFormatMix from '~~/time-format.js';
import attachmentMix from '~~/issue-attachment.js';
import { toggleForbidScrollThrough, enableScroll } from '~~/scroll.js';

const {
  mapActions,
} = createNamespacedHelpers('question');
const columns = [{
  title: '序号',
  dataIndex: 'no',
  scopedSlots: {
    customRender: 'no',
  },
}, {
  title: '附件名称',
  dataIndex: 'name',
  scopedSlots: {
    customRender: 'name',
  },
}, {
  title: '上传时间',
  dataIndex: 'uploadTime',
  scopedSlots: {
    customRender: 'uploadTime',
  },
}, {
  title: '上传人',
  dataIndex: 'uploadUser',
  scopedSlots: {
    customRender: 'uploadUser',
  },
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: {
    customRender: 'operation',
  },
  width: 80,
}];
const columnsRecord = [{
  dataIndex: 'operation',
  scopedSlots: {
    customRender: 'operation',
  },
  width: 250,
}, {
  dataIndex: 'node',
  scopedSlots: {
    customRender: 'node',
  },
  width: 150,
},
{
  dataIndex: 'creatorName',
  scopedSlots: {
    customRender: 'creatorName',
  },
  width: 250,
},
{
  dataIndex: 'createDate',
  scopedSlots: {
    customRender: 'createDate',
  },
  width: 250,
},
{
  dataIndex: 'content',
  scopedSlots: {
    customRender: 'content',
  },
  width: 250,
},
];
const columnsDuplicate = [{
  dataIndex: 'correlationType',
  scopedSlots: {
    customRender: 'correlationType ',
  },
  width: 150,
},
{
  dataIndex: 'code',
  scopedSlots: {
    customRender: 'code',
  },
},
{
  dataIndex: 'title',
  scopedSlots: {
    customRender: 'title',
  },
  width: 220,
},
{
  dataIndex: 'projectPhase',
  scopedSlots: {
    customRender: 'projectPhase',
  },
},
{
  dataIndex: 'status',
  scopedSlots: {
    customRender: 'status',
  },
},
{
  dataIndex: 'assignerName',
  scopedSlots: {
    customRender: 'assignerName',
  },
},
{
  dataIndex: 'responsibleDepartmentName',
  scopedSlots: {
    customRender: 'responsibleDepartmentName',
  },
},
{
  dataIndex: 'responsibleUserName',
  scopedSlots: {
    customRender: 'responsibleUserName',
  },
},
];
const columnsAnalysis = [{
  title: '责任人',
  dataIndex: 'championName',
  align: 'center',
  scopedSlots: {
    customRender: 'championName',
  },
}, {
  title: '标准要求',
  dataIndex: 'standard',
  align: 'center',
  scopedSlots: {
    customRender: 'standard',
  },
}, {
  title: '实际情况',
  dataIndex: 'actualSituation',
  align: 'center',
  scopedSlots: {
    customRender: 'actualSituation',
  },
},
{
  title: '结论',
  dataIndex: 'conclusion',
  align: 'center',
  scopedSlots: {
    customRender: 'conclusion',
  },
},
{
  title: '附件',
  dataIndex: 'files',
  align: 'center',
  scopedSlots: {
    customRender: 'files',
  },
},
{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: {
    customRender: 'operation',
  },
  width: 80,
},
];

const analysisHistory = [{
  title: '七钻分析',
  dataIndex: 'sevenmonds',
  align: 'left',
  scopedSlots: {
    customRender: 'sevenmonds',
  },
  width: 160,
}, {

  title: '责任人',
  dataIndex: 'championName',
  align: 'left',
  scopedSlots: {
    customRender: 'championName',
  },
}, {
  title: '标准要求',
  dataIndex: 'standard',
  align: 'left',
  scopedSlots: {
    customRender: 'standard',
  },
}, {
  title: '实际情况',
  dataIndex: 'actualSituation',
  align: 'left',
  scopedSlots: {
    customRender: 'actualSituation',
  },
},
{
  title: '结论',
  dataIndex: 'conclusion',
  align: 'left',
  scopedSlots: {
    customRender: 'conclusion',
  },
},
{
  title: '附件',
  dataIndex: 'files',
  align: 'left',
  scopedSlots: {
    customRender: 'files',
  },
  width: 80,
},
{
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: {
    customRender: 'operation',
  },
  width: 80,
},
];

const columnsUpdate = [{
  title: '文件名称',
  dataIndex: 'fileName',
  align: 'left',
  scopedSlots: {
    customRender: 'fileName',
  },
}, {
  title: '是否更新',
  dataIndex: 'isUpdaeName',
  align: 'center',
  scopedSlots: {
    customRender: 'isUpdaeName',
  },
},
{
  title: '更新内容',
  dataIndex: 'updateContent',
  align: 'center',
  scopedSlots: {
    customRender: 'updateContent',
  },
},
{
  title: '附件',
  dataIndex: 'files',
  align: 'center',
  width: 100,
  scopedSlots: {
    customRender: 'files',
  },
},
{
  title: '操作',
  dataIndex: 'operation',
  align: 'left',
  scopedSlots: {
    customRender: 'operation',
  },
  width: 170,
},
];
// 问题裂变
const columnsFission = [{
  dataIndex: 'correlationType',
  scopedSlots: {
    customRender: 'correlationType ',
  },
  width: 80,
},
{
  dataIndex: 'code',
  scopedSlots: {
    customRender: 'code',
  },
},
{
  dataIndex: 'title',
  scopedSlots: {
    customRender: 'title',
  },
  width: 150,
},
{
  dataIndex: 'projectPhase',
  scopedSlots: {
    customRender: 'projectPhase',
  },
},
{
  dataIndex: 'status',
  scopedSlots: {
    customRender: 'status',
  },
},
{
  dataIndex: 'statusCode',
  scopedSlots: {
    customRender: 'statusCode',
  },
},
{
  dataIndex: 'assignerName',
  scopedSlots: {
    customRender: 'assignerName',
  },
},
{
  dataIndex: 'responsibleDepartmentName',
  scopedSlots: {
    customRender: 'responsibleDepartmentName',
  },
},
{
  dataIndex: 'responsibleUserName',
  scopedSlots: {
    customRender: 'responsibleUserName',
  },
},
];
export default {
  name: 'QuestionDetail',
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    // EditableCell: () => import('~/question/view/EditableCell'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
    PreventButton: () => import('@comp/button/PreventButton.vue'),
  },
  mixins: [attachmentMix, timeFormatMix],
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data () {
    const vm = this;
    return {
      clientFile: [], // 重复关联客户端显示附件
      dataDuplicate: [], // 重复关联表格对应的数据
      dataFission: [], // 问题裂变表格
      d6File: [], // 重复关联文件
      specialFile: [], // 特殊关闭D6状态下回显的附件
      visibleDuplicateTable: false, //  重复关联问题表格是否显示
      duplicateId: '', // 重复问题Id
      updateDataForm: null,
      d0Form: {}, // 保存D0表单
      duplicateForm: null, // 重复关联表单
      statusSpecialClose: false, // 是否特殊关闭标识
      specialCloseNode: void 0,
      masterIssueId: '', // 主问题idt
      visibleFission: false, // 裂变表格是否显示
      // 回退
      backType: '', // 回退标识
      OPERETION_DATE: '', // 操作时间
      OP_USER_NAME: '', // 操作人
      CURRENT_NODE: '', // 回退到的节点
      BEFORE_NODE: '', // 回退前的节点
      // 页面权限控制
      pagePermission: {
        button_allocation_1: false,
        button_allocation_3: false,
        button_back_3: false,
        button_back_1: false,
        button_cancel_1: false,
        button_cancel_3: false,
        button_commit_1: false,
        button_commit_3: false,
        button_submit_1: false,
        button_submit_3: false,
        button_redistribution_1: false,
        button_redistribution_3: false,
      },
      visibleRollback: false, // 状态回退弹框
      visibleSubmit: false, // 提交弹框是否显示标识
      submitLoading: false, // 提交按钮loading
      analysisModal: 'find', // 7钻分析表格点击操作显示弹框标识
      SuppelyIcon: 'down',
      isStagedFlag: '', // 暂存标识
      routerFlag: true,
      validInput: true,
      operationCode: '001', // 操作码：001：提交、002：通过、003：不通过
      // 流程状态
      statusCode: {
        statusMaxCode: 0,
        statusNewCode: 0,
        issueClosed: false,
        maxDiamonds: 0,
      },
      // 七钻分析责任人表格总数据
      AnalysisTotal: [],
      // SM SC
      sysUser: {
        coChair: '',
        monitor: '',
      },
      // 问题回退表单
      goBackForm: null,
      // 问题回退表单
      goBackRecord: {
        CURRENT_NODE_DESC: '', // 当前状态
        goBackStatus: '', // 回退状态
        comment: '', // 状态回退理由
      },
      // 特殊关闭
      closeForm: null,
      closeRecord: {
        comment: '',
      },
      visibleSpeClose: false, // 特殊关闭弹框
      stepId: '', // 每一步id
      userId: vm.$store.getters.getUser().id,
      taskId: null, // 任务id
      procDefKey: 'IRS3',
      processInstanceId: '',
      wkprocessInstanceId: '',
      DetailSuppely: true,
      // 再分配弹框
      ModalText: 'Content of the modal',
      fileModalTitle: vm.$t('issue_workflow.D5.addUpdateFile'),
      updateContentFlag: false, // 更新内容标识
      updateEditFlag: false, // 编辑弹框
      updateFindFlag: false, // 查看弹框
      visibleDelete: false, // 删除确认弹框
      visibleDeleteUpdate: false, // 涉及文件更新删除弹框
      RejectTrue: true,
      delBtn: false,
      analysisId: '',
      fileNameFlag: true,
      visibleRes: false,
      visible: false,
      visibleAnalysis: false, // 7钻编辑弹框
      visibleDetail: false, // 7钻详情
      confirmLoading: false,
      visibleReject: false,
      isCheckError: '0', // 验证不通过需要回到7钻
      signLeaderFlag: true, // 加签领导
      optCounterD0: '',
      optCounterD1: '',
      optCounterD2: '',
      optCounterD3: '',
      optCounterD4: '',
      optCounterD5: '',
      optCounterD6: '',
      icaOptCounter: '',
      depDisable: false, // 再分配责任部门下拉是否禁用
      columns,
      columnsRecord,
      columnsAnalysis,
      columnsDuplicate,
      columnsUpdate,
      analysisHistory,
      columnsFission,
      AnalysisTitle: '1钻-过程是否正确',
      data: [],
      paramUpdate: [], // 涉及文件更新删除参数
      analysisData: [], // 7钻分析表格
      updateData: [], // 文件更新表格
      DetailForm: {}, // 7钻查看表格
      updateForm: null, // 文件更新弹框表单
      rejectForm: null,
      dataFile: [], // 附件
      // files: [],
      d0FileList: [],
      icaFiles: [], // 围堵措施附件
      d1FileList: [],
      d2FileList: [],
      d3FileList: [],
      d4FileList: [],
      d5FileList: [],
      d6FileList: [],
      dataRecord: [], // 操作记录
      stepDetail: [], // 某个问题的步骤详细信息
      stepMeasures: [], // 措施详细信息
      stepImplementation: [],
      stepEffect: [],
      problemDefinitionData: {},
      issueDefinitionData: {},
      rootCauseData: {}, // 根本原因
      icaId: '', // 短期措施ID
      smallBatchValidationId: '', // 小批量验证id
      stepClose: [],
      editFlag: false,
      expand: false,
      form: null,
      coChair: null,
      monitor: null,
      visibleUpdate: false,
      formDcontent: null, // 步骤表单
      rediStribution: null, // 再分配
      NeedFlage: true, // 需要7钻标识
      userFlag: true, // 7钻责任人列表显示标识true
      AnalysisForm: null, // 7钻分析表单
      examineReason: '', // 审核理由
      satisfy: [{
        label: vm.$t('issue_workflow.yes'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.no'),
        value: '0',
      }],
      contActionOption: [{
        label: vm.$t('issue_workflow.D0.need'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.D0.unneed'),
        value: '0',
      }],
      ReviewRadio: [{
        label: '已审阅',
        value: 1,
      }],
      labelCol: {
        // xs: { span: 24 },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        // xs: { span: 24 },
        sm: {
          span: 16,
        },
      },
      workflowRolesList: [],
      workflowRoles: {
        createUser: '',
        advanceUser: '',
        advanceSelector: '',
        coChair: '',
        monitor: '',
        additionalApproval: '',
        champion: '',
        sectorManager: '',
        director: '',
        diamondOwner1: '',
        diamondOwner4: '',
        diamondOwner5: '',
        diamondOwner6: '',
        diamondOwner7: '',
        icaWriter: '', // 围堵措施填写人
      },
      reChampion: '', // 责任人暂存区
      reSectorManager: '', // 责任人科长暂存区
      reDirector: '', // 责任人部长暂存区
      id1: '', // 措施判定id
      id2: '', // 措施实施id
      idDef: '', // 问题定义id
      idRes: '', // 责任判定id
      idReason: '', // 原因分析id
      idEffct: '', // 效果验证id
      idClose: '', // 关闭id
      conActionFlag: false, // 围堵措施是否显示表示
      satisfyFlag: true, // 是否满足标识
      showMoreFlag: true, // 查看更多
      detailList: [],
      titleFlag: false, // 问题标题是否显示
      carTitle: '', // 车型标题
      functionTitle: '', // 功能标题，
      codeTitle: '', // 故障代码标题，
      stepCurrent: 1, // 当前步骤状态  从数据库读取状态
      stepMax: 1, // 最大步骤状态  从数据库读取状态
      backCurrent: 7, // 回退到的步骤数
      backFlag: false, // 是否点击回退
      disAgree: true, // 是否需要输入不同意关闭理由
      // D2
      radioDefault: 'Yes',
      determineRadio: [{
        label: vm.$t('issue_workflow.D1.confirm'),
        value: '0',
      }, {
        label: vm.$t('issue_workflow.D1.needAnalysis'),
        value: '1',
      }],
      verifyRadio: [{
        label: vm.$t('issue_workflow.pass'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.reject'),
        value: '0',
      }],
      endSevenRadio: [{
        label: vm.$t('issue_workflow.yes'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.no'),
        value: '0',
      }],
      // D5
      updateRadio: [{
        label: vm.$t('issue_workflow.yes'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.no'),
        value: '0',
      }],
      // D6
      recurrencePreventionRadio: [{
        label: vm.$t('issue_workflow.pass'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.reject'),
        value: '0',
      }],
      optionRadio: [{
        label: vm.$t('issue_workflow.yes'),
        value: '1',
      }, {
        label: vm.$t('issue_workflow.no'),
        value: '0',
      }],
      isCloseRadio: [{
        label: '同意关闭',
        value: '1',
      }, {
        label: '不同意关闭',
        value: '0',
      }],
      // 数据模板
      record: {
        serverfiles: [], // 特殊关闭服务端上传附件
        // D0
        isProject: '1', //  是否满足立项条件
        dissatisfaction: '', // 不满足理由
        Remarks: '', // 备注
        isNeedIca: '0', // 是否需要围堵措施
        icaDescriptionD1: '', // 围堵措施
        icaWriterDepartment: '', // 填写人部门
        icaWriter: '', // 填写人部门
        icaRemark: '', // 填写人部门
        icaFiles: [], // 围堵措施附件
        // D1
        owerDeptLv1: '', // 责任部门
        champion: void 0, // 责任人
        cochairDepartment: '', // cochia部门
        cochair: void 0, // cochia
        type: '0', // 判定
        verifySeven: '1', // 7钻审核
        sevenFailReason: '', // 不通过原因
        comment: '', // 不通过原因
        // 7钻责任人
        endSeven: '0',
        diamondOwner1: '',
        diamondOwner4: '',
        diamondOwner5: '',
        diamondOwner6: '',
        diamondOwner7: '',
        // D2
        rootCauseDescription: '',
        D2file: [],
        // D3
        // icaDescription: '',
        pcaDescription: '',
        pcaPlanTime: null,
        pcaExecTime: null,
        pcaValidPlanTime: null,
        estimatedClosureTime: null,
        fileList: [],
        smallBatchValidation: '',
        isPass: '1',
        icaBreakpointVin: '',
        icaBreakpointTime: null,
        carTreatmentMeasures: '',
        // D4
        pcaExecDescription: '',
        icaExecDescription: '',
        icaExecTime: null,
        // pcaDescription: null,
        // pcaExecTime: null,
        // D5
        description: '',
        breakpointVin: '',
        breakpointDate: null,
        proposerVerification: '',
        lessonsLearn: '',
        // D6
        recurrencePrevention: '1',
        isSign: '0',
        signLeaderId: '',
        Review: '1',
        signRemark: '',
        isClose: '0',
        reason: '',
        notes: '', // 审核通过的备注
      },
      // 再分配
      redistributionForm: {
        owerDeptLv1: '',
        champion: '',
        rediStributionMessage: '',
      },
      // 7钻分析弹框数据绑定
      recordAnalysis: {
        id: '',
        standard: '',
        actualSituation: '',
        conclusion: '',
        file: [],
      },
      updateFiles: [],
      // 涉及文件更新
      recordUpdate: {
        id: '',
        fileName: '',
        isUpdae: '1',
        isUpdateName: '',
        updateContent: '',
        files: [],
      },
      // 驳回
      rejectRecord: {
        commentReject: '',
      },
    };
  },
  computed: {
    allowCommit () {
      const {
        vehicleModelId,
        faultTreeIds1,
        faultTreeIds2,
        faultTreeIds3,
        source,
        grade,
        projectPhase,
        manufactureBaseId,
        description,
      } = this.detailList;
      return !!(vehicleModelId && faultTreeIds1 && faultTreeIds2 && faultTreeIds3 && source
        && grade && projectPhase && manufactureBaseId && description);
    },
  },
  watch: {
    id: {
      handler: 'init',
      immediate: true,
    },
  },
  activated () {
    this.init();
  },
  methods: {
    moment,
    ...mapActions([
      'addQuestion',
      'commitQuestion',
      'updateQuestion',
      'getFilePage',
      'getRecord',
      'problemDefinition',
      'issueDefinition',
      'getQuestionStep',
      'redistribute',
      'eidtQuestion',
      'getAnalysis',
      'editFile',
      'effectSave',
      'effectDetail',
      'ImplementationDetail',
      'firstCreateFile',
      'updateFile',
      'MeasureDetail',
      'issueDefinitionAdd',
      'closeSave',
      'closeDetail',
      'addFile',
      'rootCauseAdd',
      'rootCause',
      'problemDefinitionAdd',
      'getAnalysis',
      'MeasureDecisionSave',
      'workFlowSubmit',
      'workFlowSubmitNew',
      'getSysUser',
      'sevenDiamonds',
      'analysisSave',
      'analysisDetail',
      'getIssueAutomousRegion',
      'getStatusCode',
      'examineDetail',
      'redistributionFun',
      'saveSevenDiamonds',
      'updateChampionFun',
      'delIssue',
      'issueExportTemplate',
      'addActIdMembership',
      'getUserByPositionCode',
      'getUserByworkflowPositionCode',
      'getActIdMembership',
      'temporarySave', // 暂存
      'addActIdMembershipToAct',
      'getActIdMembership',
      'rollbackDetail', // 问题回退详情
      'moveto', // 问题回退
      'backOrClose', // 回退或关闭,
      'speCloseWorkFlow', // 特殊关闭工作流
      'associatedTable', // 重复关联表格
      'relatedDetail', // 获取重复关联信息（重复关联id）
      'handleMainIssue', // 处理主问题状态跳转
      'associatedTable', // 问题裂变信息表格
    ]),
    mapPropsToFieldsForm () {
      return createFormFields(this, [
        'serverfiles', 'isProject', 'comment', 'isNeedIca', 'icaDescriptionD1', 'icaDescription', 'icaWriterDepartment', 'icaWriter', 'icaRemark', 'icaFiles', 'dissatisfaction', 'Remarks', 'planTime', 'pcaPlanTime', 'icaBreakpointVin', 'icaBreakpointTime',
        'owerDeptLv1', 'champion', 'cochairDepartment', 'cochair', 'type', 'diamondOwner1', 'diamondOwner4', 'diamondOwner5',
        'diamondOwner6', 'isPass', 'rootCauseDescription', 'carTreatmentMeasures',
        'diamondOwner7', 'rootcause', 'D2file', 'pcaDescription',
        'pcaDescriptionTime', 'pcaExecTime', 'pcaValidPlanTime', 'estimatedClosureTime',
        'fileList', 'smallBatchValidation', 'isSign', 'signLeaderId', 'Review', 'signRemark',
        'icaExecDescription', 'icaExecTime', 'pcaExecDescription', 'lessonsLearn',
        'description', 'proposerVerification', 'breakpointVin', 'breakpointDate',
        'recurrencePrevention', 'isClose', 'endSeven', 'verifySeven',
        'reason', 'notes',
      ], 'record');
    },
    /**
     * 过滤掉标题
     */
    filterTitle (col) {
      const newCol = clearObserver(col);
      delete newCol.title;
      return newCol;
    },
    // 暂存
    temporary (param) {
      const data = {
        id: this.id,
        isStaged: param,
      };
      this.temporarySave(data).then((res) => {
        if (param === '1') {
          this.$message.success(this.$t('issue_action.temporarySuccess'));
          this.$router.push({
            path: this.$route.query.form || '/',
          });
          this.$store.dispatch('refresh');
        } else if (param === '0') {
          this.$message.success(this.$t('issue_action.restoreSuccess'));
          this.$router.push({
            path: this.$route.query.form || '/',
          });
          this.$store.dispatch('refresh');
        }
      });
    },
    // 点击重复关联问题问题编号跳转链接
    gotoDetail (row) {
      if (row.procDefKey === 'IRS1') {
        this.$router.push({
          name: 'QuestionDetail',
          params: {
            id: row.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      } else if (row.procDefKey === 'IRS2') {
        this.$router.push({
          name: 'QuestionDetailNew',
          params: {
            id: row.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      } else if (row.procDefKey === 'IRS3') {
        this.$router.push({
          name: 'SubQuestionDetailNew',
          params: {
            id: row.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      }
      this.$store.dispatch('refresh');
    },
    // 点击重复关联按钮
    duplicateFunction () {
      this.$refs.duplicateAssociation.init(this.duplicateId, this.detailList, this.statusCode.statusNewCode);
    },
    resMapPropsToFields () {
      return createFormFields(this, [
        'owerDeptLv1', 'champion',
      ], 'redistributionForm');
    },
    goBackMapPropsToFields () {
      return createFormFields(this, [
        'CURRENT_NODE_DESC', 'goBackStatus', 'comment',
      ], 'goBackRecord');
    },
    closeMapPropsToFields () {
      return createFormFields(this, ['comment',
      ], 'closeRecord');
    },
    SuppelyOpen () {
      if (this.DetailSuppely) {
        this.SuppelyIcon = 'right';
        this.DetailSuppely = false;
      } else {
        this.SuppelyIcon = 'down';
        this.DetailSuppely = true;
      }
    },
    // 问题回退
    rollback () {
      this.visibleRollback = true;
      this.goBackForm.resetFields();
      const status = {
        status: this.detailList.status,
      };
      this.rollbackDetail(status).then((res) => {
      // 设置当前节点
        this.goBackRecord.CURRENT_NODE_DESC = res[0].CURRENT_NODE_DESC;
        this.goBackForm.updateFields(this.goBackMapPropsToFields());
      });
    },
    // 特殊关闭
    specialClose () {
      this.visibleSpeClose = true;
      this.record.serverfiles = [];
      this.clientFile = [];
      this.closeForm.resetFields();
    },
    // 禁用提报的日期之前的日期
    disabledDate (current) {
      const dateTime = moment(this.detailList.createDate.split(' ')[0]);
      return current < dateTime;
    },
    // 长期措施实施计划日期禁用/短期措施断点时间
    disabledDate1 (current) {
      const dateTime = moment().subtract(1, 'days');
      return current < dateTime;
    },
    // 长期措施验证计划日期禁用
    disabledDate2 (current) {
      let dateTime;
      if (this.record.pcaPlanTime) {
        dateTime = moment(this.record.pcaPlanTime);
      }
      return current < dateTime;
    },
    // 计划关闭日期禁用
    disabledDate3 (current) {
      let dateTime;
      if (this.record.pcaValidPlanTime) {
        dateTime = moment(this.record.pcaValidPlanTime);
      }

      return current < dateTime;
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input
        .toLowerCase()) >= 0;
    },
    // vin限制
    vinVer (rule, value, callback) {
      const myreg = /^[A-Z0-9]{8,17}$/;
      if (value && !myreg.test(value)) {
        callback(new Error(this.$t('issue_workflow.D5.vinVer')));
      } else {
        callback();
      }
    },
    // 再分配责任部门改变
    owerDeptChange () {
      this.redistributionForm.champion = void 0;
      this.rediStribution.updateFields(this.resMapPropsToFields());
    },
    // D流程中责任部门改变
    DeptChange () {
      this.formDcontent.champion = void 0;
      this.record.champion = void 0;
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
    },
    cochairDeptChange () {
      this.formDcontent.cochair = 'void 0';
      this.record.cochair = void 0;
      // 将coChair置为空
      this.workflowRoleChange(void 0, 'coChair');
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
    },
    icaWriterDeptChange () {
      this.formDcontent.icaWriter = 'void 0';
      this.record.cochair = void 0;
      // 将coChair置为空
      this.workflowRoleChange(void 0, 'icaWriter');
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
    },
    DeptChangeDemaonds () {
      // this.formDcontent.champion = '';
      this.record.champion = '';
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
    },
    mapUpdate () {
      return createFormFields(this, [
        'id', 'fileName', 'isUpdaeName', 'isUpdae', 'updateContent', 'files',
      ], 'recordUpdate');
    },
    init () {
      this.formDcontent = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFieldsForm,
        onValuesChange: autoUpdateFileds(this, 'record'),
      });
      this.rediStribution = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, ['owerDeptLv1', 'champion'],
          'redistributionForm'),
        onValuesChange: autoUpdateFileds(this, 'redistributionForm'),
      });
      this.AnalysisForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'id', 'standard', 'actualSituation', 'conclusion', 'file',
        ], 'recordAnalysis'),
        onValuesChange: autoUpdateFileds(this, 'recordAnalysis'),
      });
      this.updateForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'id', 'fileName', 'isUpdateName', 'isUpdae', 'updateContent', 'files',
        ], 'recordUpdate'),
        onValuesChange: autoUpdateFileds(this, 'recordUpdate'),
      });
      this.rejectForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'commentReject',
        ], 'rejectRecord'),
        onValuesChange: autoUpdateFileds(this, 'rejectRecord'),
      });
      this.goBackForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'CURRENT_NODE_DESC', 'goBackStatus', 'comment',
        ], 'goBackRecord'),
        onValuesChange: autoUpdateFileds(this, 'goBackRecord'),
      });
      this.closeForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, ['comment',
        ], 'closeRecord'),
        onValuesChange: autoUpdateFileds(this, 'closeRecord'),
      });
      this.request();
      this.duplicateId = this.id;
    },
    // 是否需要围堵措施
    conActionChange (e) {
      if (e.target.value === '1') {
        this.conActionFlag = true;
      } else {
        this.conActionFlag = false;
      }
    },
    // 是否加签
    apostilleChange (e) {
      if (e.target.value === '1') {
        this.signLeaderFlag = true;
      } else {
        this.signLeaderFlag = false;
      }
    },
    // 是否结束7钻
    sevenRadioChange (e) {
      if (e.target.value === '1') {
        if (this.record.owerDeptLv1 === '' || this.record.owerDeptLv1 === null) {
          this.record.owerDeptLv1 = this.detailList.responsibleDepartmentId;
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      }
    },
    // 7钻分析是否审核通过
    verifySevenChange (e) {
      if (e.target.value === '1') {
        if (this.record.owerDeptLv1 === '' || this.record.owerDeptLv1 === null) {
          this.record.owerDeptLv1 = this.detailList.responsibleDepartmentId;
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      }
    },
    // 是否更新
    updateRadioChange (e) {
      if (e.target.value === '1') {
        this.updateContentFlag = true;
      } else {
        this.updateContentFlag = false;
        // 清空更新内容
        this.recordUpdate.updateContent = '';
      }
    },
    // 驳回
    handleReject () {
      toggleForbidScrollThrough(true);
      this.visibleReject = true;
      // 表单重置
      this.rejectForm.resetFields();
    },
    rejectSubmit () {
      this.rejectForm.validateFields((err) => {
        if (!err) {
          enableScroll();
          this.visibleReject = false;
          this.isCheckError = '1';
          const data = this.formDcontent.getFieldsValue();
          let resComment = this.rejectForm.getFieldsValue().commentReject;
          if (resComment) {
            resComment = `SM再分析-${resComment}`;
          } else {
            resComment = 'SM再分析';
          }
          const transData = {
            businessKey: this.id, // 问题id
            businessTitle: data.title, // 问题title
            processDefinitionKey: this.procDefKey, // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.detailList.taskId, //  任务id
            userId: this.userId, //  当前用户id
            operationCode: this.operationCode, // 操作码
            comment: resComment,
            variables: {
              businessKey: this.id, // 问题id
              comment: resComment,
              assigner: data.diamondOwner1,
              isDirectSerious: (this.detailList.gradeName === 'A' || this.detailList.gradeName
                === 'B') ? '1' : '0', // 是否直接极端严重事情
              isEnd: this.record.isClose, // 是否关闭
              isPass: 1, // 再分析审核默认通过
              isQZEnd: data.endSeven, // 是否结束七钻
              isHaveCO: this.sysUser.coChair == null ? '0' : '1',
              isAB: (this.detailList.gradeName === 'A' || this.detailList.gradeName === 'B') ? '1'
                : '0',
              isQZ: data.type, // 是否需要七钻
              isCheckError: this.isCheckError, // 验证不通过(需要回到七钻前)
              isLeaderSign: this.record.isSign, // 领导加签
              isItem: data.isProject, // 是否立项
              isWD: data.isNeedIca, // 是否围堵
            },
          };
          for (const item in this.workflowRoles) {
            transData.variables[item] = this.workflowRoles[item];
          }
          // 保存任务角色
          for (const item in this.workflowRoles) {
            this.workflowRolesList.push({
              groupId: item, userId: this.workflowRoles[item], procInstId: this.wkprocessInstanceId, procDefKey: this.procDefKey, businessKey: this.id,
            });
          }
          // 在工作流更新membership
          this.addActIdMembershipToAct(this.workflowRolesList).then();
          this.addActIdMembership(this.workflowRolesList).then((result) => {
            this.workFlowSubmitNew(transData).then(() => {
            // taskId从工作流中读取改为从详情读取  2019/09/23 16：40
            // if (res.taskId) {
            //   this.taskId = res.taskId;
            // }
            //  再分析成功
              this.$message.success(this.$t('issue_workflow.rejectSuccess'));
              this.$store.dispatch('refresh');
            });
          });
        }
      });
    },
    CancelReject () {
      enableScroll();
      this.visibleReject = false;
    },
    // 涉及文件更新删除弹框点击确认
    deleteOkUpdate () {
      this.visibleDeleteUpdate = false;
      this.paramUpdate.delFlag = 1;
      this.editFile(this.paramUpdate).then(() => {
        this.updateFile(this.id).then((res) => {
          this.updateData = res;
        });
      });
    },
    // 涉及文件更新删除弹框点击取消
    deleteCancelUpdate () {
      this.visibleDeleteUpdate = false;
    },
    goBack () {
      this.$router.push({
        path: this.$route.query.form || '/',
      });
      this.$store.dispatch('refresh');
    },
    // 是否驳回选择
    RejectRadioChange (e) {
      if (e.target.value === '0') {
        this.RejectTrue = true;
      } else {
        this.RejectTrue = false;
      }
    },
    selectOptionSingn (input) {
      const optionArray = [{
        value: input.id,
        label: input.realName,
      }];
      // input.forEach((item) => {
      //   optionArray.push({
      //     value: item.id,
      //     label: item.username
      //   })
      // })

      return optionArray;
    },
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
    // 工作流部门筛选框
    deptTreeTransform: treeTransform(transform({
      value: 'ID', label: 'NAME', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    responseDeptTreeTransform: treeTransform(transform({
      value: 'code', label: 'name', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    demondUserTreeTransform: treeTransform(transform({
      value: 'id', label: 'name', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),

    selectOption (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.code,
          label: item.name,
        });
      });
      return optionArray;
    },
    // 用户下拉框
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
    // cochair选择器
    userCochairOption (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.realName,
        });
      });
      return optionArray;
    },
    // 再分配责任人选择，不能选择本人
    selectUser (input) {
      const optionArray = [];
      const { id } = this.$store.getters.getUser();
      input.forEach((item) => {
        if (item.userId !== id) {
          optionArray.push({
            value: item.userId,
            label: item.username,
          });
        }
      });
      return optionArray;
    },
    showAnalysis (param) {
      toggleForbidScrollThrough(true);
      const { index } = param;
      // 编辑
      if (index === 0) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.1stDiamond')}: ${this.$t('issue_workflow.D1.rightProcess')}`;
      } else if (index === 1) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.2ndDiamond')}: ${this.$t('issue_workflow.D1.rightTools')}`;
      } else if (index === 2) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.3rdDiamond')}: ${this.$t('issue_workflow.D1.rightMaterials')}`;
      } else if (index === 3) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.4thDiamond')}: ${this.$t('issue_workflow.D1.specification')}`;
      } else if (index === 4) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.5thDiamond')}: ${this.$t('issue_workflow.D1.processChange')}`;
      } else if (index === 5) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.6thDiamond')}: ${this.$t('issue_workflow.D1.partChange')}`;
      } else if (index === 6) {
        this.AnalysisTitle = `${this.$t('issue_workflow.D1.7thDiamond')}: ${this.$t('issue_workflow.D1.complex')}`;
      }
      if (param.operation === this.$t(`fileUpdateTable.edit`)) {
        this.visibleAnalysis = true;


        // this.DetailForm = param;
        /* if (index === 2) {
            this.AnalysisTitle ='2钻-工具是否正确'
          }
          if (index === 3) {
            this.AnalysisTitle ='3钻-物料是否正确'
          }
          if (index === 4) {
            this.AnalysisTitle ='4钻-物料规则检测'
          }
          if (index === 5) {
            this.AnalysisTitle ='5钻-过程变更'
          }
          if (index === 6) {
            this.AnalysisTitle ='6钻-部件变更'
          }
          if (index === 7) {
            this.AnalysisTitle ='7钻-是否是极端复杂问题'
          } */


        this.AnalysisForm = this.$form.createForm(this, {

          mapPropsToFields: () => ({
            id: this.$form.createFormField({
              value: param.id,
            }),
            standard: this.$form.createFormField({
              value: param.standard,
            }),
            actualSituation: this.$form.createFormField({
              value: param.actualSituation,
            }),
            conclusion: this.$form.createFormField({
              value: param.conclusion,
            }),
            files: this.$form.createFormField({
              value: param.files,
            }),
          }),
        });
        this.recordAnalysis.file = param.files.map((file) => {
          if (file.response) {
            return {
              id: file.response.data.id,
              uid: file.response.data.id,
              name: file.response.data.originalFilename,
              url: file.response.data.path,
              size: file.response.data.size,
              status: 'done',
            };
          } if (file.originalFilename) {
            return {
              id: file.id,
              uid: file.id,
              name: file.originalFilename,
              url: file.path,
              size: file.size,
              status: 'done',
            };
          }
          return {
            id: file.id,
            uid: file.id,
            name: file.name,
            url: file.url,
            size: file.size,
            status: 'done',
          };
        });
      } else if (param.operation === this.$t(`fileUpdateTable.view`)) {
        this.visibleDetail = true;
        Object.assign(this.DetailForm, param);
        this.DetailForm.files = param.files.map((file) => ({
          id: file.id,
          uid: file.id,
          name: file.originalFilename,
          url: file.path,
          size: file.size,
          status: 'done',
        }));
      }
      console.log(this.analysisData);
    },
    showUpdate (param) {
      toggleForbidScrollThrough(true);
      this.$set(this, 'recordUpdate', param || { isUpdae: '1', files: [] });
      this.visibleUpdate = true;
      this.updateEditFlag = true;
      this.updateContentFlag = true;
      if (param) {
        this.updateEditFlag = true;
        this.updateFindFlag = false;
        if (param.isUpdae === '0') {
          this.updateContentFlag = false;
        } else if (param.isUpdae === '1') {
          this.updateContentFlag = true;
        }
        this.updateFiles = param.files.map((file) => ({
          id: file.id,
          uid: file.id,
          name: file.originalFilename,
          url: file.path,
          size: file.size,
          status: 'done',
        }));
        if (param.delFlag === '0') {
          this.fileNameFlag = false;
          this.fileModalTitle = param.fileName;
          this.updateForm.updateFields(this.mapUpdate());
        } else if (param.delFlag === '2') {
          this.fileNameFlag = true;
          this.fileModalTitle = param.fileName;
          this.updateForm.updateFields(this.mapUpdate());
        }
      } else {
        this.updateForm.resetFields();
        this.fileNameFlag = true;
        this.isUpdae = '1';
        this.fileModalTitle = this.$t('issue_workflow.D5.addUpdateFile');
        this.updateContentFlag = true;
        this.updateFiles = [];
      }
    },
    UpdateFind (param) {
      toggleForbidScrollThrough(true);
      this.visibleUpdate = true;
      this.updateFindFlag = true;
      this.updateEditFlag = false;
      this.updateDataForm = param;
      this.updateFiles = param.files;
      this.fileModalTitle = param.fileName;
    },
    DelUpdate (param) {
      this.visibleDeleteUpdate = true;
      this.paramUpdate = param;
    },
    // // 校验中英文
    // languageVer (rule, value, callback) {
    //   const regzh = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    //   const zh = regzh.test(value);
    //   const regen = new RegExp('[a-zA-Z]+', 'g');
    //   const en = regen.test(value);
    //   if (value && (!zh || !en)) {
    //     callback(new Error('必须同时含有中文和英文'));
    //   } else {
    //     callback();
    //   }
    // },
    // 确定7钻分析弹框
    AnalysisOk () {
      enableScroll();
      this.AnalysisForm.validateFields((err) => {
        if (!err) {
          this.visibleAnalysis = false;
          const data = this.AnalysisForm.getFieldsValue();
          if (this.AnalysisForm === '') {
            data.id = this.AnalysisForm.id;
          }
          // this.sevenDiamonds(data).then(() => {

          // });
          this.analysisData.forEach((item) => {
            if (item.id === data.id) {
              item.id = data.id;
              item.standard = data.standard;
              item.actualSituation = data.actualSituation;
              item.conclusion = data.conclusion;
              item.files = this.recordAnalysis.file;
            }
          });
          const analysisData2 = this.analysisData;
          this.AnalysisTotal.push(analysisData2);
        }
      });
    },
    AnalysisDetailOk () {
      enableScroll();
      this.visibleDetail = false;
    },
    AnalysisDetailCancel () {
      enableScroll();
      this.visibleDetail = false;
    },
    updateOk () {
      enableScroll();
      this.updateForm.validateFields((err) => {
        if (!err) {
          this.visibleUpdate = false;
          // 当选择不更新的时候将更新内容清空
          if (this.recordUpdate.isUpdae === '0') {
            this.recordUpdate.updateContent = '';
          }
          if (this.fileNameFlag === true) {
            const data = {
              ...this.recordUpdate,
              ...this.updateForm.getFieldsValue(),
            };
            data.issueId = this.id;
            data.delFlag = 2;
            if (!data.id) {
              this.addFile(data).then(() => {
                this.updateFile(this.id).then((res) => {
                  this.updateData = res;
                });
              });
            } else {
              this.editFile(data).then(() => {
                this.updateFile(this.id).then((res) => {
                  this.updateData = res;
                });
              });
            }
          } else {
            const data = {
              ...this.recordUpdate,
              ...this.updateForm.getFieldsValue(),
            };
            data.issueId = this.id;
            data.fileName = this.fileModalTitle;
            data.delFlag = 0;
            if (!data.id) {
              this.addFile(data).then(() => {
                this.updateFile(this.id).then((res) => {
                  this.updateData = res;
                });
              });
            } else {
              this.editFile(data).then(() => {
                this.updateFile(this.id).then((res) => {
                  this.updateData = res;
                });
              });
            }
          }
        }
      });
    },
    updateCancel () {
      enableScroll();
      this.visibleUpdate = false;
      this.updateForm.resetFields();
      this.updateFile(this.id).then((res) => {
        this.updateData = res;
      });
    },
    // 关闭7钻分析弹框
    AnalysisCancel () {
      enableScroll();
      this.visibleAnalysis = false;
    },
    // 是否同意关闭
    CloseRadioChange (e) {
      if (e.target.value === '0') {
        this.disAgree = false;
      } else {
        this.disAgree = true;
      }
    },
    request () {
      // 查看问题详情
      const editDetail = this.eidtQuestion(this.id).then((res) => {
        // 是否特殊关闭
        // eslint-disable-next-line no-unneeded-ternary
        this.statusSpecialClose = res.statusSpecialClose === null ? false : true;
        // 主问题id
        this.masterIssueId = res.masterIssueId;
        this.specialCloseNode = res.statusSpecialClose === null ? void 0 : Math.floor((res.statusSpecialClose) / 100000) - 1;
        // 暂存按钮和恢复按钮显示
        this.isStagedFlag = res.isStaged;
        if (this.record.owerDeptLv1 === '' || this.record.owerDeptLv1 === null) {
          this.record.owerDeptLv1 = res.responsibleDepartmentId;
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
        this.detailList = res;
        this.processInstanceId = res.processInstanceId;
        // taskId改为从问题详情读取 2019/9/23 16：44
        if (res.taskId) {
          this.taskId = res.taskId;
        }
        if ((this.detailList.status === '100300' || this.detailList.status === '100108') && res.creator === this.$store.getters.getUser().id) {
          this.delBtn = true;
          this.optCounter = res.optCounter;
        }
        return this.detailList;
      });
      const statusCode2 = this.getStatusCode(this.id).then((res) => {
        if (res) {
          this.statusCode.statusMaxCode = res.statusMaxCode;
          this.statusCode.statusNewCode = res.statusNewCode;
          this.stepCurrent = Math.floor((res.statusNewCode) / 100000) - 1;
          this.stepMax = Math.floor((res.statusMaxCode) / 100000) - 1;
          this.backCurrent = this.stepCurrent;
          this.statusCode.issueClosed = res.statusNewCode === '700300';
          this.getQuestionStepAll(this.id);
        }
        return res.taskIdOld !== undefined ? res.taskIdOld : '';
      });
      const pagePermissionArea = this.getIssueAutomousRegion(this.id).then((res) => {
        this.pagePermission = {};
        const vm = this;
        res.forEach((item) => {
          vm.pagePermission[item.DETAIL_REGION] = true;
        });
        return vm.pagePermission;
      });
      Promise.all([editDetail, pagePermissionArea]).then((res) => {
        this.redistributionForm.owerDeptLv1 = res[0].responsibleDepartmentId;
        this.rediStribution.updateFields(this.resMapPropsToFields());
        // 加载当前工作流角色人员
        const transData = {
          procInstId: this.wkprocessInstanceId,
          procDefKey: this.procDefKey,
          businessKey: this.id,
        };
        this.getActIdMembership(transData).then((ress) => {
          if (ress && Object.keys(ress).length > 0) {
            for (const item in ress) {
              this.workflowRoles[item] = ress[item];
            }
          }
          this.$nextTick(() => {
            // 如果当前用户为问题责任人，那么他只能分配同一部门的人，把责任部门下拉框禁用
            // 除了fir类问题其余全部禁用
            if (this.detailList.source !== 'fir' && ress.monitor !== this.$store.getters.getUser().id) {
              this.depDisable = true;
            } else if (ress.monitor === this.$store.getters.getUser().id) {
            // 如果当前人是StepMonitor,那么不禁用
              this.depDisable = false;
            } else {
              this.depDisable = false;
            }
          });
        });
        const param = {
          masterIssueId: this.masterIssueId === null || this.masterIssueId === '' ? this.id : this.masterIssueId,
        };
        // 问题裂变信息
        this.associatedTable(param).then((res2) => {
          if (res2.length === 0) {
            this.visibleFission = false;
          } else {
            this.visibleFission = true;
            this.dataFission = res2;
          }
        });
      });
      Promise.all([editDetail, statusCode2]).then((res1) => {
        const taskDefListArray = res1[1];
        const paramExamine = {
          businessKey: this.id,
          processInstanceId: this.processInstanceId,
          taskDefList: taskDefListArray,
        };
        this.closeDetail(this.id).then();
        if (taskDefListArray) {
          this.examineDetail(paramExamine).then((res) => {
            if (res) {
              this.examineReason = res.MESSAGE;
              this.OPERETION_DATE = res.OPERETION_DATE;
              this.OP_USER_NAME = res.OP_USER_NAME;
              this.CURRENT_NODE = res.CURRENT_NODE;
              this.BEFORE_NODE = res.BEFORE_NODE;
              this.backType = res.TYPE;
            }
          });
        }
      });
      // this.getFilePage().then(res => {
      //   this.dataFile = res.list;
      // });
      this.getRecord(this.id).then((res) => {
        this.dataRecord = res;
      });
      let correlationIssueId = '';
      // 首先获取重复关联信息
      this.relatedDetail(this.id).then((resRelate) => {
        if (resRelate && resRelate.issueExtendDTO) {
          // eslint-disable-next-line prefer-destructuring
          correlationIssueId = resRelate.issueExtendDTO.correlationIssueId;
          const paramAssociated = {
            issueId: this.id,
            correlationIssueId,
          };
          this.associatedTable(paramAssociated).then((res2) => {
            if (res2.length === 0) {
              this.visibleDuplicateTable = false;
            } else {
              this.visibleDuplicateTable = true;
              this.dataDuplicate = res2;
            }
          });
        } else {
          const paramAssociated = {
            issueId: this.id,
          };
          this.associatedTable(paramAssociated).then((res2) => {
            if (res2.length === 0) {
              this.visibleDuplicateTable = false;
            } else {
              this.visibleDuplicateTable = true;
              this.dataDuplicate = res2;
            }
          });
        }
      });
    },
    /**
     * 查询每个步骤的详情
     * @param Number id - issue id
     */
    getQuestionStepAll (id) {
      // 问题定义
      this.stepCurrent === 0 && this.problemDefinition(id).then((res) => {
        this.problemDefinitionData = res || {};
        if (res) {
          this.d0FileList = (res.files || []).map(this.file2client);
          this.icaFiles = (res.icaFiles || []).map(this.file2client);
          this.record = res || {};
          this.record.fileList = res.files || [];
          this.record.icaFiles = res.files || [];
          this.problemDefinitionData.icaDescriptionD1 = res.icaDescription;
          this.updateData = this.problemDefinitionData.updateList;
          this.idDef = res.id;
          this.optCounterD0 = res.optCounter;
          if (res.isProject) {
            this.record.isNeedIca = res.isNeedIca;
            this.satisfyFlag = res.isProject === '1';
            this.conActionFlag = res.isNeedIca === '1';
            this.record.isProject = res.isProject;
          }
          this.record.comment = res.comment;
          this.record.icaDescriptionD1 = res.icaDescription;
          // 初始化的时候判断如果不立项的话，去掉保存按钮
          if (res.isProject === '0') {
            this.pagePermission.button_commit_3 = false;
          }
        }
        this.record.isPass = '1';
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      });
      // 责任判定
      this.stepCurrent === 1 && this.issueDefinition(id).then((res) => {
        this.issueDefinitionData = res || {};
        if (res) {
          this.d1FileList = (res.files || []).map(this.file2client);
          this.record.fileList = res.files || [];
          this.optCounterD1 = res.optCounter;
          this.idRes = res.id;
        }
        if (res.type) {
          this.record.type = res.type;
          this.NeedFlage = res.type !== '1';
          if (res.type === '1') {
            this.record.diamondOwner1 = res.sevenDiamondsVos[0].champion;
            this.record.diamondOwner4 = res.sevenDiamondsVos[3].champion;
            this.record.diamondOwner5 = res.sevenDiamondsVos[4].champion;
            this.record.diamondOwner6 = res.sevenDiamondsVos[5].champion;
            this.record.diamondOwner7 = res.sevenDiamondsVos[6].champion;
            this.issueDefinitionData.diamondOwner1 = res.sevenDiamondsVos[0].championName;
            this.issueDefinitionData.diamondOwner4 = res.sevenDiamondsVos[3].championName;
            this.issueDefinitionData.diamondOwner5 = res.sevenDiamondsVos[4].championName;
            this.issueDefinitionData.diamondOwner6 = res.sevenDiamondsVos[5].championName;
            this.issueDefinitionData.diamondOwner7 = res.sevenDiamondsVos[6].championName;
          }
        }
        this.record.owerDeptLv1 = res.owerDeptLv1;
        this.record.champion = res.champion || void 0;
        this.record.cochair = res.cochair || void 0;
        this.record.cochairDepartment = res.cochairDepartment;

        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
        (this.issueDefinitionData.sevenDiamondsVos || []).forEach((item) => {
          item.operation = this.$t(`fileUpdateTable.view`);
          this.analysisModal = 'find';
        });
        const status = Number(this.detailList.status);
        const { pagePermission } = this;
        // 如果为七钻
        if (pagePermission.A1_1_2 && (status >= 300100 || status === 200105)) {
          for (let i = 0; i < 7; i += 1) {
            if (this.issueDefinitionData.sevenDiamondsVos[i].standard) {
              if (i === 0) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.1stDiamond')}: ${this.$t('issue_workflow.D1.rightProcess')}`;
              }
              if (i === 1) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.2ndDiamond')}: ${this.$t('issue_workflow.D1.rightTools')}`;
              }
              if (i === 2) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.3rdDiamond')}: ${this.$t('issue_workflow.D1.rightMaterials')}`;
              }
              if (i === 3) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.4thDiamond')}: ${this.$t('issue_workflow.D1.specification')}`;
              }
              if (i === 4) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.5thDiamond')}: ${this.$t('issue_workflow.D1.processChange')}`;
              }
              if (i === 5) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.6thDiamond')}: ${this.$t('issue_workflow.D1.partChange')}`;
              }
              if (i === 6) {
                this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.7thDiamond')}: ${this.$t('issue_workflow.D1.complex')}`;
              }
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
            }
          }
        } else {
          if (status >= 200200 && status < 200500) {
          // eslint-disable-next-line no-plusplus

            for (let i = 0; i < 3; i += 1) {
              if (pagePermission.A1_3_3) {
                //  编辑
                this.issueDefinitionData.sevenDiamondsVos[i].operation = this.$t(`fileUpdateTable.edit`);
                this.analysisModal = 'edit';
              }
              this.statusCode.maxDiamonds = i;
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
            }
          }
          if (status >= 200500 && status < 200800) {
          // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 4; i++) {
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
              this.statusCode.maxDiamonds = i;
              if (pagePermission.A1_6_3) {
                // 编辑
                this.issueDefinitionData.sevenDiamondsVos[3].operation = this.$t(`fileUpdateTable.edit`);
                this.analysisModal = 'edit';
              }
            }
          }
          if (status >= 200800 && status < 201100) {
          // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 5; i++) {
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
              this.statusCode.maxDiamonds = i;
              if (pagePermission.A1_9_3) {
                // 编辑
                this.issueDefinitionData.sevenDiamondsVos[4].operation = this.$t(`fileUpdateTable.edit`);
                this.analysisModal = 'edit';
              }
            }
          }
          if (status >= 201100 && status < 201400) {
          // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 6; i++) {
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
              this.statusCode.maxDiamonds = i;
              if (pagePermission.A1_12_3) {
                // 编辑
                this.issueDefinitionData.sevenDiamondsVos[5].operation = this.$t(`fileUpdateTable.edit`);
                this.analysisModal = 'edit';
              }
            }
          }
          if (status >= 201400) {
          // eslint-disable-next-line no-plusplus
            for (let i = 0; i < 7; i++) {
              this.statusCode.maxDiamonds = i;
              this.issueDefinitionData.sevenDiamondsVos[i].index = i;
              this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
              if (pagePermission.A1_15_3) {
                //  编辑
                this.issueDefinitionData.sevenDiamondsVos[6].operation = this.$t(`fileUpdateTable.edit`);
                this.analysisModal = 'edit';
              }
            }
            if (status === 201500) {
              this.record.endSeven = '1';

              if (this.record.owerDeptLv1 === '' || this.record.owerDeptLv1 === null) {
                this.record.owerDeptLv1 = this.detailList.responsibleDepartmentId;
              }
              this.formDcontent.updateFields(this.mapPropsToFieldsForm());
            }
          }
        }
      });
      // 原因分析
      this.stepCurrent === 2 && this.rootCause(id).then((res) => {
        this.d2FileList = (res.files || []).map(this.file2client);
        this.record.fileList = res.files || [];
        this.rootCauseData = res || {};
        this.optCounterD2 = res.optCounter;
        this.idReason = res.id;
        if (res.rootCauseDescription) {
          this.record.rootCauseDescription = res.rootCauseDescription;
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      });
      this.updateFile(this.id).then((res) => {
        this.updateData = res;
      });
      // 措施制定
      this.stepCurrent === 3 && this.MeasureDetail(this.id).then((res) => {
        this.d3FileList = (res.files || []).map(this.file2client);
        this.record.fileList = res.files || [];
        this.stepMeasures = res;
        this.optCounterD3 = res.optCounter;
        this.icaOptCounter = res.icaOptCounter;
        this.icaId = res.icaId;
        this.id1 = res.id;
        this.smallBatchValidationId = res.smallBatchValidationId;
        this.record.icaDescription = res.icaDescription;
        this.record.pcaDescription = res.pcaDescription;
        this.record.carTreatmentMeasures = res.carTreatmentMeasures;
        this.record.icaBreakpointVin = res.icaBreakpointVin;
        this.record.icaBreakpointTime = res.icaBreakpointTime;
        this.record.smallBatchValidation = res.smallBatchValidation;
        if (res.pcaPlanTime) {
          const date1 = new Date(res.pcaPlanTime);
          this.record.pcaPlanTime = moment(date1);
        }
        if (res.pcaExecTime) {
          const date2 = new Date(res.pcaExecTime);
          this.record.pcaExecTime = moment(date2);
        }
        if (res.icaBreakpointTime) {
          const date2 = new Date(res.icaBreakpointTime);
          this.record.icaBreakpointTime = moment(date2);
        }
        if (res.pcaValidPlanTime) {
          const date22 = new Date(res.pcaValidPlanTime);
          this.record.pcaValidPlanTime = moment(date22);
        }
        if (res.estimatedClosureTime) {
          const date3 = new Date(res.estimatedClosureTime);
          this.record.estimatedClosureTime = moment(date3);
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      });
      // 措施实施
      this.stepCurrent === 4 && this.ImplementationDetail(this.id).then((res) => {
        console.log(res);
        this.icaId = res.icaId;
        this.d4FileList = (res.files || []).map(this.file2client);
        this.record.fileList = res.files || [];
        this.stepImplementation = res;
        this.optCounterD4 = res.optCounter;
        this.icaOptCounter = res.icaOptCounter;
        this.id2 = res.id;
        this.smallBatchValidationId = res.smallBatchValidationId;
        this.record.icaExecDescription = res.icaExecDescription;
        if (res.icaExecTime) {
          const date4 = new Date(res.icaExecTime);
          this.record.icaExecTime = moment(date4);
        }

        this.record.pcaExecDescription = res.pcaExecDescription;
        if (res.pcaExecTime) {
          const date5 = new Date(res.pcaExecTime);
          this.record.pcaExecTime = moment(date5);
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      });
      this.updateFile(this.id).then((res) => {
        this.updateData = res;
      });
      // 效果验证
      this.stepCurrent === 5 && this.effectDetail(this.id).then((res) => {
        this.d5FileList = (res.files || []).map(this.file2client);
        this.record.fileList = res.files || [];
        this.stepEffect = res;
        this.idEffct = res.id;
        this.optCounterD5 = res.optCounter;
        this.record.description = res.description;
        this.record.proposerVerification = res.proposerVerification;
        this.record.breakpointVin = res.breakpointVin;
        this.record.lessonsLearn = res.lessonsLearn;
        if (res.breakpointDate) {
          const date6 = new Date(res.breakpointDate);
          this.record.breakpointDate = moment(date6);
        }
        this.formDcontent.updateFields(this.mapPropsToFieldsForm());
        this.updateForm.updateFields(this.mapUpdate());
      });
      // 问题关闭
      this.stepCurrent === 6 && this.closeDetail(this.id).then((res) => {
        if (res) {
          this.d6FileList = (res.files || []).map(this.file2client);
          this.specialFile = res.files;
          this.record.fileList = res.files || [];
          this.stepClose = res;
          this.optCounterD6 = res.optCounter;
          this.idClose = res.id;
          if (res.recurrencePrevention) {
            this.record.recurrencePrevention = res.recurrencePrevention;
          }
          if (res.isSign) {
            this.record.isSign = res.isSign;
            this.operationCode = res.isSign === '1' ? '002' : '003';
          }
          this.record.signLeaderId = res.signLeaderId;
          this.record.Review = res.Review;
          this.record.signRemark = res.signRemark;
          this.formDcontent.updateFields(this.mapPropsToFieldsForm());
        }
        // 重复关联文件
        this.relatedDetail(id).then((res2) => {
        // 判断是否为空对象
          const arr = Object.keys(res2);
          if (arr.length > 0) {
            this.d6File = (res2.issueExtendDTO.files || []);
          }
        });
      });
      this.analysisDetail(this.id).then((res) => {
        if (res) {
          this.analysisId = res.id;
          this.optCounterD2 = res.optCounter;
        }
      });
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
    },
    getUploadUrl (path) {
      return this.$store.getters.getUrl(path);
    },
    // 再分配弹框
    showModal () {
      this.rediStribution.updateFields(this.resMapPropsToFields());
      this.visibleRes = true;
    },
    handleOk () {
      enableScroll();
      this.rediStribution.resetFields();
      this.visible = false;
    },
    handleCancel () {
      enableScroll();
      this.rediStribution.resetFields();
      this.visibleRes = false;
    },
    // 是否需要7钻分析
    determineChange (e) {
      if (e.target.value === '1') {
        this.NeedFlage = false;
        this.workflowRoleChange(void 0, 'coChair');
      } else if (e.target.value === '0') {
        this.NeedFlage = true;
      }
    },
    // 车型选择
    vehicleModelIdChange (value) {
      this.carTitle = value;
      if (value) {
        this.titleFlag = true;
      }
    },
    /**
     * 回看其他不走的信息
     * @param String param - 8D的流程标识（0, 1, 2, 3 ... 6）
     */
    goto (param) {
      this.formDcontent.updateFields(this.mapPropsToFieldsForm());
      this.backCurrent = param > this.stepMax ? this.stepCurrent : param;
      if (this.stepCurrent !== 6 && this.stepMax === 6 && param === 6) {
        this.backCurrent = this.stepCurrent;
      }
      console.log(param);
      console.log(this.specialCloseNode);
      // 如果为特殊关闭
      if (this.statusSpecialClose && param < this.stepMax && param > this.specialCloseNode) {
        param = this.specialCloseNode;
        this.backCurrent = this.specialCloseNode;
      }
      if (param <= this.stepMax && this.backCurrent !== this.stepCurrent) {
        this.backFlag = true;
        if (param === 0) {
          this.problemDefinition(this.id).then((res = {}) => {
            this.problemDefinitionData = res || {};
            if (res) {
              this.problemDefinitionData.icaDescriptionD1 = res.icaDescription;
              this.conActionFlag = res.isNeedIca === '1';
              //  this.updateData = this.problemDefinitionData.updateList;
              // this.stepDetail.fileList = (res.files || []).map(this.file2client);
              this.d0FileList = (res.files || []).map(this.file2client);
              this.icaFiles = (res.icaFiles || []).map(this.file2client);
              this.idDef = res.id;
              this.optCounterD0 = res.optCounter;
              if (res.isProject) {
                this.record.isProject = res.isProject;
              }
              this.formDcontent.updateFields(this.mapPropsToFieldsForm());
            }
          });
        } else if (param === 1) {
          this.issueDefinition(this.id).then((res = {}) => {
            this.issueDefinitionData = res || {};
            this.analysisData = [];
            if (res) {
              this.optCounterD1 = res.optCounter;
              this.d1FileList = (res.files || []).map(this.file2client);
              this.idRes = res.id;
            }
            if (res.type) {
              this.record.type = res.type;
              this.NeedFlage = res.type !== '1';
            }
            this.record.owerDeptLv1 = res.owerDeptLv1;
            this.record.champion = res.champion;
            this.formDcontent.updateFields(this.mapPropsToFieldsForm());
            (this.issueDefinitionData.sevenDiamondsVos || []).forEach((item) => {
              item.operation = this.$t(`fileUpdateTable.view`);
              this.analysisModal = 'find';
            });
            // const status = Number(this.detailList.status);
            // const pagePermission = this.pagePermission;
            for (let i = 0; i < 7; i += +1) {
              if (this.issueDefinitionData.sevenDiamondsVos[i].standard) {
                if (i === 0) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.1stDiamond')}: ${this.$t('issue_workflow.D1.rightProcess')}`;
                }
                if (i === 1) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.2ndDiamond')}: ${this.$t('issue_workflow.D1.rightTools')}`;
                }
                if (i === 2) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.3rdDiamond')}: ${this.$t('issue_workflow.D1.rightMaterials')}`;
                }
                if (i === 3) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.4thDiamond')}: ${this.$t('issue_workflow.D1.specification')}`;
                }
                if (i === 4) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.5thDiamond')}: ${this.$t('issue_workflow.D1.processChange')}`;
                }
                if (i === 5) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.6thDiamond')}: ${this.$t('issue_workflow.D1.partChange')}`;
                }
                if (i === 6) {
                  this.issueDefinitionData.sevenDiamondsVos[i].sevenmonds = `${this.$t('issue_workflow.D1.7thDiamond')}: ${this.$t('issue_workflow.D1.complex')}`;
                }
                this.issueDefinitionData.sevenDiamondsVos[i].index = i;
                this.analysisData.push(this.issueDefinitionData.sevenDiamondsVos[i]);
              }
            }
          });
        } else if (param === 2) {
          this.rootCause(this.id).then((res = {}) => {
            if (res) {
              this.rootCauseData = res || {};
              this.d2FileList = (res.files || []).map(this.file2client);
              this.optCounterD2 = res.optCounter;
              this.idReason = res.id;
              if (res.rootCauseDescription) {
                this.record.rootCauseDescription = res.rootCauseDescription;
              }
              this.formDcontent.updateFields(this.mapPropsToFieldsForm());
            }
            this.formDcontent.updateFields(this.mapPropsToFieldsForm());
          });
        } else if (param === 3) {
          this.MeasureDetail(this.id).then((res) => {
            this.stepMeasures = res;
            this.d3FileList = (res.files || []).map(this.file2client);
          });
        } else if (param === 4) {
          this.ImplementationDetail(this.id).then((res) => {
            this.stepImplementation = res;
            this.d4FileList = (res.files || []).map(this.file2client);
          });
        } else if (param === 5) {
          this.effectDetail(this.id).then((res) => {
            this.stepEffect = res;
            this.d5FileList = (res.files || []).map(this.file2client);
          });
          this.updateFile(this.id).then((res) => {
            this.updateData = res;
          });
        } else if (param === 6) {
          this.closeDetail(this.id).then((res) => {
            this.d6FileList = (res.files || []).map(this.file2client);
            this.stepClose = res;
          });
        }
      } else if (this.backCurrent === 6 && this.stepCurrent === 6) {
        this.backFlag = false;
        this.closeDetail(this.id).then((res) => {
          this.stepClose = res;
        });
      } else {
        this.backFlag = false;
      }
    },
    // tab栏切换
    callback () {
    },
    // 查看更多
    showMore () {
      this.showMoreFlag = !this.showMoreFlag;
    },
    // 所属功能选择
    functionChange (value) {
      this.functionTitle = value;
      if (value) {
        this.titleFlag = true;
      }
    },
    faultCodeChange (value) {
      this.codeTitle = value;
      if (value) {
        this.titleFlag = true;
      }
    },
    // 再分配提交
    handleUser () {
      enableScroll();
      this.rediStribution.validateFields((err) => {
        if (!err) {
          const data = this.rediStribution.getFieldsValue();
          const param = {
            taskId: this.detailList.taskId,
            variable: {
              champion: data.champion,
            },
          };
          this.redistributionFun(param).then(() => {
            const championUpate = {
              issueId: this.id,
              userId: data.champion,
              responsibleDepartmentId: data.owerDeptLv1,
              message: data.rediStributionMessage,
            };
            // 修改后台角色人员信息
            // 将暂存区放入角色人员区
            this.workflowRoles.champion = this.reChampion;
            this.workflowRoles.sectorManager = this.reSectorManager;
            this.workflowRoles.director = this.reDirector;
            this.handelActRoles();
            // 修改后台当前责任人
            this.updateChampionFun(championUpate).then(() => {
              // const updateDate = res.data;
            });
            this.visibleRes = false;
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          });
        }
      });
    },
    // 问题回退提交
    goBackOk () {
      enableScroll();
      this.goBackForm.validateFields((err) => {
        if (!err) {
          this.visibleRollback = false;
          const data = this.goBackForm.getFieldsValue();
          const transData = {
            businessKey: this.id, // 问题id
            processDefinitionKey: this.procDefKey, // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.detailList.taskId, //  任务id
            userId: this.userId, //  当前用户id
            targetTaskDefinitionKey: data.goBackStatus,
            comment: data.comment, // 问题回退理由
            operationCode: '004',
            variables: {
              businessKey: this.id, // 问题id
              comment: data.comment, // 问题回退理由
              isDirectSerious: (this.detailList.gradeName === 'A' || this.detailList.gradeName
                === 'B') ? '1' : '0', // 是否直接极端严重事情
              isAB: (this.detailList.gradeName === 'A' || this.detailList.gradeName === 'B') ? '1'
                : '0',
            },
          };
          // for(let item in this.workflowRoles) {
          //   transData.variables[item]=this.workflowRoles[item];
          // }
          // //保存任务角色
          // for(let item in this.workflowRoles) {
          //   this.workflowRolesList.push({groupId:item,userId:this.workflowRoles[item],procInstId:this.wkprocessInstanceId,procDefKey:this.procDefKey,businessKey:this.id});
          // }
          // this.addActIdMembership(this.workflowRolesList).then(result => {
          //   this.workFlowSubmit(transData).then(() => {
          //   // taskId从工作流中读取改为从详情读取  2019/09/23 16：40
          //   // if (res.taskId) {
          //   //   this.taskId = res.taskId;
          //   // }
          //   //  再分析成功
          //     this.$message.success(this.$t('issue_workflow.rejectSuccess'));
          //     this.$store.dispatch('refresh');
          //   });
          // });
          const param = {
            issueId: this.id,
            fieldValue: this.statusCode.statusNewCode,
            fieldType: '1001',
          };
          this.backOrClose(param).then({});
          this.moveto(transData).then((res) => {
            console.log(res);
            this.handleMainIssueFunction('010');
            this.$message.success(this.$t('issue_action.rollbackSuccess'));
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          });
        }
      });
    },
    // 特殊关闭提交
    closeOk () {
      enableScroll();
      this.closeForm.validateFields((err) => {
        if (!err) {
          this.visibleSpeClose = false;
          const data = this.closeForm.getFieldsValue();
          const transData = {
            businessKey: this.id, // 问题id
            processDefinitionKey: this.procDefKey, // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.detailList.taskId, //  任务id
            userId: this.userId, //  当前用户id
            operationCode: '005',
            comment: data.comment, // 问题回退理由
            targetTaskDefinitionKey: 'U700100', // 固定值
            variables: {
              businessKey: this.id, // 问题id
              comment: data.comment, // 问题回退理由
            },
          };
          const param = {
            issueId: this.id,
            fieldValue: this.statusCode.statusNewCode,
            fieldType: '1002',
          };
          this.backOrClose(param).then({});
          // const paramClose = {
          //   issueId: this.id,
          //   files: this.record.serverfiles,
          // };
          this.moveto(transData).then(() => {
            this.handleMainIssueFunction('009');
            this.$message.success(this.$t('issue_action.specialCloseSucess'));
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          });
          // this.speCloseWorkFlow(transData).then((res) => {
          //   this.$message.success(this.$t('issue_action.specialCloseSucess'));
          //   this.$router.push({
          //     path: this.$route.query.form || '/',
          //   });
          // });
        }
      });
    },
    // 特殊关闭取消
    closeCancel () {
      enableScroll();
      this.closeForm.resetFields();
      this.visibleSpeClose = false;
    },
    // 问题回退取消
    goBackCancel () {
      enableScroll();
      this.goBackForm.resetFields();
      this.visibleRollback = false;
    },
    // 提交弹框确认按钮
    submitOk () {
      enableScroll();
      this.visibleSubmit = false;
      this.submitLoading = true;
      this.handleSubmitFunction();
    },
    // 提交弹框取消按钮
    submitCancel () {
      enableScroll();
      this.visibleSubmit = false;
    },
    handleDelete () {
      toggleForbidScrollThrough(true);
      this.visibleDelete = true;
    },
    // 删除弹框确认按钮
    deleteOk () {
      enableScroll();
      this.visibleDelete = false;
      this.handleDeleteFunction();
    },
    // 删除弹框取消按钮
    deleteCancel () {
      enableScroll();
      this.visibleDelete = false;
    },
    handleDeleteFunction () {
      const vm = this;
      vm.delFlag = 1;
      const param = { id: vm.id, optCounter: vm.optCounter, delFlag: vm.delFlag };
      // eslint-disable-next-line no-unused-vars
      vm.delIssue(param).then((res) => {
        this.$message.success(this.$t('delete.success'));
        this.goBack();
      // eslint-disable-next-line no-unused-vars
      }).catch((err) => {
        this.$message.error(this.$t('delete.failure'));
        this.goBack();
      });
    },
    // 点击提交
    handleSubmit () {
      const vm = this;
      const { commitButton } = vm.$refs;
      if (!vm.allowCommit) {
        vm.$message.warning('该问题保存信息不全，请在编辑页面中提交').then(commitButton.reset);
        return;
      }
      if (this.backCurrent !== this.stepCurrent) {
        this.goto(this.stepCurrent);
      } else {
        this.formDcontent.validateFields((err) => {
          if (!err) {
            toggleForbidScrollThrough(true);
            this.visibleSubmit = true;
          }
        });
      }
    },
    isEmpty (e) {
      return (e === undefined || e === '');
    },
    // 提交调用接口函数
    handleSubmitFunction () {
      const { commitButton } = this.$refs;
      const vm = this;
      // if (!vm.allowCommit) {
      //   vm.$message.warning('该问题保存信息不全，请在编辑页面中提交').then(commitButton.reset);
      //   return;
      // }

      this.formDcontent.validateFields((err) => {
        if (!err) {
          this.routerFlag = false;
          this.handleSave(2);
          const data = this.formDcontent.getFieldsValue();
          if (Number(vm.detailList.status) === 201500) {
            data.endSeven = '1';
          }
          // console.log(this.record);
          // 备注
          if (parseInt(this
            .statusCode.statusNewCode, 10) === 100200) {
            this.record.isPass = data.isProject;
          }
          if (data.verifySeven) {
            this.record.isPass = data.verifySeven;
          }
          // 添加操作码
          if (this.record.isPass) {
            this.operationCode = this.record.isPass === '1' ? '002' : '003';
          }
          // 提交操作权限
          if (parseInt(this.statusCode.statusNewCode, 10) === 100300
            || parseInt(this.statusCode.statusNewCode, 10) === 100108 || this.pagePermission.A1_1_3 || this.pagePermission.A2_1_3 || this.pagePermission.A3_1_3 || this.pagePermission.A4_1_3 || this.pagePermission.A5_1_3 || this.pagePermission.A5_4_3 || this.pagePermission.A6_1_3 || this.pagePermission.A1_3_3 || this.pagePermission.A1_6_3 || this.pagePermission.A1_9_3 || this.pagePermission.A1_12_3 || this.pagePermission.A1_15_3 || (this.pagePermission.A0_1_3 && data.isNeedIca === '1' && data.isProject === '1') || this.pagePermission.A0_4_3) {
            this.operationCode = '001';
          }
          // if (data.verifySeven) {
          //   this.operationCode = data.verifySeven === '1'? '002' : '003';
          // }
          // if (data.endSeven) {
          //   this.operationCode = data.endSeven === '1' ? '003' : '002';
          // }
          // if (data.isProject) {
          //   this.operationCode = data.isProject === '1' ? '002' : '003';
          // }
          // if (this.isCheckError === '1') {
          //   this.operationCode = '003';
          // }
          const commentVal = this.record.isPass === '0' ? this.record.comment : this.record.notes;
          const transData = {
            businessKey: this.id, // 问题id
            businessTitle: data.title, // 问题title
            processDefinitionKey: this.procDefKey, // IRS2  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.detailList.taskId, //  任务id
            userId: this.userId, //  当前用户id,
            operationCode: this.operationCode,
            comment: commentVal || '',
            variables: {
              businessKey: this.id, // 问题id
              comment: commentVal || '',
              assigner: data.diamondOwner1,
              isDirectSerious: (this.detailList.gradeName === 'A' || this.detailList
                .gradeName === 'B') ? '1' : '0', // 是否直接极端严重事情
              isEnd: this.record.isClose, // 是否关闭
              isPass: data.verifySeven || this.record.isPass, // 审核是否通过
              isQZEnd: data.endSeven, // 是否结束七钻
              isHaveCO: this.workflowRoles.coChair == null ? '0' : '1', // 是否SC
              isAB: (this.detailList.gradeName === 'A' || this.detailList.gradeName
                === 'B') ? '1' : '0',
              isQZ: data.type, // 是否需要七钻
              isCheckError: this.isCheckError, // 验证不通过(需要回到七钻前)
              isLeaderSign: this.record.isSign, // 领导加签
              isItem: data.isProject, // 是否立项
              isWD: data.isNeedIca, // 是否围堵
            },
          };
          // 保存任务角色
          for (const item in this.workflowRoles) {
            transData.variables[item] = this.workflowRoles[item];
            this.workflowRolesList.push({
              groupId: item, userId: this.workflowRoles[item], procInstId: this.wkprocessInstanceId, procDefKey: this.procDefKey, businessKey: this.id,
            });
          }
          this.addActIdMembershipToAct(this.workflowRolesList).then(() => {
            this.addActIdMembership(this.workflowRolesList).then((addResult) => {
              for (const item in addResult) {
                transData.variables[item] = addResult[item];
              }
              vm.workFlowSubmitNew(transData).then(() => {
                // taskId从工作流中读取改为从详情读取  2019/09/23 16：40
                // if (res.taskId) {
                //   this.taskId = res.taskId;
                // }
                vm.handleMainIssueFunction('009');
                vm.$message.success(vm.$t('issue_workflow.submitSuccess'));
                // 如果当前步骤为D0并且选择立项那么页面不跳转
                if ((this.record.isProject === '1' && this.stepCurrent === 0 && parseInt(this
                  .statusCode.statusNewCode, 10) === 100200 && data.isNeedIca === '0') || (this.record.isPass === '1' && this.stepCurrent === 5 && (this.statusCode.statusNewCode === '600900' || this.statusCode.statusNewCode === '600905')) || (this.record.isPass === '1' && this.stepCurrent === 0 && this.statusCode.statusNewCode === '100600')) {
                  // commitButton.reset();
                  // this.init();
                  this.$store.dispatch('refresh');
                } else {
                  this.$router.push({
                    path: this.$route.query.form || '/',
                  });
                  this.$store.dispatch('refresh');
                }
              }).finally(commitButton.reset);
            });
          });
        } else {
          commitButton.reset();
          this.routerFlag = true;
        }
      });
    },
    handleSave (status) {
      if (status === 1) {
        this.handelActRoles();
      }
      const { saveButton } = this.$refs;
      const data = this.formDcontent.getFieldsValue();
      // eslint-disable-next-line no-underscore-dangle
      const _this = this;
      data.issueId = this.stepId;
      if (this.statusCode.statusNewCode === '100100') {
        saveButton.reset();
        this.$router.push({
          path: this.$route.query.form || '/',
        });
        this.$store.dispatch('refresh');
      }
      // 判断当前步骤
      if (this.stepCurrent === 0 && parseInt(this.statusCode.statusNewCode, 10) > 100100 && (this.pagePermission.A0_1_3 || this.pagePermission.A0_4_3)) {
        if (this.d0FileList && this.d0FileList.length) {
          data.files = this.d0FileList;
        }
        if (this.icaFiles && this.icaFiles.length) {
          data.icaFiles = this.icaFiles;
        }
        data.optCounter = this.optCounterD0;
        data.icaDescription = this.record.icaDescriptionD1;
        data.icaRemark = this.record.icaRemark;
        data.icaWriterDepartment = this.record.icaWriterDepartment;
        data.icaWriter = this.record.icaWriter;
        data.isNeedIca = this.record.isNeedIca;
        data.id = this.idDef;
        // this.d0Form = {
        //   icaRemark: this.record.icaRemark,
        //   icaWriterDepartment: this.record.icaWriterDepartment,
        //   icaWriter: this.record.icaWriter,
        //   // eslint-disable-next-line no-dupe-keys
        //   icaRemark: this.record.icaRemark,
        //   files: this.d0FileList,
        //   isProject: this.record.isProject,
        //   isNeedIca: this.record.isNeedIca,
        // };
        this.problemDefinitionAdd(data).then((res) => {
          this.problemDefinitionData = res;
          this.optCounterD0 = res.optCounter;
          saveButton.reset();
          if (this.routerFlag) {
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          }
        });
      }
      // eslint-disable-next-line func-names
      this.$nextTick(() => {
        if (this.stepCurrent === 1) {
          if (this.d1FileList && this.d1FileList.length) {
            data.files = this.d1FileList;
          }
          data.optCounter = this.optCounterD1;
          data.id = this.idRes;
          _this.analysisData = _this.analysisData || [];
          let optCoustValid = false;
          if (this.issueDefinitionData.sevenDiamondsVos) {
            optCoustValid = true;
          }
          if (!_this.analysisData.length || this.statusCode.statusNewCode === '200105') {
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner1,
                type: 'DIAMONDS01',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[0].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[0].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner1,
                type: 'DIAMONDS02',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[1].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[1].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner1,
                type: 'DIAMONDS03',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[2].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[2].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner4,
                type: 'DIAMONDS04',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[3].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[3].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner5,
                type: 'DIAMONDS05',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[4].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[4].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner6,
                type: 'DIAMONDS06',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[5].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[5].id : null,
              });
            }
            if (!this.NeedFlage) {
              _this.analysisData.push({
                champion: this.record.diamondOwner7,
                type: 'DIAMONDS07',
                optCounter: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[6].optCounter : null,
                id: optCoustValid ? this.issueDefinitionData.sevenDiamondsVos[6].id : null,
              });
            }
          }
          _this.analysisData.forEach((item) => {
            this.AnalysisTotal.forEach((item2) => {
              if (item.id === item2.id) {
                item.files = item2.files;
              }
            });
          });
          data.sevenDiamondsVos = _this.analysisData;
          data.optCounter = this.optCounterD1;
          // if(!data.type){
          //   data.type = this.record.type;
          // }
          // data.type = '1';
          // // 将type值修改   2019/12/6
          // else if(this.issueDefinitionData.type === '1'){
          //   data.type = this.issueDefinitionData.type;
          // }
          if (!data.type) {
            data.type = this.record.type;
          }
          this.saveSevenDiamonds({
            sevenDiamondsVOS: data.sevenDiamondsVos,
          });
          this.issueDefinitionAdd(data).then((res) => {
            this.optCounterD1 = res.optCounter;
            saveButton.reset();
            if (this.routerFlag) {
              this.$router.push({
                path: this.$route.query.form || '/',
              });
              this.$store.dispatch('refresh');
            }
          });
        }
      });
      if (this.stepCurrent === 2 && this.pagePermission.A2_1_3) {
        // data.type = '1';
        data.id = this.idReason;
        data.optCounter = this.optCounterD2;
        if (this.d2FileList && this.d2FileList.length) {
          data.files = this.d2FileList;
        }
        this.analysisSave(data).then((res) => {
          this.optCounterD2 = res.optCounter;
          saveButton.reset();
          if (this.routerFlag) {
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          }
        });
      }
      data.issueId = this.id;
      if (data.failureDate) {
        data.failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.createDate) {
        data.failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.estimatedClosureTime) {
        data.estimatedClosureTime = data.estimatedClosureTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.pcaExecTime) {
        data.pcaExecTime = data.pcaExecTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.pcaValidPlanTime) {
        data.pcaValidPlanTime = data.pcaValidPlanTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.pcaPlanTime) {
        data.pcaPlanTime = data.pcaPlanTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.icaBreakpointTime) {
        data.icaBreakpointTime = data.icaBreakpointTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.icaExecTime) {
        data.icaExecTime = data.icaExecTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.breakpointDate) {
        data.breakpointDate = data.breakpointDate.format('YYYY-MM-DD HH:mm:ss');
      }
      // 措施实施表单回写
      if (this.stepCurrent === 3 && this.pagePermission.A3_1_3) {
        if (this.d3FileList && this.d3FileList.length) {
          data.files = this.d3FileList;
        }
        // 措施实施表单回写
        data.icaExecDescription = this.stepMeasures.icaExecDescription;
        data.icaExecTime = this.stepMeasures.icaExecTime;
        data.pcaExecDescription = this.stepMeasures.pcaExecDescription;
        data.pcaExecTime = this.stepMeasures.pcaExecTime;


        data.type = '0';
        data.icaOptCounter = this.icaOptCounter;
        data.optCounter = this.optCounterD3;
        data.icaId = this.icaId;
        data.smallBatchValidationId = this.smallBatchValidationId;
        data.issueId = this.id;
        data.id = this.id1;
        this.MeasureDecisionSave(data).then(() => {
          this.MeasureDetail(this.id).then((res) => {
            this.stepMeasures = res;
            this.optCounterD3 = res.optCounter;
            this.icaOptCounter = res.icaOptCounter;
            this.id1 = res.id;
            saveButton.reset();
            if (this.routerFlag) {
              this.$router.push({
                path: this.$route.query.form || '/',
              });
              this.$store.dispatch('refresh');
            }
          });
        });
      } else if (this.stepCurrent === 4 && this.pagePermission.A4_1_3) {
        if (this.d4FileList && this.d4FileList.length) {
          data.files = this.d4FileList;
        }
        data.type = '1';
        // 措施指定表单回写
        data.icaDescription = this.stepImplementation.icaDescription;
        data.pcaDescription = this.stepImplementation.pcaDescription;
        data.carTreatmentMeasures = this.stepImplementation.carTreatmentMeasures;
        data.icaBreakpointVin = this.stepImplementation.icaBreakpointVin;
        data.icaBreakpointTime = this.stepImplementation.icaBreakpointTime;
        data.pcaPlanTime = this.stepImplementation.pcaPlanTime;
        data.pcaValidPlanTime = this.stepImplementation.pcaValidPlanTime;
        data.smallBatchValidation = this.stepImplementation.smallBatchValidation;
        data.estimatedClosureTime = this.stepImplementation.estimatedClosureTime;
        // 措施实施表单
        data.id = this.id2;
        data.optCounter = this.optCounterD4;
        data.icaOptCounter = this.icaOptCounter;
        data.icaOptCounter = this.icaOptCounter;
        data.icaId = this.icaId;
        data.smallBatchValidationId = this.smallBatchValidationId;
        data.issueId = this.id;
        data.pcaExecDescription = this.record.pcaExecDescription;
        this.MeasureDecisionSave(data).then(() => {
          this.ImplementationDetail(this.id).then((res) => {
            this.stepImplementation = res;
            this.optCounterD4 = res.optCounter;
            this.icaOptCounter = res.icaOptCounter;
            this.id2 = res.id;
          });
          saveButton.reset();
          if (this.routerFlag) {
            this.$router.push({
              path: this.$route.query.form || '/',
            });
            this.$store.dispatch('refresh');
          }
        });
      } else if (this.stepCurrent === 5 && (this.pagePermission.A5_1_3 || this.pagePermission.A5_4_3)) {
        if (this.d5FileList && this.d5FileList.length) {
          data.files = this.d5FileList;
        }
        // data.type = '1';
        // 当为提出人填写时给效果验证填写表单赋值
        if (this.pagePermission.A5_4_3) {
          data.description = this.stepEffect.description;
          data.breakpointVin = this.stepEffect.breakpointVin;
          data.breakpointDate = this.stepEffect.breakpointDate;
          data.lessonsLearn = this.stepEffect.lessonsLearn;
        }
        if (this.pagePermission.A5_1_3) {
          data.proposerVerification = this.stepEffect.proposerVerification;
        }
        data.id = this.idEffct;
        data.optCounter = this.optCounterD5;
        this.effectSave(data).then(() => {
          this.effectDetail(this.id).then((res) => {
            this.stepEffect = res;
            this.optCounterD5 = res.optCounter;
            this.idEffct = res.id;
            saveButton.reset();
            if (this.routerFlag) {
              this.$router.push({
                path: this.$route.query.form || '/',
              });
              this.$store.dispatch('refresh');
            }
          });
        });
      } else if (this.stepCurrent === 6 && (this.pagePermission.A6_1_3 || this.pagePermission.A6_2_3)) {
        if (this.d6FileList && this.d6FileList.length) {
          data.files = this.d6FileList;
        }
        // data.type = '1';
        data.id = this.idClose;
        data.optCounter = this.optCounterD6;
        // 如果领导审阅的时候备注为空，根据后台要求传入一个空格给到后台数据库
        if (data.signRemark === null || data.signRemark === '') {
          data.signRemark = ' ';
        }
        if (this.pagePermission.A6_2_3) {
          data.signLeaderId = this.stepClose.signLeaderId;
          data.creatorName = this.stepClose.creatorName;
          data.stepClose = this.stepClose.createDate;
          data.recurrencePrevention = this.stepClose.recurrencePrevention;
        }
        if (this.pagePermission.A6_1_3) {
          data.signRemark = this.stepClose.signRemark;
        }
        this.closeSave(data).then(() => {
          this.closeDetail(this.id).then((res) => {
            this.stepClose = res;
            this.optCounterD6 = res.optCounter;
            this.idClose = res.id;
            saveButton.reset();
            if (this.routerFlag) {
              this.$router.push({
                path: this.$route.query.form || '/',
              });
              this.$store.dispatch('refresh');
            }
          });
        });
      }
    },
    handleSearch (e) {
      e.preventDefault();
    },
    handleReset () {
      this.$router.push({
        path: this.$route.query.form || '/',
      });
      this.$store.dispatch('refresh');
    },

    toggle () {
      this.expand = !this.expand;
    },
    // 点击编辑按钮
    editDetail () {
      this.editFlag = true;
      const name = 'edit';
      const { id } = this;
      this.$router.push({
        name: 'QuestionCreate',
        params: {
          name,
          id,
        },
        query: {
          form: this.$route.path,
        },
      });
      this.$store.dispatch('refresh');
    },
    // 是否满足立项条件切换
    satisfyChange (e) {
      // this.record.isNeedIca = '0';
      if (e.target.value === '1') {
        this.satisfyFlag = true;
        this.record.isPass = '1';
        // 可以保存
        this.pagePermission.button_commit_3 = true;
      } else if (e.target.value === '0') {
        this.satisfyFlag = false;
        this.record.isPass = '0';
        // 不可以保存
        this.pagePermission.button_commit_3 = false;
      }
    },
    // 单页报告下载
    issueReportDownload () {
      this.issueExportTemplate({ id: this.id }).then();
    },
    // 保存工作流角色人物
    handelActRoles () {
      for (const item in this.workflowRoles) {
        this.workflowRolesList.push({
          groupId: item, userId: this.workflowRoles[item], procInstId: this.wkprocessInstanceId, procDefKey: this.procDefKey, businessKey: this.id,
        });
      }
      this.addActIdMembership(this.workflowRolesList).then(() => {

      });
    },
    // 更换工作流角色人员
    workflowRoleChange (value, role) {
      this.workflowRoles[role] = value;
    },
    // 更新责任人或者提出人科长或者部长
    worlkChampionOrProposer (value, role, isStagedRole) {
      if (role === 'advanceUser') {
        this.workflowRoles[role] = value;
        if (value) {
          this.getUserByPositionCodeFunction(value, 'sectorManager', 'advanceSelector');
        } else {
          this.workflowRoles.advanceSelector = '';
        }
      } else if (role === 'champion') {
        if (isStagedRole) {
          this.reChampion = value;
        } else {
          this.workflowRoles[role] = value;
        }
        if (value) {
          this.getUserByworkFlowPositionCodeFunction(value, 'sectorManager', 'sectorManager', isStagedRole);
          this.getUserByworkFlowPositionCodeFunction(value, 'director', 'director', isStagedRole);
        }
      }
    },
    // 获取对应人科长或者部长信息
    getUserByPositionCodeFunction (value, positionCode, role) {
      const parmas = {
        userId: value,
        positionCode,
      };
      this.getUserByPositionCode(parmas).then((res) => {
        if (res[0]) {
          this.workflowRoles[role] = res[0].id;
        } else {
          this.workflowRoles[role] = void 0;
        }
      });
    },
    // 获取工作流对应人科长或者部长信息
    getUserByworkFlowPositionCodeFunction (value, positionCode, role, isStagedRole) {
      const parmas = {
        userId: value,
        positionCode,
      };
      this.getUserByworkflowPositionCode(parmas).then((res) => {
        if (res[0]) {
          if (role === 'sectorManager' && isStagedRole) {
            this.reSectorManager = res[0].id;
          } else if (role === 'director' && isStagedRole) {
            this.reDirector = res[0].id;
          } else if (!isStagedRole) {
            this.workflowRoles[role] = res[0].id;
          }
        }
      });
    },
    // 处理主问题自由跳转
    handleMainIssueFunction (opearationCode) {
      if (this.detailList.masterIssueId) {
        console.log(`masterId----->${this.detailList.masterIssueId}`);
        this.handleMainIssue(this.detailList.masterIssueId).then((mainIssueRes) => {
          if (mainIssueRes.isUpdata === '1') {
            this.eidtQuestion(this.detailList.masterIssueId).then((mainIssueDetail) => {
              const transData = {
                businessKey: mainIssueDetail.id, // 问题id
                processDefinitionKey: 'IRS2', // IRS2  固定值
                subSys: 'irs', //  子系统编号
                taskId: mainIssueDetail.taskId, //  任务id
                userId: this.userId, //  当前用户id
                operationCode: opearationCode,
                comment: ' ', // 问题回退理由
                targetTaskDefinitionKey: `U${mainIssueRes.status}`, // 跳转节点
                variables: {
                  businessKey: mainIssueDetail.id, // 问题id
                  comment: '', // 问题回退理由
                },
              };
              this.moveto(transData).then();
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="less">
  /deep/ form textarea.ant-input{
    margin-bottom:-10px;
  }
  .textareaLabel {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0;
  }

  .visibleDetail {
    .ant-form-item-label {
      label {
        font-size: 14px;
      }

    }
  }
</style>
<style lang="less" scoped>
  /deep/ .ant-upload-list-item-name {
    max-width: 610px;
  }
  /deep/ .ant-upload-list-item-name-small {
    width: 340px;
  }
  /deep/ .ant-card-bordered{
    border:none;
  }
  .formConetnt .v-textarea /deep/ .v-input-helper{
    background-color: #f5f5f5 !important;
  }
  /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, .45);
    font-size: 12px;
  }
  .spantable span{
    display:block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width:100px;
  }
  .spantable {
    width:100px;
  }
  .D5back /deep/ .ant-table-thead > tr > th{
     padding: 16px 12px !important;
   }
   .D5back /deep/ .ant-table-tbody > tr > td{
     padding: 16px 12px !important;
   }
   .D5content /deep/ .ant-table-thead > tr > th{
     padding: 16px 12px !important;
   }
   .D5content /deep/ .ant-table-tbody > tr > td{
     padding: 16px 12px !important;
   }
    .duplicate-table {
      width:1136px;
       /deep/ .ant-table-thead{
         width:1136px;
       }
       /deep/ .ant-table-tbody{
         width:1136px;
       }
      /deep/ .ant-table-tbody > tr > td {
        max-width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
      }
    }
 // 回看时候置灰
 .back-form,.D0back,.D1back,.D2back,.D3back,.D4back,.D5back,.D6back{
      // 统一设置问题流程的字体颜色
      /deep/ .ant-form-item-label label {
        color: rgba(0, 0, 0, 0.45);
      }
      /deep/ .ant-form-item-control-wrapper p {
        color: rgba(0, 0, 0, 0.65);
      }
 }
 .ica-edit{
    /deep/ .ant-form-item-label label {
        color:rgba(0, 0, 0, 0.85);
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
 .Association{
   width:672px;
   height:154px;
   background: rgba(0,0,0,0.04);
   border-radius: 4px;
   border-radius: 4px;
   margin:auto;
   padding:8px 0;
   margin-bottom: 16px;
 }
 .D1content {
   .item-title span{
     font-weight: bold;
   }
 }

  /deep/ .ant-advanced-search-form{
     .ant-form-item-control-wrapper{
       min-height:54px;
     }
  }
  .fileModal {
    .ant-advanced-search-form {
        /deep/ .ant-form-item {
          margin-bottom:0;
      }
    }
  }
  .collapse-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      cursor: pointer;
      position: relative;
      padding: 16px 40px;
      color: rgba(0,0,0,.85);
      line-height: 22px;
      cursor: pointer;
      transition: all .3s;
  }
  .faultCodeClass{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow:hidden;/*超出长度的文字隐藏*/
    text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
    white-space:nowrap;/*强制不换行*/
    word-break:keep-all;/*文字不换行*/
  }
  /deep/.ant-btn {
    .anticon {
      margin-left: -4px;
    }
  }

  /deep/ .ant-modal {
    top: 120px !important;
  }

  .new-steps-icon {
    line-height: 1;
    top: -6px;
    position: relative;
    left: -3px;
  }

  #components-form-demo-advanced-search {
    /* 调整样式为紧凑模式 */
    .formConetnt .card-detail{
      /dee/ .ant-card-head-title {
        padding: 8px 0!important;
        margin-top: 0px;
      }
      /deep/ .ant-card-extra {
        padding: 8px 0!important;
      }
      /deep/ .ant-card-body {
        padding: 0 32px;
      }
      .pageTitle {
        padding-left: 0;
        margin: 0;
        display: inline-block;
        text-align: vertical;
        .carTitle {
          width: 840px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 40px;
          height: 40px;
        }
      }
      /deep/ .ant-form-item-children p {
        margin-bottom: 0!important;
        margin-top: -4px!important;
        overflow:hidden;/*超出长度的文字隐藏*/
        text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
        white-space:nowrap;/*强制不换行*/
        word-break:keep-all;/*文字不换行*/
      }
      // /deep/ .textareaLabel, /deep/ p {
      //   margin-bottom: 0!important;
      // }
      // /deep/ .ant-form-item-label {
      //   padding-bottom: 0;
      // }
    }

    .messageForm {
      margin-bottom: 16px;
      /deep/ .ant-row {
        margin: 2px 0;
        line-height: 40px;
        padding-bottom: 0px;
      }
    }
    .examineResult {
      border-bottom: 1px solid rgba(0, 0, 0, 0.09);
      width: 1012px;
      margin-left: 32px;
      margin-bottom: 20px;
    }

    .Dtitle {
      margin-left: 32px;
    }

    .examineTitle {
      border-top: 1px solid rgba(0, 0, 0, 0.09);
      margin-right: 32px;
      display: block;
      width: 1012px;
      padding-top: 20px;
      margin-top: 41px;
      font-size: medium;
    }
    /deep/ .editable-cell-icon-check {
      position: absolute;
      margin-left: 2px;
      margin-top: 6px;
    }

    .showMore {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      letter-spacing: 0;
      float: right;
      right: 52px;
      width: 82px;
      cursor: pointer;
      position: relative;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .gotoFile {
      font-size: 14px;
      color: #0098e0;
      letter-spacing: 0;
      margin-left: 16px;
    }

    .pageTitle {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      border-radius: 4px;
      width: 1168px;
      height: 40px;
      line-height: 40px;
      margin-top: 16px;
      margin-bottom: 24px;
      padding-left: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
    }

    .step {
      width: 690px;
      height: 4px;
      margin-top: 40px;
      margin-left: 175px;
      /deep/ .ant-steps-item-title {
        font-size: 14px;
        text-align: center;
      }
      // 已经完成步骤条样式
      /deep/ .ant-steps-item-finish .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.65);
        font-weight: 400;
      }
      /deep/ .ant-steps-item-process .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.65);
        font-weight: bold;
      }
      /deep/ .ant-steps-item-wait .ant-steps-item-title {
        color: rgba(0, 0, 0, 0.45);
        font-weight: 400;
      }
      //
    }

    .fileNumber {
      display: inline-block;
      width: 32px;
      height: 16px;
      background: rgba(0, 0, 0, 0.09);
      text-align: center;
      line-height: 16px;
      font-size: 12px;
      border-radius: 26px 26px;
      position: relative;
      left: 46px;
      top: -49px;
      color: #000;
    }

    .editIcon {
      position: absolute;
      right: 32px;
      top: 22px;
      height: 20px;
      width: 20px;
      cursor: pointer;
    }

    .baseMessage {
      display: none;
      font-size: 14px;
      color: #000;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .backBtn {
      width: 80px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.65);

      img {
        width: 16px;
        height: 16px;
        margin-top:-5px;
        margin-left:-4px;
        margin-right:6px;
      }
    }

    .submitBtn {
      font-size: 14px;
      color: #ffffff;
      text-align: left;
      line-height: 22px;
      background: #0097e0;
      border-radius: 4px;
      border-radius: 4px;
      margin-left: 10px;
    }

    .saveBtn,
    .cancelBtn {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      text-align: left;
      line-height: 22px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      border-radius: 4px;
    }
    .editBtn {
      font-size: 14px;
      color: #0097e0;
      text-align: left;
      line-height: 22px;
      background: #ffffff;
      border: 1px solid #0097e0;
      border-radius: 4px;
      border-radius: 4px;
    }
  }

  .Dcontent {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border-radius: 4px;
    margin:auto;
    margin-top: 70px;
    padding-top: 28px;
    position: relative;
    width: 1076px;
    height: auto;
   /deep/ textarea.ant-input{
     background: rgba(0, 0, 0, 0);
   }
   /deep/.ant-select-selection{
     background: rgba(0, 0, 0, 0);
   }
   /deep/ .ant-radio-inner{
      background: rgba(0, 0, 0, 0);
   }
   /deep/ .ant-btn{
      background: rgba(0, 0, 0, 0);
   }
   /deep/ .ant-input {
       background: rgba(0, 0, 0, 0);
   }
   /deep/ .ant-input-disabled {
    background-color: #e8e8e8!important;
  }
    .backTitle {
      position: relative;
      top: -20px;
      left: 32px;
    }

    .triangle_border_up {
      width: 0;
      height: 0;
      border-width: 0 16px 15px;
      border-style: solid;
      border-color: transparent transparent #fafafa;
      /*透明 透明  灰*/
      position: absolute;
      left: 80px;
      top: -15px;
    }

    /deep/ .ant-form-item {
      margin-bottom: 7px;
    }

    .uploadText {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      width: 290px;
    }

    .stepFileList {
      .fileList {
        width: 421px;
        overflow: hidden;
        margin-top: 8px;
        margin-left: -20px;

        li {
          float: left;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          text-align: left;
          line-height: 22px;
          width: 80px;
          list-style: none;
          margin-left: 10px;
          margin-right: 10px;
          overflow: hidden;
          /*超出的部分隐藏起来。*/
          white-space: nowrap;
          /*不显示的地方用省略号...代替*/
          text-overflow: ellipsis;
          /* 支持 IE */
        }
      }

      .d2file {
        float: left;
        margin-top: -5px;
      }
    }
  }
  .Dcontent1 {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    border-radius: 4px;
    margin:auto;
    // margin-top: 70px;
    padding-top: 28px;
    position: relative;
    width: 1076px;
    height: auto;
    .backTitle {
      position: relative;
      top: -20px;
      left: 32px;
    }
    /deep/ textarea.ant-input{
     background: rgba(0, 0, 0, 0);
    }
    /deep/.ant-select-selection{
      background: rgba(0, 0, 0, 0);
    }
    /deep/ .ant-radio-inner{
        background: rgba(0, 0, 0, 0);
    }
    /deep/ .ant-btn{
        background: rgba(0, 0, 0, 0);
    }
    /deep/ .ant-input {
        background: rgba(0, 0, 0, 0);
    }
    .triangle_border_up {
      width: 0;
      height: 0;
      border-width: 0 16px 15px;
      border-style: solid;
      border-color: transparent transparent #fafafa;
      /*透明 透明  灰*/
      position: absolute;
      left: 80px;
      top: -15px;
    }

    /deep/ .ant-form-item {
      margin-bottom: 7px;
    }

    .uploadText {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      width: 290px;
    }

    .stepFileList {
      .fileList {
        width: 421px;
        overflow: hidden;
        margin-top: 8px;
        margin-left: -20px;

        li {
          float: left;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          text-align: left;
          line-height: 22px;
          width: 80px;
          list-style: none;
          margin-left: 10px;
          margin-right: 10px;
          overflow: hidden;
          /*超出的部分隐藏起来。*/
          white-space: nowrap;
          /*不显示的地方用省略号...代替*/
          text-overflow: ellipsis;
          /* 支持 IE */
        }
      }

      .d2file {
        float: left;
        margin-top: -5px;
      }
    }
  }
  .D1back {
    /deep/ .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }
  }

  .D2back {
    padding-top: 28px;

    /deep/ .ant-form-item {
      margin-bottom: 0;
    }

    /deep/ .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }

    em {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-style: normal;
    }
  }

  .D2content {
    padding-top: 28px;

  }

  .D3content {
    padding-top: 28px;

    .triangle_border_up {
      position: absolute;
      left: 494px;
      top: -15px;
    }
  }

  .D3back {
    .triangle_border_up {
      position: absolute;
      left: 494px;
      top: -15px;
    }
  }

  .analysisList {
    .analysisTitle {
      margin-left: 40px;
      font-weight: bold;

      span {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        letter-spacing: 0;
      }
    }

    .analysisStep {
      float: left;

      ul {
        margin: 0;
        padding: 0;
        border-right: 2px solid rgba(0, 0, 0, 0.09);
        margin-left: 52px;
        height: 426px;
        width: 160px;
        padding-top: 16px;
        color: rgba(0, 0, 0, 0.25);

        .stepRemove {
          span {
            color: rgba(0, 0, 0, 0.85);
          }

          p {
            color: rgba(0, 0, 0, 0.45);
          }
        }

        li {
          list-style: none;
          width: 160px;
          padding-right: 12px;
          text-align: right;

          div {
            height: 4px;
            width: 134px;

          }

          span {
            font-size: 14px;
          }

          p {
            font-size: 12px;

          }

        }

        .active {

          span {
            color: #0097E0;
            border-right: 2px solid #0097E0;
            width: 134px;
            display: inline-block;
            padding-right: 24px;
          }

          p {
            color: #0097E0;
            border-right: 2px solid #0097E0;
            width: 134px;
            padding-right: 24px;
          }
        }

        .activefirst {
          border-right: 2px solid #0097E0;
          color: #0097E0;
        }
      }
    }
  }

  .analysisTable {
    width: 798px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    float: left;
    border-radius: 4px;
    margin-left: 65px;

    /deep/ .ant-table-thead>tr>th {
      background: rgba(0, 0, 0, 0.02);
    }
  }

  .updateTable {
    float: left;
    width: 572px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    margin-top: 12px;
    overflow-x:auto;
    /deep/ .ant-table-thead>tr>th {
      background: rgba(0, 0, 0, 0.02);
    }
  }

  .D3back,.D4back,.D5back,.D6back {
    padding-top: 28px;
    /deep/ .ant-form-item {
      margin-bottom: 0;
    }

    /deep/ .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }

    em {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-style: normal;
    }

    p {
      font-size: 14px;
    }
  }
  .D6back {
    .examine{
      margin-bottom:24px;
      /deep/ .ant-form-item {
        margin-bottom: 0;
      }

      /deep/ .ant-form-item-label {
        label {
          font-size: 14px;
        }
      }
    }
  }
  .detailText {
    /deep/ .ant-form-item {
      margin-bottom: 0;
    }

    /deep/ .ant-form-item-label {
      label {
        font-size: 14px;
        letter-spacing: 0;
      }

      p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
      }
    }
  }

  /deep/ .ant-card-head-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  /deep/ .ant-collapse-header {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    font-size: medium;
  }

  .questionTitle {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin: 23px auto;

    em {
      background: #0097e0;
      width: 2px;
      height: 12px;
      display: inline-block;
    }

    span {
      margin-left: 4px;
    }
  }

  /deep/ .ant-affix {
    z-index:1000;
    // position: fixed;
    left: 0px !important;
    width: 100% !important;
    // height: 64px !important;
    // background: rgba(0, 0, 0, 0.6);
    // box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
    background: #F5F5F5;
    .top-buttons {
      width: 1200px !important;
      margin: 0 auto !important;
    }
  }

  .top-buttons {
    overflow: hidden;
    padding: 16px 0;

    .rightButton {
      float: right;
    }

    .backButton {
      float: left;
    }
  }

  .clearfix {
    *zoom: 1;
  }

  .ant-advanced-search-form {
    border-radius: 6px;
    margin-bottom: 16px;
    background-color:#fff;

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

    /deep/ .search-result-list {
      margin-top: 16px;
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      min-height: 200px;
      text-align: center;
      padding-top: 80px;
    }

    .form-item-flex-2 {
      /deep/ .ant-form-item-label {
        flex: 0.2;
      }
    }
  }

  //可编辑单元格
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 22px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }

  .processList {
    padding-bottom: 24px;

    .processTitle {
      float: left;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 122.4px;
      margin-right: 20px;

      span {
        display: inline-block;
        margin-right: 4px;
        content: '*';
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
      }

    }

    .processUl {
      float: left;
      border: 1px solid rgba(0, 0, 0, 0.09);
      border-radius: 4px;
      margin-left: 50px;

      ul {
        margin: 0;
        padding: 0;

        li {
          list-style: none;
          width: 572px;
          height: 46px;
          line-height: 46px;
          padding: 0;
          margin: 0;
          padding-left: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.09);

          span {
            width: 50%;
            text-align: left;
            float: left;
          }
        }

        li:last-child {
          border: none !important;
        }

        li:nth-child(1) {
          background: rgba(0, 0, 0, 0.02);
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }

  }

  .visibleDetail {
    .ant-form-item {
      margin-bottom: 0px !important;
    }

    .stepFileList {
      .fileList {
        width: 421px;
        overflow: hidden;
        float: left;
        margin-left: -49px;

        li {
          float: left;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          text-align: left;
          line-height: 22px;
          width: 80px;
          list-style: none;
          margin-left: 10px;
          margin-right: 10px;
          overflow: hidden;
          /*超出的部分隐藏起来。*/
          white-space: nowrap;
          /*不显示的地方用省略号...代替*/
          text-overflow: ellipsis;
          /* 支持 IE */
        }
      }

      .d2file {
        float: left;
        margin-top: -5px;
      }
    }
  }

  .examine {
    padding-bottom:24px;
    /deep/ .ant-form-item-label {
      label {
        font-size: 14px;
      }
    }
  }

  .reviewTitle {
    font-size: 16px;
    color: rgba(0,0,0,0.85);
  }
  .reviewSubtitle{
    font-size: 12px;
    color: rgba(0,0,0,0.45);
  }
  .recordTable{
        /deep/ .ant-table-thead > tr > th {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        text-align: left;
        background: #fafafa;
        border-bottom: 1px solid #e8e8e8;
        transition: background 0.3s ease;
      }
      /deep/ .ant-table-tbody > tr > td {
        max-width: 250px;
      }
    }
</style>
