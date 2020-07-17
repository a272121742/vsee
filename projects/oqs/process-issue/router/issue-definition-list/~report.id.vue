<template>
  <div class="issue-box">
    <div class="box mgt-0">
      <a-form-model
        ref="form"
        :model="record"
        layout="vertical"
      >
        <!-- 基本信息 ----------------------------------->
        <div class="basic-info">
          <div class="collapse-title">
            {{ $t('report.basicInfo') }}
          </div>
          <div class="basic-content">
            <div class="page-title">
              <a-row>
                <!-- 「问题标题」文本 -->
                <a-col :span="2">
                  <span>
                    {{ $t('report.issueTitle') }}：
                  </span>
                </a-col>
                <!-- 车型名称 -->
                <a-col
                  v-if="carTitle"
                  :span="4"
                  style="margin-left: -20px; margin-top: 4px;"
                >
                  <a-form-model-item prop="carTitleInput">
                    <a-input
                      v-model="record.carTitleInput"
                      placeholder=""
                      disabled
                    />
                  </a-form-model-item>
                </a-col>
                <!-- 短横杠 -->
                <a-col
                  v-if="carTitle"
                  :span="1"
                  style="width:20px;margin:auto 12px auto 5px;"
                >
                  <a-icon type="minus" />
                </a-col>

                <!-- 问题标题描述 -->
                <a-col
                  :span="10"
                  style="margin-top: 4px;"
                >
                  <a-form-model-item
                    prop="titleExpand"
                    :rules="[$v.maxLen(20, $t('report.max20'))]"
                  >
                    <a-input
                      v-model="record.titleExpand"
                      :placeholder="$t('report.issueInfo')"
                      allow-clear
                      style="width:460px;margin-left:-16px;"
                      :max-lenght="20"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 提示信息 -->
                <a-col
                  :span="3"
                  style="margin-left:8px; margin-top: 10px;"
                >
                  <a-form-item>
                    <span style="color: rgba(0, 0, 0, 0.45);">{{ $t('report.less_then_20') }}</span>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div style="margin-left: 16px;">
              <a-row :gutter="24">
                <!-- 车型名称 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="vehicleModelId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.vhclName')"
                  >
                    <net-single-tree-select
                      v-model="record.vehicleModelId"
                      :get-popup-container="trigger => trigger.parentNode"
                      :placeholder="$t('form.select')"
                      url="/masterdata/v1/vehicleproject/treeAll"
                      allow-clear
                      :transform="vehicleModelTreeTransform"
                      @change="vehicleModelIdChange"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 所属系统 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="pfsSysId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.pfsSysId')"
                  >
                    <single-net-select
                      v-model="record['pfsSysId']"
                      :placeholder="$t('form.select')"
                      url="/masterdata/v1/pfscategory?p_id=0"
                      value-by="id"
                      label-of="name"
                      search-by="name"
                      allow-clear
                      @change="changeSystem"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 所属功能 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="pfsFunId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.pfsFunId')"
                  >
                    <single-net-select
                      v-model="record.pfsFunId"
                      :placeholder="$t('form.select')"
                      :url="`/masterdata/v1/pfscategory?p_id=${record.pfsSysId}`"
                      :delay="!record.pfsSysId"
                      :disabled="!record.pfsSysId"
                      :cache="false"
                      value-by="id"
                      label-of="name"
                      allow-clear
                      @change="changeFeatures"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 故障代码 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="pfsFaultId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.pfsFaultId')"
                  >
                    <single-net-select
                      v-model="record.pfsFaultId"
                      :placeholder="$t('form.select')"
                      :url="`/masterdata/v1/pfsfault?psId=${record.pfsFunId}`"
                      :disabled="!record.pfsFunId"
                      :delay="!record.pfsFunId"
                      :cache="false"
                      value-by="id"
                      label-of="name"
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题分类 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="issueSource"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.issueSource')"
                  >
                    <single-net-select
                      v-model="record.issueSource"
                      :placeholder="$t('form.select')"
                      url="/sys/dict?dictType=issue_source"
                      value-by="dictValue"
                      label-of="dictName"
                      show-search
                      allow-clear
                      @change="handleChange"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 模块 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="smt"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.smt')"
                  >
                    <single-net-select
                      v-model="record.smt"
                      :placeholder="$t('form.select')"
                      url="/sys/dict?dictType=smt"
                      value-by="dictValue"
                      label-of="dictName"
                      show-search
                      allow-clear
                      @change="handleChange"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题严重等级 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="severityLevel"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.severityLevel')"
                  >
                    <single-net-select
                      v-model="record.severityLevel"
                      :placeholder="$t('form.select')"
                      url="/sys/dict?dictType=issue_grade"
                      value-by="dictValue"
                      label-of="dictName"
                      show-search
                      allow-clear
                      @change="handleChange"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题管理负责人  -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="rspnsUserId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.rspnsUserId')"
                  >
                    <single-net-select
                      v-model="record.rspnsUserId"
                      :placeholder="$t('form.select')"
                      :url="`/issue/v1/workflow/getSysUser?productId=${record.vehicleModelId || '' }&irtCode=${record.issueSource || ''}&gradeCode=${record.severityLevel || ''}&irtModuleCode=${record.smt || ''}&irtRole=monitor`"
                      value-by="USERID"
                      label-of="USERNAMEZH"
                      show-search
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题阶段 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="projectPhase"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.projectPhase')"
                  >
                    <single-net-select
                      v-model="record.projectPhase"
                      :placeholder="$t('form.select')"
                      url="/sys/dict?dictType=issue_phase"
                      value-by="dictValue"
                      label-of="dictName"
                      show-search
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题发生日期 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="occurDate"
                    :label="$t('report.occurDate')"
                  >
                    <a-date-picker
                      v-model="record.occurDate"
                      :placeholder="$t('form.select')"
                      format="YYYY-MM-DD"
                      :disabled-date="disabledDate"
                      :get-calendar-container="e => e.parentNode"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 生产基地 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="manufactureBaseId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.manufactureBaseId')"
                  >
                    <single-net-select
                      v-model="record.manufactureBaseId"
                      :placeholder="$t('form.select')"
                      url="/sys/dict?dictType=plant"
                      value-by="dictValue"
                      label-of="dictName"
                      show-search
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 责任部门 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="rspnsDeptId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.rspnsDeptId')"
                  >
                    <net-single-tree-select
                      v-model="record.rspnsDeptId"
                      :get-popup-container="trigger => trigger.parentNode"
                      :placeholder="$t('form.select')"
                      url="/masterdata/v1/workflowgroupname/tree?typeCode=RESPONSIBLE_DEPARTMENT"
                      allow-clear
                      :transform="responseDeptTreeTransform"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题频次 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="occurFrq"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.occurFrq')"
                  >
                    <a-input
                      v-model="record.occurFrq"
                      :placeholder="$t('form.input')"
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题提出人部门 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="advDeptId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.advDeptId')"
                  >
                    <net-single-tree-select
                      v-model="record.advDeptId"
                      :placeholder="$t('form.select')"
                      :get-popup-container="trigger => trigger.parentNode"
                      :transform="deptTreeTransform"
                      allow-clear
                      url="/sys/dept/deptList/getDeptTreeTwo"
                      @change="userDeptChange"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题提出人 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="advUserId"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.advUserId')"
                  >
                    <single-net-select
                      v-model="record.advUserId"
                      :placeholder="$t('form.select')"
                      :url="`/sys/user/useList/getUsersByDeptPid?deptId=${record.advDeptId}`"
                      :disabled="!record.advDeptId"
                      :delay="!record.advDeptId"
                      value-by="id"
                      label-of="realName"
                      :cache="false"
                      show-search
                      allow-clear
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 提出人手机 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="advUserMobile"
                    :rules="[
                      $v.required($t('info.notBeBlank')),
                      $v.phone($t('info.phoneInfo')),
                    ]"
                    :label="$t('report.advUserMobile')"
                  >
                    <a-input
                      v-model="record.advUserMobile"
                      :placeholder="$t('form.input')"
                      self-update
                      allow-clear
                      max="11"
                      len="11"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- vin -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="vin"
                    :rules="[
                      isRequired? $v.required($t('info.notBeBlank')):'',
                      $v.vin('info.vinInfo')
                    ]"
                  >
                    <template #label>
                      {{ $t('report.vin') }}
                      <span class="form-item-label-desc">{{ $t('report.vin_lable') }}</span>
                    </template>
                    <a-input
                      v-model="record.vin"
                      :placeholder="$t('form.input')"
                      self-update
                      allow-clear
                      @change="changeVinNoRequired"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 车号 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="vhclNo"
                    :rules="[
                      isRequired? $v.required($t('info.notBeBlank')):''
                    ]"
                  >
                    <template #label>
                      {{ $t('report.vhclNo') }}
                      <span class="form-item-label-desc">{{ $t('report.license_lable') }}</span>
                    </template>
                    <a-input
                      v-model="record.vhclNo"
                      self-update
                      :placeholder="$t('form.input')"
                      allow-clear
                      @change="changeLicenseRequired"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 问题描述 -->
                <a-col :span="formItemSpan">
                  <a-form-model-item
                    prop="issueDesc"
                    :rules="[$v.required($t('info.notBeBlank'))]"
                    :label="$t('report.issueDesc')"
                  >
                    <v-textarea
                      v-model="record.issueDesc"
                      :placeholder="$t('form.input')"
                      allow-clear
                      :limit="1000"
                    />
                  </a-form-model-item>
                </a-col>

                <!-- 附件 -->
                <a-col :span="formItemSpan">
                  <!-- 附件上传 -->
                  <a-form-model-item
                    prop="files"
                    style="width: 100%"
                  >
                    <template #label>
                      {{ $t('report.files') }}
                      <span class="form-item-label-desc">
                        {{ $t('report.attachment_limit') }}
                      </span>
                    </template>
                    <v-upload
                      v-model="record.files"
                      :headers="headers"
                      :multiple="true"
                      :action="$store.getters.getUrl('/oqs/v1/oqsoss/upload?recType=40021002')"
                      download="/oss/ossFile/download"
                    >
                      <a-button icon="upload">
                        {{ $t('report.filesButton') }}
                      </a-button>
                    </v-upload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>

        <!-- 补充信息 ----------------------------------->
        <div class="add-info">
          <div
            class="collapse-title"
            @click="SuppelyOpen"
          >
            <a-icon
              :type="SuppelyIcon"
              style="margin-right:4px"
            />
            {{ $t('report.suppelyInfo') }}
          </div>
          <div :class="supplyContent">
            <a-row :gutter="24">
              <!-- 祸首件 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="firstCausePart"
                  :label="$t('report.firstCausePart')"
                >
                  <single-net-select
                    v-model="record.firstCausePart"
                    :placeholder="$t('form.select')"
                    url="/masterdata/v1/part/partList"
                    value-by="id"
                    label-of="name"
                    :query="{ }"
                    search-by="all"
                    allow-clear
                    :cache="false"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 供应商名称 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="supplierId"
                  :label="$t('report.supplierId')"
                >
                  <single-net-select
                    v-model="record.supplierId"
                    :placeholder="$t('form.select')"
                    url="/masterdata/v1/supplier"
                    value-by="id"
                    label-of="name"
                    show-search
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 生产时间 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="prodDate"
                  :label="$t('report.prodDate')"
                >
                  <a-date-picker
                    v-model="record.prodDate"
                    :placeholder="$t('form.select')"
                    format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    :get-calendar-container="e => e.parentNode"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 试验类型 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="testType"
                  :label="$t('report.testType')"
                >
                  <single-net-select
                    v-model="record.testType"
                    :placeholder="$t('form.select')"
                    url="/sys/dict?dictType=issue_test_type"
                    value-by="dictValue"
                    label-of="dictName"
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 故障里程 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="faultMilage"
                  :rules="[$v.milageVer('info.intNo')]"
                  :label="$t('report.faultMilage')"
                >
                  <a-input
                    v-model="record.faultMilage"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 维修网点 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="maintenanceStation"
                  :label="$t('report.maintenanceStation')"
                >
                  <a-input
                    v-model="record.maintenanceStation"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 软件版本号 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="softwareVers"
                  :label="$t('report.softwareVers')"
                >
                  <a-input
                    v-model="record.softwareVers"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 标定版本号 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="stdVers"
                  :label="$t('report.stdVers')"
                >
                  <a-input
                    v-model="record.stdVers"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 硬件版本号 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="hardwareVers"
                  :label="$t('report.hardwareVers')"
                >
                  <a-input
                    v-model="record.hardwareVers"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- 配置字版本号 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="paraVers"
                  :label="$t('report.paraVers')"
                >
                  <a-input
                    v-model="record.paraVers"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                  />
                </a-form-model-item>
              </a-col>

              <!-- Top问题 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  :label="$t('report.isTop')"
                >
                  <a-select
                    v-model="isTop"
                    :placeholder="$t('form.select')"
                    allow-clear
                    :get-popup-container="trigger => trigger.parentNode"
                  >
                    <a-select-option value="1">
                      {{ $t('report.yes') }}
                    </a-select-option>
                    <a-select-option value="0">
                      {{ $t('report.no') }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <!-- 跟踪日期 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="followDt"
                  :label="$t('report.followDt')"
                >
                  <a-date-picker
                    v-model="record.followDt"
                    :placeholder="$t('form.select')"
                    format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    :get-calendar-container="e => e.parentNode"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 工况信息 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="faultCndt"
                  :label="$t('report.faultCndt')"
                >
                  <v-textarea
                    v-model="record.faultCndt"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                    :limit="1000"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 初步排查情况 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="initialInvest"
                  :label="$t('report.initialInvest')"
                >
                  <v-textarea
                    v-model="record.initialInvest"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                    :limit="1000"
                  />
                </a-form-model-item>
              </a-col>

              <!-- 备注 -->
              <a-col :span="formItemSpan">
                <a-form-model-item
                  prop="remark"
                  :label="$t('report.remark')"
                >
                  <v-textarea
                    v-model="record.remark"
                    :placeholder="$t('form.input')"
                    self-update
                    allow-clear
                    :limit="1000"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form-model>
    </div>

    <!-- 保存 ------------------------------------------>
    <div class="operate-buttons">
      <!-- 保存 -->
      <a-button
        type="primary"
        :style="{ marginRight: '8px' }"
        html-type="submit"
        :loading="saveLoading"
        :disabled="saveBtn"
        @click="save('save')"
      >
        {{ $t('action.save') }}
      </a-button>
      <!-- 保存并立项 -->
      <a-button
        :loading="save2Loading"
        :disabled="save2Btn"
        type="primary"
        :style="{ marginRight: '8px' ,padding:'0'}"
        @click="save"
      >
        {{ $t('report.saveIRS') }}
      </a-button>
      <!-- 返回 -->
      <a-button
        v-if="isEdit"
        :disabled="saveBtn || save2Btn"
        @click="$router.push({ path: '/process-issue/issue-definition-list' })"
      >
        {{ $t('action.back') }}
      </a-button>
    </div>
  </div>
  </div>
</template>

<script>
import tableRowSelectionMix from '@mix/table-row-selection.js';
import storeModuleMix from '@mix/store-module.js';
import paginationMix from '@mix/pagination.js';
import formModelRecordMix, { map2Moment } from '@mix/form-model-record.js';
import { transform, treeTransform } from '@util/datahelper.js';
import attachmentMix from '@mix/attachment.js';
import { seq } from '@util/fnhelper.js';
import {
  GET_START_OF_DAY, GET_MOMENT, GET_END_OF_DAY,
} from '@util/datetime-helper.js';

const recordMapForm = seq(
  map2Moment('occurDate'),
  map2Moment('prodDate'),
  map2Moment('followDt'),
);
const recordMapTo = seq(
  (record) => {
    record.occurDate = GET_START_OF_DAY(record.occurDate);
    record.prodDate = GET_START_OF_DAY(record.prodDate);
    record.followDt = GET_START_OF_DAY(record.followDt);
  },
);

export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),

  },
  mixins: [
    formModelRecordMix({ map: recordMapForm }),
    paginationMix(),
    tableRowSelectionMix(),
    storeModuleMix({
      name: 'process-issue',
      action: ['postSaveReport', 'postSaveAndIrsR', 'eidtShowData', 'putSaveReport', 'putSaveAndIrsR'],
    }),
    attachmentMix,
  ],
  data () {
    return {
      saveBtn: false,
      save2Btn: false,
      save2Loading: false,
      saveLoading: false,
      carTitle: false, // 车型标题
      formItemSpan: 6,
      SuppelyIcon: 'down',
      supplyContent: 'ContentDiv',
      isTop: undefined,
      isRequired: true,
      isEdit: false,
      allData: {},
      editId: '',
    };
  },
  computed: {
  },
  created () {
  },
  activated () {
    this.fetch();
  },
  methods: {
    /**
     * 初始化渲染 回显
     */
    fetch () {
      const TRQ = JSON.parse(JSON.stringify(this.$route.query));
      if (this.$route.params.id === undefined) {
        this.carTitle = false;
        // 创建
        this.record.load({
          advDeptId: this.$store.getters.getUser().deptId,
          advUserId: this.$store.getters.getUser().id,
          severityLevel: TRQ.defect_level !== null ? TRQ.defect_level.toLowerCase() : null,
          projectPhase: 'sop',
          occurDate: TRQ.defect_input_time,
          occurFrq: +TRQ.occurFrq,
          vin: TRQ.vin,
        });
        this.isEdit = false;
        this.isRequired = this.record.vin === null;
        this.allData = { ...JSON.parse(TRQ.backData) };
      } else {
        // 编辑修改
        const { id } = this.$route.params;
        this.eidtShowData(id).then((res) => {
          this.record.load(res);
          this.isRequired = false;
          this.carTitle = true;
          this.editId = res.id;
          this.isTop = res.isTop;
          this.isEdit = true;
        });
      }
    },
    /**
     * 保存 保存并立项
     */
    save (type) {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const title = `${this.record.carTitleInput}-${this.record.titleExpand}`;
            const idList = (this.isEdit || this.$route.query.isAll === 'true') ? undefined : this.$route.query.idList;
            this.editId = this.isEdit ? this.editId : undefined;
            const paramsData = {
              ...this.record.valueOf(recordMapTo),
              isTop: this.isTop,
              params: { idList, ...this.allData },
              files: this.record.files,
              id: this.editId,
              title,
            };
            const saveURL = this.isEdit ? this.putSaveReport : this.postSaveReport;
            if (type === 'save') {
              this.saveLoading = true;
              this.save2Btn = true;
              saveURL({ ...paramsData }).then(() => {
                this.$router.push('/process-issue/issue-definition-list');
              }).finally(() => {
                this.saveLoading = false;
                this.save2Btn = false;
              });
            } else {
              this.save2Loading = true;
              this.saveBtn = true;
              saveURL({ ...paramsData }).then((res) => {
                this.postSaveAndIrsR(res).then((data) => {
                  this.$router.push('/process-issue/issue-definition-list');
                  window.open(`/qis/question/question-create/edit/${data.id}`);
                });
              }).finally(() => {
                this.save2Loading = false;
                this.saveBtn = false;
              });
            }
          } else {
            reject(valid);
          }
          return valid;
        });
      });
    },
    // 车型选择
    vehicleModelIdChange (value, label) {
      this.carTitle = !!label;
      this.record.clear(['rspnsUserId']);
      this.record.carTitleInput = label;
    },
    handleChange () {
      this.record.clear(['rspnsUserId']);
    },
    /**
     * 下拉树 数据转化
     */
    vehicleModelTreeTransform: treeTransform(transform({
      value: 'id',
      label: 'psNameZh',
      children: 'children',
      selectable: (item) => !(item.children && item.children.length),
    })),
    responseDeptTreeTransform: treeTransform(transform({
      value: 'code',
      label: 'name',
      children: 'children',
      selectable: (item) => !(item.children && item.children.length),
    })),
    deptTreeTransform: treeTransform(transform({
      value: 'ID',
      label: 'NAME',
      children: 'children',
      selectable: (item) => !(item.children && item.children.length),
    })),
    /**
     * 联动
     */
    // 所属系统
    changeSystem () {
      this.record.clear(['pfsFunId', 'pfsFaultId']);
    },
    // 所属功能
    changeFeatures () {
      this.record.clear(['pfsFaultId']);
    },
    // 提出人部门下拉
    userDeptChange () {
      this.record.advUserId = null;
    },
    // 禁用未开始的日期
    disabledDate (current) {
      return current && current > GET_MOMENT(GET_END_OF_DAY(new Date()));
    },
    // VIN 车号 输入后改变验证规则，实现动态验证
    changeVinNoRequired (e) {
      this.isRequired = !e.target.value && !this.record.vhclNo;
    },
    changeLicenseRequired (e) {
      this.isRequired = !e.target.value && !this.record.vin;
    },
    // 补充信息是否展开
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

  },
};
</script>

<style lang="less" scoped>
.issue-box {
  display: flex;
  flex-direction: column;

  .collapse-title {
    margin-left: 6px;
    margin-bottom: 16px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
  }
  .page-title {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    border-radius: 4px;
    width: 1125px;
    height: 40px;
    line-height: 40px;
    margin-top: 16px;
    margin-bottom: 24px;
    padding-left: 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
  }
  /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
  .ContentDiv {
    height: auto !important;
    margin-left: 32px;
  }
  .supplyContent {
    height: 0;
    overflow: hidden;
  }
  .operate-buttons {
    text-align: center;
    margin-top: 16px;
    .ant-btn {
      width: 120px;
    }
  }
}
</style>
