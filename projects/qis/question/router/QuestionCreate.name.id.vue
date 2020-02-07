<template>
  <div id="components-form-demo-advanced-search">
    <!-- 顶部悬停按钮组 -->
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
            <!-- 「返回」按钮 -->
            {{ $t('issue_action.back') }}
          </a-button>
        </div>
        <div class="rightButton">
          <prevent-button
            v-if="submitBtn"
            ref="commitButton"
            bind="both"
            type="primary"
            class="submitBtn"
            @click="handleSubmit"
          >
            <!-- 「提交」按钮 -->
            {{ $t('issue_action.commit') }}
          </prevent-button>
          <a-modal
            :visible="visibleSubmit"
            :title="$t('confirm.title')"
            :z-index="5001"
            style="top:200px!important;"
            @ok="submitOk"
            @cancel="submitCancel"
          >
            <p>{{ $t('confirm.content') }}</p>
          </a-modal>
          <prevent-button
            ref="saveButton"
            :style="{ marginLeft: '8px' }"
            :class="[actiive]"
            bind="both"
            type="primary"
            @click="handleSave"
          >
            <!-- 「保存」按钮 -->
            {{ $t('issue_action.save') }}
          </prevent-button>
          <!-- 删除按钮 -->
          <a-button
            v-if="delBtn"
            :z-index="5001"
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
            style="top:200px!important;"
            @ok="deleteOk"
            @cancel="deleteCancel"
          >
            <p>{{ $t('delete.content') }}</p>
          </a-modal>
          <a-button
            :style="{ marginLeft: '8px' }"
            class="cancelBtn"
            @click="handleReset"
          >
            <!-- 「取消」按钮 -->
            {{ $t('issue_action.cancel') }}
          </a-button>
        </div>
      </div>
    </a-affix>
    <div class="shadown-block-normal formConetnt">
      <a-card
        :title="questionTitle"
        class="cardTitle"
      >
        <template #extra>
          <!-- 问题来源按钮 -->
          <a-button
            v-if="record.moduleSource"
            class="editBtn"
            @click="moduleSourceDetail"
          >
            <!-- 问题来源按钮 -->
            {{ $t('issue_action.moduleSource') }}
          </a-button>
        </template>
        <a-form
          ref="form"
          :form="form"
          class="ant-advanced-search-form"
          @submit="handleSearch"
        >
          <div>
            <div
              class="collapse-title"
              style="margin-left:16px;"
            >
              <!-- 「基本信息」文本 -->
              {{ $t('issue.basicInfo') }}
            </div>
            <div>
              <div :class="[BaseContent]">
                <div class="pageTitle">
                  <span>
                    <!-- 「问题标题」文本 -->
                    {{ $t('issue.title') }}：
                  </span>
                  <div
                    v-if="carTitle||faultTreeIds2Title||codeTitle"
                    style="display:inline-block;"
                  >
                    <span class="carTitle">{{ carTitle }}</span>
                    <span class="faultTreeIds2Title"> {{ (faultTreeIds2Title ? '-' + faultTreeIds2Title: '') }}</span>
                    <span class="codeTitle">{{ codeTitle ? '-' + codeTitle: '' }}</span>
                  </div>
                </div>
                <div style="margin-left:32px;">
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <!-- 「车型名称」下拉 -->
                      <a-form-item :label="$t('issue.vehicleModelName')">
                        <net-single-tree-select
                          v-decorator="[
                            'vehicleModelId',
                            {rules: [{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :transform="vehicleModelTreeTransform"
                          :placeholder="$t('search.please_select')"
                          allow-clear
                          :disabled="sourceDisabled"
                          url="/masterdata/v1/vehicleproject/treeAll"
                          :query="{ id: '${value}' }"
                          @change="vehicleModelIdChange"
                        />
                        <!-- <net-select
                          v-decorator="[
                            'vehicleModelId',
                            {rules: [{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :transform="selectOption"
                          :placeholder="$t('search.please_select')"
                          allow-clear
                          url="/masterdata/v1/vehiclemodel"
                          @change="vehicleModelIdChange"
                        ></net-select> -->
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「所属系统」下拉 -->
                      <a-form-item
                        :label="$t('issue.faultTreeIds1')"
                      >
                        <net-select
                          v-decorator="[
                            'faultTreeIds1',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :transform="selectOptionFaultTree"
                          :placeholder="$t('search.please_select')"
                          :query="{ id: '${value}'}"
                          allow-clear
                          url="/masterdata/v1/pfscategory?p_id=0"
                          @change="handleSystem"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「所属功能」下拉 -->
                      <a-form-item :label="$t('issue.faultTreeIds2')">
                        <net-select
                          v-decorator="[
                            'faultTreeIds2',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :disabled="!record.faultTreeIds1"
                          :delay="!isEdit || !record.faultTreeIds1"
                          url="/masterdata/v1/pfscategory"
                          :query="{p_id: record.faultTreeIds1, id: '${value}'}"
                          :cache="false"
                          :transform="selectOptionFaultTree"
                          allow-clear
                          @change="faultTreeIds2Change"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「故障代码」下拉 -->
                      <a-form-item :label="$t('issue.faultTreeIds3')">
                        <net-select
                          v-decorator="[
                            'faultTreeIds3',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :delay="!isEdit || !record.faultTreeIds2"
                          :disabled="!record.faultTreeIds2"
                          url="/masterdata/v1/pfsfault"
                          :query="{psId: record.faultTreeIds2, id: '${value}'}"
                          :cache="false"
                          :transform="selectOptionFaultTree3"
                          allow-clear
                          @change="faultTreeIds3Change"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <!-- 「问题分类」下拉 -->
                      <a-form-item :label="$t('issue.source')">
                        <net-select
                          v-decorator="[
                            'source',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="selectOptiondict"
                          allow-clear
                          :disabled="sourceDisabled"
                          url="/sys/dict?dictType=issue_source"
                          @change="handleSource"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「模块」下拉 -->
                      <a-form-item :label="$t('issue.smt')">
                        <net-select
                          v-decorator="[
                            'smt',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="selectOptiondict"
                          allow-clear
                          :disabled="sourceDisabled"
                          url="/sys/dict?dictType=smt"
                          @change="handleResponsibleUserId"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「问题严重等级」下拉 -->
                      <a-form-item :label="$t('issue.grade')">
                        <net-select
                          v-decorator="[
                            'grade',
                            {rules:[{
                              required: valiRequire, message: $t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="selectOptiondict"
                          allow-clear
                          :disabled="sourceDisabled"
                          show-search
                          url="/sys/dict?dictType=issue_grade"
                          @change="handleResponsibleUserId"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「问题管理负责人」下拉 -->
                      <a-form-item :label="$t('issue.responsibleUserId')">
                        <net-select
                          v-decorator="[
                            'responsibleUserId',
                            {rules:[{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="responsibleUserOption"
                          allow-clear
                          :disabled="sourceDisabled"
                          :cache="false"
                          :delay="!isEdit"
                          url="/issue/v1/workflow/getSysUser"
                          :query="{productId: record.vehicleModelId, irtCode:record.source,gradeCode:record.grade,irtModuleCode:record.smt,irtRole: 'monitor',userId:'${value}'}"
                          @change="(value) => workflowRoleChange(value, 'monitor')"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <!-- 「问题阶段」下拉 -->
                      <a-form-item :label="$t('issue.projectPhase')">
                        <net-select
                          v-decorator="[
                            'projectPhase',
                            {rules:[{
                              required: valiRequire, message: $t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="selectOptiondict"
                          allow-clear
                          show-search
                          url="/sys/dict?dictType=issue_phase"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「问题发生日期」时间日期 -->
                      <a-form-item :label="$t('issue.failureDate')">
                        <a-date-picker
                          v-decorator="[
                            'failureDate'
                          ]"
                          :placeholder="$t('search.please_select')"
                          :format="GLOBAL_SELECT_DATE_FORMAT"
                          :disabled-date="disabledDate"
                          style="width:261px;"
                        />
                      </a-form-item>
                    </a-col>

                    <a-col :span="6">
                      <!-- 「生产基地」下拉 -->
                      <a-form-item :label="$t('issue.manufactureBase')">
                        <net-select
                          v-decorator="[
                            'manufactureBaseId',
                            {rules:[{
                              required: valiRequire, message: $t('search.please_select')
                            }]}
                          ]"
                          :placeholder="$t('search.please_select')"
                          :transform="selectOptionBase"
                          allow-clear
                          url="/sys/dict?dictType=plant"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「责任部门」下拉 -->
                      <a-form-item :label="$t('issue.responsibleDepartmentId')">
                        <net-single-tree-select
                          v-decorator="[
                            'responsibleDepartmentId',
                            {rules: [{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :transform="responseDeptTreeTransform"
                          :placeholder="$t('search.please_select')"
                          :query="{nameCode: '${value}' }"
                          allow-clear
                          url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <!-- 「问题频次」输入 -->
                      <a-form-item
                        :label="$t('issue.frequency')"
                        self-update
                      >
                        <v-input
                          v-decorator="[
                            'frequency',
                            {rules: [
                              {required: valiRequire, message: $t('search.please_input')}]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          allow-clear
                        />
                      </a-form-item>
                    </a-col>

                    <a-col :span="6">
                      <!-- 「提出人部门」下拉 -->
                      <a-form-item :label="$t('issue.proposerDepartmentId')">
                        <net-single-tree-select
                          v-decorator="[
                            'advanceDeptId',
                            {rules: [{
                              required: valiRequire, message:$t('search.please_select')
                            }]}
                          ]"
                          :transform="deptTreeTransform"
                          :placeholder="$t('search.please_select')"
                          :query="{ id: '${value}' }"
                          allow-clear
                          :disabled="advanceUserDisabled"
                          url="/sys/dept/deptList/getDeptTreeTwo"
                          @change="userDeptChange"
                        />
                      </a-form-item>
                    </a-col>
                    <!-- 「提出人」下拉 -->
                    <a-col :span="6">
                      <a-form-item :label="$t('issue.proposer')">
                        <net-select
                          v-decorator="[
                            'advanceUserId',
                            {rules:[{
                              required: valiRequire, message: $t('search.please_select')
                            }]}
                          ]"
                          :transform="userOption"
                          :placeholder="$t('search.please_select')"
                          :disabled="!record.advanceDeptId||sourceDisabled"
                          :query="{ deptId: record.advanceDeptId }"
                          :delay="!isEdit"
                          :cache="false"
                          allow-clear
                          url="/sys/user/useList/getUsersByDeptPid"
                          @change="(value) => worlkChampionOrProposer(value, 'advanceUser')"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>

                    <a-col :span="6">
                      <!-- 「相关人手机」输入 -->
                      <a-form-item
                        :label="$t('issue.contact')"
                        class="quesetionContact"
                        self-update
                      >
                        <v-input
                          v-decorator="[
                            'contact',
                            {rules: [
                              {required: valiRequire, message: $t('search.please_input')},
                              {validator: phoneVer}
                            ]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          allow-clear
                          max="11"
                          len="11"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <!-- 「VIN」输入 -->
                      <a-form-item
                        self-update
                      >
                        <template #label>
                          {{ $t('issue.vinNo') }}
                          <span class="form-item-label-desc">{{ $t('issue.vin_lable') }}</span>
                        </template>
                        <v-input
                          v-decorator="[
                            'vinNo',
                            {rules: [{
                              required: validVinOrlicense, message:$t('search.please_input')
                            },{validator: vinVer}]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          allow-clear
                          @change="changeVinNoRequired"
                        />
                      </a-form-item>
                    </a-col>

                    <a-col :span="6">
                      <!-- 「license」输入 -->
                      <a-form-item
                        self-update
                      >
                        <template #label>
                          {{ $t('issue.license') }}
                          <span class="form-item-label-desc">{{ $t('issue.license_lable') }}</span>
                        </template>
                        <v-input
                          v-decorator="[
                            'license',
                            {rules: [{
                              required: validVinOrlicense, message:$t('search.please_input')
                            }]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          allow-clear
                          maxlength="20"
                          @change="changeLicenseRequired"
                        />
                      </a-form-item>
                    </a-col>
                    <!-- 「问题描述」输入 -->
                    <a-col :span="6">
                      <a-form-item
                        :label="$t('issue.description')"
                        class="form-item-flex-2"
                        self-update
                      >
                        <v-textarea
                          v-decorator="[
                            'description',
                            {rules: [{
                              required: valiRequire, message: $t('search.please_input')
                            }]}
                          ]"
                          :placeholder="$t('search.please_input')"
                          :limit="1000"
                          allow-clear
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <!-- 「附件」上传 -->
                      <a-form-item>
                        <template #label>
                          {{ $t('issue_workflow.attachment') }}
                          <span class="form-item-label-desc">
                            {{ $t('issue_workflow.attachment_limit') }}
                          </span>
                        </template>
                        <a-upload
                          :headers="headers"
                          :multiple="true"
                          :file-list="fileList"
                          :before-upload="beforeUpload"
                          :remove="file => removeFile(record.fileList)(file)"
                          :action="uploadUrl"
                          name="file"
                          @preview="download"
                          @change="info => changeFileList(record.fileList, fileList)(info)"
                        >
                          <a-button icon="upload">
                            <!-- 「上传文件」文本 -->
                            {{ $t('issue_action.upload') }}
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-col>
                  </a-row>
                <!-- </div> -->
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              class="collapse-title"
              @click="SuppelyOpen"
            >
              <a-icon
                :type="SuppelyIcon"
                style="margin-right:4px"
              />
              <!-- 补充信息 -->
              {{ $t('issue.additionalInfo') }}
            </div>
            <div :class="supplyContent">
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「祸首件」下拉 -->
                  <a-form-item :label="$t('issue.firstCausePart')">
                    <net-select
                      v-decorator="[
                        'firstCausePart',
                      ]"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOptionPart"
                      allow-clear
                      :query="{id: '${value}', name: '${search}' , orderField: 'name'}"
                      :cache="false"
                      url="/masterdata/v1/part"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <!-- <a-col :span="6"> -->
                <!-- 「零件号」下拉 -->
                <!-- <a-form-item :label="$t('issue.partId')">
                    <net-select
                      v-decorator="[
                        'firstCausePart',
                      ]"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOptionId"
                      allow-clear
                      :query="{id: '${value}', code: '${search}', orderField: 'code'}"
                      :cache="false"
                      url="/masterdata/v1/part"
                    ></net-select>
                  </a-form-item>
                </a-col> -->
                <a-col :span="6">
                  <!-- 「供应商名称」下拉 -->
                  <a-form-item
                    :label="$t('issue.supplierId')"
                    self-update
                  >
                    <net-select
                      v-decorator="[
                        'supplierId',
                      ]"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOption"
                      allow-clear
                      url="/masterdata/v1/supplier"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「生产时间」时间日期 -->
                  <a-form-item
                    :label="$t('issue.productDate')"
                    self-update
                  >
                    <a-date-picker
                      v-decorator="[
                        'productDate'
                      ]"
                      :placeholder="$t('search.please_select')"
                      :format="GLOBAL_SELECT_DATE_FORMAT"
                      :disabled-date="disabledDate"
                      style="width:261px;"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「试验类型」下拉-->
                  <a-form-item
                    :label="$t('issue.testType')"
                    self-update
                  >
                    <net-select
                      v-decorator="[
                        'testType',
                      ]"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOptiondict"
                      allow-clear
                      url="/sys/dict?dictType=issue_test_type"
                    ></net-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <!-- <a-col :span="6"> -->
                <!-- 「试验类型」下拉-->
                <!-- <a-form-item
                    :label="$t('issue.testType')"
                    self-update
                  >
                    <net-select
                      v-decorator="[
                        'testType',
                      ]"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOptiondict"
                      allow-clear
                      url="/sys/dict?dictType=issue_test_type"
                    ></net-select>
                  </a-form-item>
                </a-col> -->
                <a-col :span="6">
                  <!-- 「故障里程」输入 -->
                  <a-form-item
                    :label="$t('issue.milage') + '(Km)'"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'milage',
                        {rules: [{validator: milageVer}]}
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「维修网点」输入 -->
                  <a-form-item
                    :label="$t('issue.maintenanceStation')"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'maintenanceStation',
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「软件版本号」输入 -->
                  <a-form-item
                    :label="$t('issue.softwareVersion')"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'softwareVersion',
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「标定版本号」输入 -->
                  <a-form-item
                    :label="$t('issue.calibrationVersion')"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'calibrationVersion',
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「硬件版本号」输入 -->
                  <a-form-item
                    :label="$t('issue.hardwareVersion')"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'hardwareVersion',
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「配置字版本号」输入 -->
                  <a-form-item
                    :label="$t('issue.confirmationVersion')"
                    self-update
                  >
                    <v-input
                      v-decorator="[
                        'confirmationVersion',
                      ]"
                      :placeholder="$t('search.please_input')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「工况信息」输入 -->
                  <a-form-item
                    :label="$t('issue.workConditionInfo')"
                    self-update
                  >
                    <v-textarea
                      v-decorator="[
                        'workConditionInfo'
                      ]"
                      :placeholder="$t('search.please_input')"
                      :limit="1000"
                      allow-clear
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「初步排查情况」输入 -->
                  <a-form-item
                    :label="$t('issue.preliminaryInvestigation')"
                    self-update
                  >
                    <v-textarea
                      v-decorator="[
                        'preliminaryInvestigation',
                      ]"
                      :placeholder="$t('search.please_input')"
                      :limit="1000"
                      allow-clear
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「备注」输入 -->
                  <a-form-item
                    :label="$t('issue.remark')"
                    self-update
                  >
                    <v-textarea
                      v-decorator="[
                        'remark',
                      ]"
                      :placeholder="$t('search.please_input')"
                      :limit="1000"
                      allow-clear
                    ></v-textarea>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>
<script>
import {
  createFormFields,
  autoUpdateFileds,
} from '@util/formhelper.js';

import {
  createNamespacedHelpers,
} from 'vuex';
import moment from 'moment';
import { transform, treeTransform } from '@util/datahelper.js';
import timeFormatMix from '~~/time-format.js';
import attachmentMix from '~~/issue-attachment.js';
import { toggleForbidScrollThrough, disableScroll, enableScroll } from '~~/scroll.js';


const {
  mapActions,
} = createNamespacedHelpers('question');

export default {
  name: 'QuestionCreate',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue'),
    VInput: () => import('@comp/form/VInput.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
    PreventButton: () => import('@comp/button/PreventButton.vue'),
  },
  mixins: [attachmentMix, timeFormatMix],
  props: {
    name: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
  },
  data () {
    const {
      $store,
    } = this;
    return {
      // 必填开关
      valiRequire: true,
      validVinOrlicense: true,
      // VIN和车牌号选填

      // 上传地址
      uploadUrl: $store.getters.getUrl('/issue/v1/file/upload?recType=10021003'),
      businessKey: null,
      businessTitle: '',
      sourceName: '',
      fileList: [], // 上传附件列表回显
      dataFileList: [], // 存储到数据库的列表
      BaseContent: '',
      visibleSubmit: false, // 提交弹框是否显示标识
      supplyContent: 'ContentDiv',
      DetailBase: true, // 基本信息是否展开标识
      DetailSuppely: false, // 补充信息是否展开标识
      BaseIcon: 'down',
      SuppelyIcon: 'down',
      questionTitle: '',
      optCounter: '',
      expand: false,
      delBtn: false,
      visibleDelete: false,
      form: null,
      functionUrl: '', // 所属功能请求地址
      actiive: '',
      detailList: [], // 编辑显示
      submitBtn: false, // 是否显示提交按钮
      titleFlag: false, // 问题标题是否显示
      carTitle: '', // 车型标题
      faultTreeIds2Title: '', // 功能标题，
      statusCode: '', // 当前状态码
      codeTitle: '', // 故障代码标题
      coChair: null,
      monitor: null,
      advanceUserDisabled: false,
      sourceDisabled: false,
      resdeptDisabled: false,
      smt: '', // 模块
      responsibleUserId: '', // 问题管理负责人
      advanceDeptId: '', // 提出人部门
      advanceUserId: '', // 提出人
      procDefKey: 'IRS2',
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
      // 数据模板
      record: {
        fileList: [],
        faultTreeIds1: '', // 所属系统
        faultTreeIds2: '', // 所属功能
        faultTreeIds3: '', // 故障代码
        grade: '', // 严重等级
        source: '', // 问题分类
        vehicleModelId: '', // 车型
        projectPhase: '', // 问题阶段
        manufactureBaseId: '', // 生产基地
        failureDate: '', // 故障发生日期
        frequency: '', // 问题频次
        responsibleDepartmentId: '', // 责任部门
        description: '', // 问题描述
        file: '', // 文件上传
        contact: '', // 问题相关人员联系方式
        smt: '', // 模块
        responsibleUserId: '', // 问题管理负责人
        advanceDeptId: '', // 提出人部门
        advanceUserId: '', // 提出人
        /**
           * 补充信息
           */
        testType: '', // 试验类型
        firstCausePart: '', // 祸首件
        partId: '', // 零件号
        supplierId: '', // 供应商名称
        softwareVersion: '', // 软件版本号
        calibrationVersion: '', // 标定版本号
        hardwareVersion: '', // 硬件版本号
        confirmationVersion: '', // 配置字版本号
        vinNo: '', // Vin
        license: '',
        productDate: '', // 生产时间
        maintenanceStation: '', // 维修网点
        milage: '',
        remark: '',
        workConditionInfo: '', // 工况信息
        processInstanceId: '', // 实例ID
      },
    };
  },
  computed: {
    isEdit () {
      return this.name !== 'create';
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
      'getQuestionPage',
      'eidtQuestion',
      'eidtQuestionAdd',
      'addActIdMembership',
      'addActIdMembershipToAct',
      'getUserByPositionCode',
      'getUserByworkflowPositionCode',
      'getActIdMembership',
      'saveQuestion',
      'editSaveQuestion',
      'workFlowSubmit',
      'workFlowSubmitNew',
      'getSysUser',
      'delIssue',
    ]),
    // 初始化
    init () {
      const vm = this;
      vm.$set(vm, 'record', { fileList: [] });
      vm.form = vm.$form.createForm(vm, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: autoUpdateFileds(vm, 'record'),
      });
      vm.form.resetFields();
      if (vm.name === 'create') {
        vm.questionTitle = vm.$t('issue_action.create');
        vm.submitBtn = true;
        vm.actiive = 'saveBtn';
        // 初始化工作流角色
        vm.record.advanceDeptId = this.$store.getters.getUser().deptId;
        console.log(vm.record.advanceDeptId, 99001122);
        vm.eidtQuestionAdd(vm.record.advanceDeptId).then((res) => {
          vm.record.advanceDeptId = res;
          vm.form.updateFields(vm.mapPropsToFields());
        });
        vm.record.advanceUserId = this.$store.getters.getUser().id;
        this.worlkChampionOrProposer(this.$store.getters.getUser().id, 'advanceUser');
        vm.form.updateFields(vm.mapPropsToFields());
      } else if (vm.name === 'edit') {
        vm.questionTitle = vm.$t('issue_action.edit_issue');
        vm.submitBtn = false;
        vm.actiive = 'activeClass';

        vm.eidtQuestion(vm.id).then((res) => {
          if (res.procDefKey) {
            this.procDefKey = res.procDefKey;
          }
          vm.record = res;
          this.validVinOrlicense = !res.vinNo && !res.license;
          vm.statusCode = res.status;
          const status = Number(this.statusCode);
          if (vm.statusCode === '100100') {
            vm.delBtn = true;
            vm.submitBtn = true;
          } else if (status >= 100105 && status != 100300 && status != 100108) {
            vm.advanceUserDisabled = true;
            vm.sourceDisabled = status >= 100200;
            vm.resdeptDisabled = !(status < 300100);
          } else {
            vm.submitBtn = false;
          }
          // 附件
          // const fileListArray = [];

          // vm.dataFileList = res.fileList;
          // res.fileList.forEach((item) => {
          //   const fileObject = {
          //     id: item.id,
          //     uid: item.id,
          //     name: item.originalFilename,
          //     url: item.path,
          //     status: 'done'
          //   };
          //   fileListArray.push(fileObject);
          // });
          vm.fileList = (res.fileList || []).map(vm.file2client);
          // vm.dataFileList = fileListArray;
          vm.optCounter = res.optCounter;
          // 日期格式回显
          if (res.failureDate) {
            const failureDate = moment(res.failureDate);
            vm.record.failureDate = failureDate;
          }
          if (res.productDate) {
            const productDate = moment(res.productDate);
            vm.record.productDate = productDate;
          }

          vm.form.updateFields(vm.mapPropsToFields());
          vm.carTitle = vm.record.vehicleModelName; // 车型标题
          vm.faultTreeIds2Title = vm.record.faultTreeIds2Name; // 功能标题，
          vm.codeTitle = vm.record.faultTreeIds3Name; // 故障代码标题

          // 初始化工作流角色人员
          const transData = {
            procDefKey: this.procDefKey,
            businessKey: vm.id,
          };
          vm.getActIdMembership(transData).then((ress) => {
            if (ress && Object.keys(ress).length > 0) {
              for (const item in ress) {
                vm.workflowRoles[item] = ress[item];
              }
            }
            if (res.creator) {
              this.workflowRoleChange(res.creator, 'createUser');
            }
            if (res.advanceUserId) {
              this.worlkChampionOrProposer(res.advanceUserId, 'advanceUser');
            }
          });
        });
      }
    },
    // 验证VIN
    vinVer (rule, value, callback) {
      const myreg = /^[A-Z0-9]{8,17}$/;
      if (value && !myreg.test(value)) {
        callback(new Error(this.$t('issue_workflow.D5.vinVer')));
      } else {
        callback();
      }
    },
    // 验证故障里程
    milageVer (rule, value, callback) {
      const myreg = /^\+?[1-9][0-9]*$/;
      if (value && !myreg.test(value)) {
        callback(new Error(this.$t('issue.milageVer')));
      } else {
        callback();
      }
    },
    // 问题频次整数校验
    // intVer (rule, value, callback) {
    //   var myreg = /^[1-9]\d*$/;
    //   if (value && !myreg.test(value)) {
    //     callback(new Error('请输入整数'));
    //   } else {
    //     callback();
    //   }
    // },
    // 禁用未开始的日期
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    // 验证手机号
    phoneVer (rule, value, callback) {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value && !myreg.test(value)) {
        callback(new Error(this.$t('issue.phoneVer')));
      } else {
        callback();
      }
    },
    selectOptionSingn (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.code,
          label: item.name,
        });
      });

      return optionArray;
    },
    handleSource (value) {
      this.record.responsibleUserId = void 0;
      this.sourceName = value;
      this.form.updateFields(this.mapPropsToFields());
    },
    handleResponsibleUserId () {
      this.record.responsibleUserId = void 0;
      this.form.updateFields(this.mapPropsToFields());
    },

    handleDelete () {
      toggleForbidScrollThrough(true);
      this.visibleDelete = true;
    },
    // 删除弹框确认按钮
    deleteOk () {
      toggleForbidScrollThrough(false);
      this.visibleDelete = false;
      this.handleDeleteFunction();
      enableScroll();
    },
    // 删除弹框取消按钮
    deleteCancel () {
      toggleForbidScrollThrough(false);
      this.visibleDelete = false;
      enableScroll();
    },
    handleDeleteFunction () {
      const vm = this;
      vm.delFlag = 1;
      const param = { id: vm.id, optCounter: vm.optCounter, delFlag: vm.delFlag };
      vm.delIssue(param).then(() => {
        this.$message.success(this.$t('delete.success'));
        this.goBack();
      }).catch(() => {
        this.$message.error(this.$t('delete.failure'));
        this.goBack();
      });
    },
    // 基本信息是否展开
    BaseOpen () {
      if (this.DetailBase) {
        this.DetailBase = false;
        this.BaseContent = 'BaseContent';
        this.BaseIcon = 'right';
      } else {
        this.DetailBase = true;
        this.BaseIcon = 'down';
        this.BaseContent = 'ContentDiv';
      }
    },
    SuppelyOpen () {
      if (this.DetailSuppely) {
        this.supplyContent = 'ContentDiv';
        this.SuppelyIcon = 'down';
        this.DetailSuppely = false;
      } else {
        this.SuppelyIcon = 'right';
        this.supplyContent = 'supplyContent';
        this.DetailSuppely = true;
      }
    },
    /**
     * 车型数据转换
     */
    vehicleModelTreeTransform: treeTransform(transform({
      value: 'id', label: 'psNameZh', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    deptTreeTransform: treeTransform(transform({
      value: 'ID', label: 'NAME', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    responseDeptTreeTransform: treeTransform(transform({
      value: 'code', label: 'name', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
    // 下拉转换函数
    selectOption (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.name,
        });
      });
      return optionArray;
    },
    // 祸首件下拉转换函数
    selectOptionPart (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: `${item.code} ${item.name}`,
        });
      });
      return optionArray;
    },
    selectOptionFaultTree (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.psNameZh,
        });
      });
      return optionArray;
    },
    selectOptionFaultTree3 (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.faultNameZh,
        });
      });
      return optionArray;
    },
    // 零件号下拉框
    selectOptionId (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.code,
        });
      });

      return optionArray;
    },
    // 用户下拉框
    userOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.realName,
        });
      });

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

    selectOptionBase (input) {
      const optionArray = [];

      input.forEach((item) => {
        // optionArray.push({
        //   value: item.id,
        //   label: item.nameZh + ' ' + item.nameEn
        // });
        optionArray.push({
          value: item.dictValue,
          label: item.dictName,
        });
      });
      return optionArray;
    },
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
    // 所属系统选择
    handleSystem (value) {
      this.record.faultTreeIds1 = value;
      this.record.faultTreeIds2 = '';
      this.form.updateFields(this.mapPropsToFields());
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    goBack () {
      this.form.resetFields();
      this.$router.push({
        path: this.$route.query.form || '/',
      });
    },
    // 车型选择
    vehicleModelIdChange (value, label) {
      this.carTitle = label;
      this.record.responsibleUserId = '';
      this.form.updateFields(this.mapPropsToFields());
    },
    // 所属功能选择
    faultTreeIds2Change (value, option) {
      if (option !== undefined) {
        if (option.componentOptions !== undefined) {
          if (option.componentOptions.children[0].text !== undefined) {
            this.faultTreeIds2Title = option.componentOptions.children[0].text;
          }
        }
      }
      this.record.faultTreeIds3 = '';
      this.form.updateFields(this.mapPropsToFields());
    },
    faultTreeIds3Change (value, option) {
      if (option !== undefined) {
        if (option.componentOptions !== undefined) {
          if (option.componentOptions.children[0].text !== undefined) {
            this.codeTitle = option.componentOptions.children[0].text;
          }
        }
      }
    },
    /**
     * 提出人部门下拉
     */
    userDeptChange () {
      this.record.advanceUserId = void 0;
      this.form.updateFields(this.mapPropsToFields());
    },
    // 提交弹框点击取消
    submitCancel () {
      toggleForbidScrollThrough(false);
      this.visibleSubmit = false;
      const { commitButton } = this.$refs;
      commitButton.reset();
    },
    //  提交弹框点击确定
    submitOk () {
      toggleForbidScrollThrough(false);
      this.visibleSubmit = false;
      const { commitButton } = this.$refs;
      const hide = this.$message.loading(this.$t('issue_workflow.submitIng'), 0);
      const data = this.form.getFieldsValue();
      if (data.milage === undefined) {
        data.milage = '';
      }
      data.fileList = this.record.fileList;
      const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
      data.faultTreeIds = tree;
      const title2 = this.faultTreeIds2Title || '';
      const title3 = this.codeTitle || '';

      const fault2 = title2 ? `-${title2}` : '';
      const fault3 = title3 ? `-${title3}` : '';
      const title = this.carTitle + fault2 + fault3;
      data.procDefKey = this.procDefKey;
      data.title = title;
      this.businessTitle = title;
      // 表单提交增加comment 2019/12/6
      data.comment = '';
      // 日期格式化
      if (data.failureDate) {
        const failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
        data.failureDate = failureDate;
      }
      if (data.productDate) {
        const productDate = data.productDate.format('YYYY-MM-DD HH:mm:ss');
        data.productDate = productDate;
      }

      const { id } = this.$store.getters.getUser();
      const vm = this;
      // const param1 = {
      //   issueSource: data.source,
      //   type: 'coChair'
      // };
      // const param2 = {
      //   issueSource: data.source,
      //   type: 'monitor'
      // };
      // const cocharFunction = vm.getSysUser(param1).then(res => {
      //   vm.coChair = vm.coChair ? vm.coChair : res.id;
      //   return vm.coChair;
      // });
      // const monitorFunction = vm.getSysUser(param2).then(res => {
      //   vm.monitor = vm.monitor ? vm.monitor : res.id;
      //   return vm.monitor;
      // });
      // vm.coChair = vm.coChair ? vm.coChair : cocharId;
      // vm.monitor = vm.monitor ? vm.monitor : monitorId;
      if (this.businessKey) {
        data.id = this.id;
        data.optCounter = this.optCounter;
        // Promise.all([cocharFunction, monitorFunction]).then((result) => {
        this.editSaveQuestion(data).then((res) => {
          this.businessKey = res.id;
          this.optCounter = res.optCounter;
          const param = {
            businessKey: this.businessKey,
            businessTitle: this.businessTitle,
            processDefinitionKey: this.procDefKey,
            operationCode: '001',
            subSys: 'irs',
            taskId: null,
            userId: id,
            advanceSelectorSkip: '1',
            comment: '',
            variables: {
              issc: '0',
              businessKey: this.businessKey,
              assigner: vm.monitor,
              comment: '',
            },
          };
            // 保存任务角色
          for (const item in this.workflowRoles) {
            param.variables[item] = this.workflowRoles[item];
            this.workflowRolesList.push({
              groupId: item, userId: this.workflowRoles[item], procInstId: res.processInstanceId, procDefKey: this.procDefKey, businessKey: res.id,
            });
          }
          this.addActIdMembershipToAct(this.workflowRolesList).then(() => {
            this.addActIdMembership(this.workflowRolesList).then((roleResult) => {
              for (const item in roleResult) {
                param.variables[item] = roleResult[item];
              }
              if (param.processDefinitionKey !== 'IRS2') {
                this.workFlowSubmit(param).then((res2) => {
                  if (res2) {
                    setTimeout(() => {
                      hide();
                      this.$message.success(this.$t('issue_workflow.submitSuccess'), 1).then(() => {
                        commitButton.reset();
                        this.$router.push({
                          path: this.$route.query.form || '/',
                        });
                      });
                    }, 200);
                  }
                });
              } else {
                this.workFlowSubmitNew(param).then((res2) => {
                  if (res2) {
                    setTimeout(() => {
                      hide();
                      this.$message.success(this.$t('issue_workflow.submitSuccess'), 1).then(() => {
                        commitButton.reset();
                        this.$router.push({
                          path: this.$route.query.form || '/',
                        });
                      });
                    }, 200);
                  }
                });
              }
            });
          });
        });
        // });
      } else {
        data.id = this.id;
        data.optCounter = this.optCounter;
        // Promise.all([cocharFunction, monitorFunction]).then((result) => {
        this.saveQuestion(data).then((res) => {
          this.workflowRoleChange(this.$store.getters.getUser().id, 'createUser');
          this.businessKey = res.id;
          const param = {
            businessKey: this.businessKey,
            businessTitle: this.businessTitle,
            processDefinitionKey: this.procDefKey,
            subSys: 'irs',
            taskId: null,
            userId: id,
            comment: '',
            operationCode: '001',
            variables: {
              comment: '',
              // coChair: result[0],
              // monitor: result[1],
              issc: '0',
              advanceSelectorSkip: '1',
              businessKey: this.businessKey,
              assigner: vm.monitor,
            },
          };
            // 保存任务角色
          for (const item in this.workflowRoles) {
            param.variables[item] = this.workflowRoles[item];
            this.workflowRolesList.push({
              groupId: item, userId: this.workflowRoles[item], procInstId: res.processInstanceId, procDefKey: this.procDefKey, businessKey: res.id,
            });
          }
          this.addActIdMembershipToAct(this.workflowRolesList).then();
          this.addActIdMembership(this.workflowRolesList).then((roleResult) => {
            for (const item in roleResult) {
              param.variables[item] = roleResult[item];
            }
            if (param.processDefinitionKey !== 'IRS2') {
              this.workFlowSubmit(param).then((res2) => {
                if (res2) {
                  setTimeout(() => {
                    hide();
                    this.$message.success(this.$t('issue_workflow.submitSuccess'), 1).then(() => {
                      commitButton.reset();
                      this.$router.push({
                        path: this.$route.query.form || '/',
                      });
                    });
                  }, 200);
                }
              });
            } else {
              this.workFlowSubmitNew(param).then((res2) => {
                if (res2) {
                  setTimeout(() => {
                    hide();
                    this.$message.success(this.$t('issue_workflow.submitSuccess'), 1).then(() => {
                      commitButton.reset();
                      this.$router.push({
                        path: this.$route.query.form || '/',
                      });
                    });
                  }, 200);
                }
              });
            }
          });
        });
        // });
      }
      setTimeout(() => {
        hide();
      }, 200);
    },
    // 提交接口调用函数
    handleSubmit () {
      this.valiRequire = true;
      this.validVinOrlicense = !this.record.vinNo && !this.record.license;
      const { commitButton } = this.$refs;
      this.form.validateFields((err) => {
        if (!err) {
          this.visibleSubmit = true;
          toggleForbidScrollThrough(true);
        } else {
          commitButton.reset();
          this.visibleSubmit = false;
        }
      });
    },
    handleSave () {
      this.valiRequire = false;
      const { saveButton } = this.$refs;
      // this.$nextTick(() => {
      //   saveButton.reset();
      //   this.form.validateFields(Object.keys(this.form.getFieldsValue()), { force: true }, () => {});
      // });
      // 正在保存中...
      const hide = this.$message.loading(this.$t('issue_workflow.saveIng'), 0);
      const data = this.form.getFieldsValue();
      // 表单提交增加comment 2019/12/6
      data.comment = '';
      data.fileList = this.record.fileList;
      if (data.milage === undefined) {
        data.milage = '';
      }
      const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
      data.faultTreeIds = tree;
      const title2 = this.faultTreeIds2Title || '';
      const title3 = this.codeTitle || '';

      const fault2 = title2 ? `-${title2}` : '';
      const fault3 = title3 ? `-${title3}` : '';
      const title = this.carTitle + fault2 + fault3;

      data.title = title;
      // 日期格式化
      if (data.failureDate) {
        const failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
        data.failureDate = failureDate;
      }
      if (data.productDate) {
        const productDate = data.productDate.format('YYYY-MM-DD HH:mm:ss');
        data.productDate = productDate;
      }
      // 将问题保存成IRS2
      data.procDefKey = this.procDefKey;
      if (this.name === 'create') {
        if (this.businessKey) {
          data.id = this.id;
          data.optCounter = this.optCounter;
          this.editSaveQuestion(data).then((res) => {
            this.businessKey = res.id;
            this.optCounter = res.optCounter;
            this.handelActRoles(res);
            setTimeout(() => {
              hide();
              this.$message.success(this.$t('issue_workflow.saveSuccess'), 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/',
                });
              });
            }, 100);
          });
        } else {
          this.saveQuestion(data).then((res) => {
            this.businessKey = res.id;
            // 工作流角色创建人
            this.workflowRoleChange(this.$store.getters.getUser().id, 'createUser');
            this.handelActRoles(res);
            setTimeout(() => {
              hide();
              this.$message.success(this.$t('issue_workflow.saveSuccess'), 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/',
                });
              });
            }, 100);
          });
        }
      } else if (this.name === 'edit') {
        for (const i in data) {
          if (data[i] === void 0) {
            data[i] = null;
          }
        }
        data.id = this.id;
        data.optCounter = this.optCounter;
        const status = Number(this.statusCode);
        // 如果进入工作流保存做必填项校验
        if (status > 100100) {
          this.valiRequire = true;
          this.form.validateFields((err) => {
            if (!err) {
              this.editSaveQuestion(data).then((res) => {
                this.businessKey = res.id;
                this.optCounter = res.optCounter;
                this.handelActRoles(res);
                setTimeout(() => {
                  hide();
                  this.$message.success(this.$t('issue_workflow.saveSuccess'), 1).then(() => {
                    saveButton.reset();
                    this.$router.push({
                      path: this.$route.query.form || '/',
                    });
                  });
                }, 100);
              });
            } else {
              setTimeout(() => {
                hide();
                saveButton.reset();
              }, 100);
            }
          });
        } else {
          this.editSaveQuestion(data).then((res) => {
            this.handelActRoles(res);
            this.businessKey = res.id;
            this.optCounter = res.optCounter;
            setTimeout(() => {
              hide();
              this.$message.success(this.$t('issue_workflow.saveSuccess'), 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/',
                });
              });
            }, 100);
          });
        }
      }
      setTimeout(() => { hide(); }, 100);
    },
    // 保存工作流角色人物
    handelActRoles (res) {
      for (const item in this.workflowRoles) {
        this.workflowRolesList.push({
          groupId: item, userId: this.workflowRoles[item], procInstId: res.processInstanceId, procDefKey: this.procDefKey, businessKey: res.id,
        });
      }
      this.addActIdMembershipToAct(this.workflowRolesList).then();
      this.addActIdMembership(this.workflowRolesList).then((result) => {

      });
    },
    // 更换工作流角色人员
    workflowRoleChange (value, role) {
      this.workflowRoles[role] = value;
    },
    // 更新责任人或者提出人科长或者部长
    worlkChampionOrProposer (value, role) {
      this.workflowRoles[role] = value;
      if (role == 'advanceUser') {
        if (value) {
          this.getUserByPositionCodeFunction(value, 'sectorManager', 'advanceSelector');
        } else {
          this.workflowRoles.advanceSelector = '';
        }
      } else if (role == 'champion') {
        if (value) {
          this.getUserByworkFlowPositionCodeFunction(value, 'sectorManager', 'sectorManager');
          this.getUserByworkFlowPositionCodeFunction(value, 'director', 'director');
        } else {
          this.workflowRoles.sectorManager = '';
          this.workflowRoles.director = '';
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
    getUserByworkFlowPositionCodeFunction (value, positionCode, role) {
      const parmas = {
        userId: value,
        positionCode,
      };
      this.getUserByworkflowPositionCode(parmas).then((res) => {
        if (res[0]) {
          this.workflowRoles[role] = res[0].id;
        } else {
          this.workflowRoles[role] = void 0;
        }
      });
    },
    // 查看来源模块详情
    moduleSourceDetail () {
      if (this.record.moduleSource === 'ASQ') {
        window.open(`/aqs/issue/definition-list/report/${this.record.moduleSourceId}`);
      }
    },

    handleSearch (e) {
      e.preventDefault();
    },
    gradeChange () {

    },
    handleReset () {
      this.$router.push({
        path: this.$route.query.form || '/',
      });
    },
    // VIN 车号 输入后改变验证规则，实现动态验证
    changeVinNoRequired (e) {
      console.log(e.target.value, this.record.license);
      this.validVinOrlicense = !e.target.value && !this.record.license;
      this.$nextTick(() => {
        this.form.validateFields(['license'], { force: true });
      });
    },
    changeLicenseRequired (e) {
      console.log(e.target.value, this.record.vinNo);
      this.validVinOrlicense = !e.target.value && !this.record.vinNo;
      this.$nextTick(() => {
        this.form.validateFields(['vinNo'], { force: true });
      });
    },
    toggle () {
      this.expand = !this.expand;
    },
    /**
       * 映射表单组件到模型字段
       */
    mapPropsToFields () {
      return createFormFields(this, [
        'faultTreeIds1', 'faultTreeIds2', 'faultTreeIds3', 'grade', 'source', 'vehicleModelId',
        'projectPhase',
        'manufactureBaseId', 'failureDate', 'frequency', 'responsibleDepartmentId', 'advanceUserId', 'responsibleUserId', 'smt',
        'advanceDeptId', 'description', 'file',
        'contact', 'testType',
        'firstCausePart', 'partId', 'supplierId', 'softwareVersion', 'calibrationVersion',
        'hardwareVersion', 'confirmationVersion', 'vinNo', 'license', 'productDate', 'maintenanceStation', 'milage',
        'remark', 'workConditionInfo', 'preliminaryInvestigation',
      ], 'record');
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .ant-layout-content {
    overflow-y: hidden;
  }

  /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, .45);
    font-size: 12px;
  }

 /deep/.ant-card-wider-padding {
    .ant-card-body {
      padding-bottom: 25px;
    }
  }
  #components-form-demo-advanced-search {
    overflow-y: hidden;
    .formConetnt{
      margin-bottom: 16px;
     }
    .BaseContent {
      height: 0;
      overflow: hidden;
    }

    .supplyContent {
      height: 0;
      overflow: hidden;
    }

    .ContentDiv {
      height: auto !important;
      margin-left: 32px;
    }

    .collapse-title {
      margin-left: 6px;
      margin-bottom: 16px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      cursor: pointer;
    }

    .activeClass {
      font-size: 14px;
      color: #FFFFFF;
      text-align: left;
      line-height: 22px;
      background: #0097E0;
      border-radius: 4px;
    }

    .pageTitle {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      border-radius: 4px;
      width: 1125px;
      height: 40px;
      line-height: 40px;
      margin-top: 16px;
      margin-bottom: 24px;
      margin-left:16px;
      padding-left: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;

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

    .uploadText {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      width: 290px;
      margin-left: 74px;
      margin-top: -22px;
    }

    .submitBtn {
      font-size: 14px;
      color: #FFFFFF;
      text-align: left;
      line-height: 22px;
      background: #0097E0;
      border-radius: 4px;
      border-radius: 4px;
    }

    .saveBtn,
    .cancelBtn {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      text-align: left;
      line-height: 22px;
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      border-radius: 4px;
    }
    .editBtn {
      margin-left: 10px;
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

  /deep/.ant-card-head-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }

  .questionTitle {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin: 23px auto;

    em {
      background: #0097E0;
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
    left: 0px!important;
    width: 100%!important;
    // background: rgba(0, 0, 0, 0.6); rgba(0,0,0, 0.04)
    // box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
    background: #F5F5F5;
    .top-buttons {
      width: 1200px!important;
      margin: 0 auto!important;
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

  .ant-advanced-search-form {
    padding: 24px;
    border-radius: 6px;
    margin-top: -40px;
    margin-left: -40px;
    margin-bottom:-40px;
  }

  #components-form-demo-advanced-search {
    /deep/ .ant-form {
      max-width: none;
    }
   /deep/ .ant-form-item-label {
     line-height:22px;
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
  }
</style>
<style lang="less">

</style>
