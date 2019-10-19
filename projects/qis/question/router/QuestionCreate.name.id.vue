<template>
  <div id="components-form-demo-advanced-search">
    <!-- 顶部悬停按钮组 -->
    <a-affix
      :offset-top="64"
    >
      <div class="top-buttons">
        <div class="backButton">
          <a-button
            slot="tabBarExtraContent"
            @click="goBack"
            class="backBtn"
          >
            <a-icon type="rollback" />
            <!-- 「返回」按钮 -->
            {{ $t('issue_action.back') }}
          </a-button>
        </div>
        <div class="rightButton">
          <prevent-button
            ref="commitButton"
            v-if="submitBtn"
            @click="handleSubmit"
            bind="both"
            type="primary"
            class="submitBtn"
          >
            <!-- 「提交」按钮 -->
            {{ $t('issue_action.commit') }}
          </prevent-button>
          <prevent-button
            ref="saveButton"
            :style="{ marginLeft: '8px' }"
            :class="[actiive]"
            @click="handleSave"
            bind="both"
            type="primary"
          >
            <!-- 「保存」按钮 -->
            {{ $t('issue_action.save') }}
          </prevent-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            @click="handleReset"
            class="cancelBtn"
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
        <a-form
          ref="form"
          :form="form"
          @submit="handleSearch"
          class="ant-advanced-search-form"
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
                    <span class="faultTreeIds2Title"> {{ (faultTreeIds2Title || '').substr(faultTreeIds2Title.indexOf('-'),faultTreeIds2Title.length) }}</span>
                    <span class="codeTitle">{{ (codeTitle || '').substr((codeTitle || '').indexOf('-'), (codeTitle || '').length) }}</span>
                  </div>
                </div>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「车型名称」下拉 -->
                    <a-form-item :label="$t('issue.vehicleModelName')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'vehicleModelId',
                          {rules: [{
                            required: valiRequire, message:$t('search.please_select') + $t('issue.vehicleModelName')
                          }]}
                        ]"
                        :transform="selectOption"
                        :filter-option="filterOption"
                        :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
                        :allow-clear="true"
                        @change="vehicleModelIdChange"
                        url="/masterdata/v1/vehiclemodel"
                        show-search
                      ></net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「所属系统」下拉 -->
                    <a-form-item :label="$t('issue.faultTreeIds1')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'faultTreeIds1',
                          {rules:[{
                            required: valiRequire, message:$t('search.please_select') + $t('issue.faultTreeIds1')
                          }]}
                        ]"
                        :transform="selectOption"
                        :placeholder="$t('search.please_select') + $t('issue.faultTreeIds1')"
                        :filter-option="filterOption"
                        :allow-clear="true"
                        @change="handleSystem"
                        url="/issue/v1/faultcategory?p_id=0"
                        show-search
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「所属功能」下拉 -->
                    <a-form-item :label="$t('issue.faultTreeIds2')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'faultTreeIds2',
                          {rules:[{
                            required: valiRequire, message:$t('search.please_select') + $t('issue.faultTreeIds2')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select') + $t('issue.faultTreeIds2')"
                        :filter-option="filterOption"
                        :disabled="!record.faultTreeIds1"
                        :delay="!isEdit || !record.faultTreeIds1"
                        :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
                        :cache="false"
                        :transform="selectOption"
                        :allow-clear="true"
                        @change="faultTreeIds2Change"
                        show-search
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「故障代码」下拉 -->
                    <a-form-item :label="$t('issue.faultTreeIds3')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'faultTreeIds3',
                          {rules:[{
                            required: valiRequire, message:$t('search.please_select') + $t('issue.faultTreeIds3')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select') + $t('issue.faultTreeIds3')"
                        :delay="!isEdit || !record.faultTreeIds2"
                        :filter-option="filterOption"
                        :disabled="!record.faultTreeIds2"
                        :url="`/issue/v1/faultTree?fault_category_id=${record.faultTreeIds2}`"
                        :cache="false"
                        :transform="selectOption"
                        :allow-clear="true"
                        @change="faultTreeIds3Change"
                        show-search
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「问题分类」下拉 -->
                    <a-form-item :label="$t('issue.source')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'source',
                          {rules:[{
                            required: valiRequire, message:$t('search.please_select') + $t('issue.source')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select') + $t('issue.source')"
                        :filter-option="filterOption"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                        @change="handleSource"
                        show-search
                        url="/sys/dict?dictType=issue_source"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题严重等级」下拉 -->
                    <a-form-item :label="$t('issue.grade')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'grade',
                          {rules:[{
                            required: valiRequire, message: $t('search.please_select') + $t('issue.grade')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select') + $t('issue.grade')"
                        :filter-option="filterOption"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                        show-search
                        url="/sys/dict?dictType=issue_grade"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题阶段」下拉 -->
                    <a-form-item :label="$t('issue.projectPhase')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'projectPhase',
                          {rules:[{
                            required: valiRequire, message: $t('search.please_select')+$t('issue.projectPhase')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select')+$t('issue.projectPhase')"
                        :filter-option="filterOption"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                        show-search
                        url="/sys/dict?dictType=issue_phase"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题发生日期」时间日期 -->
                    <a-form-item :label="$t('issue.failureDate')" selfUpdate>
                      <a-date-picker
                        v-decorator="[
                          'failureDate'
                        ]"
                        :placeholder="$t('search.please_select') + $t('issue.failureDate')"
                        :format="GLOBAL_SELECT_DATE_FORMAT"
                        :disabledDate="disabledDate"
                        style="width:261px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 「生产基地」下拉 -->
                    <a-form-item :label="$t('issue.manufactureBase')" selfUpdate>
                      <net-select
                        v-decorator="[
                          'manufactureBaseId',
                          {rules:[{
                            required: valiRequire, message: $t('search.please_select')+$t('issue.manufactureBase')
                          }]}
                        ]"
                        :placeholder="$t('search.please_select')+$t('issue.manufactureBase')"
                        :filter-option="filterOption"
                        :transform="selectOptionBase"
                        :allow-clear="true"
                        show-search
                        url="/masterdata/v1/manufactureBase"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「责任部门」下拉 -->
                    <a-form-item :label="$t('issue.responsibleDepartmentId')" selfUpdate>
                      <net-select
                        v-decorator="['responsibleDepartmentId']"
                        :filter-option="filterOption"
                        :transform="selectOptionSingn"
                        :placeholder="$t('search.please_select') + $t('issue.responsibleDepartmentId')"
                        :delay="!isEdit"
                        :allow-clear="true"
                        show-search
                        url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「问题频次」输入 -->
                    <a-form-item :label="$t('issue.frequency')" selfUpdate>
                      <a-input
                        v-decorator="[
                          'frequency',
                          {rules: [{validator: intVer}]}
                        ]"
                        :placeholder="$t('search.please_input') + $t('issue.frequency')"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 「相关人手机」输入 -->
                    <a-form-item
                      :label="$t('issue.contact')"
                      class="quesetionContact" selfUpdate
                    >
                      <a-input
                        v-decorator="[
                          'contact',
                          {rules: [{validator: phoneVer}]}
                        ]"
                        :placeholder="$t('search.please_input') + $t('issue.contact')"
                        allow-clear
                        max="11"
                        len="11"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <!-- 「问题描述」输入 -->
                  <a-col :span="16">
                    <a-form-item
                      :label="$t('issue.description')"
                      class="form-item-flex-2" selfUpdate
                    >
                      <v-textarea
                        v-decorator="[
                          'description',
                          {rules: [{
                            required: valiRequire, message: $t('search.please_input') + $t('issue.description')
                          }]}
                        ]"
                        :placeholder="$t('search.please_input') + $t('issue.description')"
                        allow-clear
                        maxlength="254"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <!-- 「附件」上传 -->
                    <a-form-item :label="$t('issue_workflow.attachment')" selfUpdate>
                      <a-upload
                        :headers="headers"
                        :multiple="true"
                        :file-list="fileList"
                        :remove="file => removeFile(record.fileList)(file)"
                        @preview="download"
                        @change="info => changeFileList(record.fileList, fileList)(info)"
                        :action="uploadUrl"
                        name="file"
                      >
                        <a-button icon="upload">
                          <!-- 「上传文件」文本 -->
                          {{ $t('issue_action.upload') }}
                        </a-button>
                      </a-upload>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
          <div>
            <div
              @click="SuppelyOpen"
              class="collapse-title"
            >
              <a-icon
                :type="SuppelyIcon"
                style="margin-right:10px"
              />
              {{ $t('issue.additionalInfo') }}
            </div>
            <div :class="supplyContent">
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「VIN」输入 -->
                  <a-form-item :label="$t('issue.vinNo')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'vinNo',
                        {rules: [{validator: vinVer}]}
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.vinNo')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「祸首件」下拉 -->
                  <a-form-item :label="$t('issue.firstCausePart')">
                    <net-select
                      v-decorator="[
                        'firstCausePart',
                      ]"
                      :filter-option="filterOption"
                      :placeholder="$t('search.please_select') + $t('issue.firstCausePart')"
                      :transform="selectOption"
                      :allow-clear="true"
                      show-search
                      url="/masterdata/v1/part"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「零件号」下拉 -->
                  <a-form-item :label="$t('issue.partId')">
                    <net-select
                      v-decorator="[
                        'firstCausePart',
                      ]"
                      :filter-option="filterOption"
                      :placeholder="$t('search.please_select') + $t('issue.partId')"
                      :transform="selectOptionId"
                      :allow-clear="true"
                      show-search
                      url="/masterdata/v1/part"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「供应商名称」下拉 -->
                  <a-form-item :label="$t('issue.supplierId')" selfUpdate>
                    <net-select
                      v-decorator="[
                        'supplierId',
                      ]"
                      :filter-option="filterOption"
                      :placeholder="$t('search.please_select') + $t('issue.supplierId')"
                      :transform="selectOption"
                      :allow-clear="true"
                      show-search
                      url="/masterdata/v1/supplier"
                    ></net-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「生产时间」时间日期 -->
                  <a-form-item :label="$t('issue.productDate')" selfUpdate>
                    <a-date-picker
                      v-decorator="[
                        'productDate'
                      ]"
                      :placeholder="$t('search.please_select') + $t('issue.productDate')"
                      :format="GLOBAL_SELECT_DATE_FORMAT"
                      :disabledDate="disabledDate"
                      style="width:261px;"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「试验类型」下拉-->
                  <a-form-item :label="$t('issue.testType')" selfUpdate>
                    <net-select
                      v-decorator="[
                        'testType',
                      ]"
                      :filter-option="filterOption"
                      :placeholder="$t('search.please_select') + $t('issue.testType')"
                      :transform="selectOptiondict"
                      :allow-clear="true"
                      show-search
                      url="/sys/dict?dictType=issue_test_type"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「故障里程」输入 -->
                  <a-form-item :label="$t('issue.milage') + '(Km)'" selfUpdate>
                    <a-input
                      v-decorator="[
                        'milage'
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.milage')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「维修网点」输入 -->
                  <a-form-item :label="$t('issue.maintenanceStation')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'maintenanceStation',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.maintenanceStation')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「软件版本号」输入 -->
                  <a-form-item :label="$t('issue.softwareVersion')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'softwareVersion',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.softwareVersion')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「标定版本号」输入 -->
                  <a-form-item :label="$t('issue.calibrationVersion')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'calibrationVersion',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.calibrationVersion')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「硬件版本号」输入 -->
                  <a-form-item :label="$t('issue.hardwareVersion')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'hardwareVersion',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.hardwareVersion')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「配置字版本号」输入 -->
                  <a-form-item :label="$t('issue.confirmationVersion')" selfUpdate>
                    <a-input
                      v-decorator="[
                        'confirmationVersion',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.confirmationVersion')"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- 「工况信息」输入 -->
                  <a-form-item :label="$t('issue.workConditionInfo')" selfUpdate>
                    <v-textarea
                      v-decorator="[
                        'workConditionInfo'
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.workConditionInfo')"
                      maxlength="2000"
                      allow-clear
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <!-- 「初步排查情况」输入 -->
                  <a-form-item :label="$t('issue.preliminaryInvestigation')" selfUpdate>
                    <v-textarea
                      v-decorator="[
                        'preliminaryInvestigation',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.preliminaryInvestigation')"
                      maxlength="2000"
                      allow-clear
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <!-- 「备注」输入 -->
                  <a-form-item :label="$t('issue.remark')" selfUpdate>
                    <v-textarea
                      v-decorator="[
                        'remark',
                      ]"
                      :placeholder="$t('search.please_input') + $t('issue.remark')"
                      maxlength="2000"
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
import attachmentMix from '~~/issue-attachment.js';
import timeFormatMix from '~~/time-format.js';
import {
  createFormFields,
  autoUpdateFileds
} from '@util/formhelper.js';

import {
  createNamespacedHelpers
} from 'vuex';
import moment from 'moment';

const {
  mapActions
} = createNamespacedHelpers('question');

export default {
  name: 'QuestionCreate',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue'),
    PreventButton: () => import('@comp/button/PreventButton.vue')
  },
  mixins: [attachmentMix, timeFormatMix],
  props: {
    name: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    const {
      $store
    } = this;
    return {
      // 必填开关
      valiRequire: true,
      // 上传地址
      uploadUrl: $store.getters.getUrl('/issue/v1/file/upload?recType=10021003'),
      businessKey: null,
      businessTitle: '',
      sourceName: '',
      fileList: [], // 上传附件列表回显
      dataFileList: [], // 存储到数据库的列表
      BaseContent: '',
      supplyContent: 'ContentDiv',
      DetailBase: true, // 基本信息是否展开标识
      DetailSuppely: false, // 补充信息是否展开标识
      BaseIcon: 'down',
      SuppelyIcon: 'down',
      questionTitle: '创建问题',
      optCounter: '',
      expand: false,
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
      labelCol: {
        // xs: { span: 24 },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        // xs: { span: 24 },
        sm: {
          span: 16
        }
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
        productDate: '', // 生产时间
        maintenanceStation: '', // 维修网点
        milage: '',
        remark: '',
        workConditionInfo: '' // 工况信息

      }
    };
  },
  computed: {
    isEdit () {
      return this.name !== 'create';
    }
  },
  watch: {
    id: {
      handler: 'init',
      immediate: true
    }
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
      'saveQuestion',
      'editSaveQuestion',
      'workFlowSubmit',
      'getSysUser'
    ]),
    // 初始化
    init () {
      this.$set(this, 'record', { fileList: [] });
      this.form = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFields,
        onValuesChange: autoUpdateFileds(this, 'record')
      });
      this.form.resetFields();
      if (this.name === 'create') {
        this.questionTitle = '创建问题';
        this.submitBtn = true;
        this.actiive = 'saveBtn';
      } else if (this.name === 'edit') {
        this.questionTitle = '编辑问题';
        this.submitBtn = false;
        this.actiive = 'activeClass';

        this.eidtQuestion(this.id).then(res => {
          this.record = res;
          this.statusCode = res.status;
          if (this.statusCode === '100100') {
            this.submitBtn = true;
          } else {
            this.submitBtn = false;
          }
          // 附件
          // const fileListArray = [];

          // this.dataFileList = res.fileList;
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
          this.fileList = (res.fileList || []).map(this.file2client);
          // this.dataFileList = fileListArray;
          this.optCounter = res.optCounter;
          // 日期格式回显
          if (res.failureDate) {
            const failureDate = moment(res.failureDate);
            this.record.failureDate = failureDate;
          }
          if (res.productDate) {
            const productDate = moment(res.productDate);
            this.record.productDate = productDate;
          }


          this.form.updateFields(this.mapPropsToFields());

          this.carTitle = this.record.vehicleModelName; // 车型标题
          this.faultTreeIds2Title = this.record.faultTreeIds2Name; // 功能标题，
          this.codeTitle = this.record.faultTreeIds3Name; // 故障代码标题
        });
      }
    },
    // 验证VIN
    vinVer (rule, value, callback) {
      var myreg = /^[A-Z0-9]{8,17}$/;
      if (value && !myreg.test(value)) {
        callback(new Error('请输入正确的VIN'));
      } else {
        callback();
      }
    },
    // 问题频次整数校验
    intVer (rule, value, callback) {
      var myreg = /^[1-9]\d*$/;
      if (value && !myreg.test(value)) {
        callback(new Error('请输入整数'));
      } else {
        callback();
      }
    },
    // 禁用未开始的日期
    disabledDate (current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    // 验证手机号
    phoneVer (rule, value, callback) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value && !myreg.test(value)) {
        callback(new Error('请输入11位有效手机号'));
      } else {
        callback();
      }
    },
    selectOptionSingn (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.code,
          label: item.name
        });
      });

      return optionArray;
    },

    handleSource (value) {
      this.sourceName = value;
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
    selectOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.name
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
          label: item.code
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
          value: item.id,
          label: item.nameZh
        });
      });

      return optionArray;
    },
    selectOptiondict (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.dictValue,
          label: item.dictName
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
        path: this.$route.query.form || '/'
      });
    },
    // 车型选择
    vehicleModelIdChange (value, option) {
      if (option !== undefined) {
        if (option.componentOptions.children[0].text !== undefined) {
          this.carTitle = option.componentOptions.children[0].text;
        }
      }
      // this.carTitle = value;
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
    handleSubmit () {
      this.valiRequire = true;
      const commitButton = this.$refs.commitButton;
      this.form.validateFields((err) => {
        if (!err) {
          const hide = this.$message.loading('正在提交中...', 0);
          const data = this.form.getFieldsValue();
          if (data.milage === undefined) {
            data.milage = '';
          }
          data.fileList = this.record.fileList;
          const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
          data.faultTreeIds = tree;
          const title2 = this.faultTreeIds2Title || '';
          const title3 = this.codeTitle || '';

          const fault2 = title2.substr(title2.indexOf('-'), title2.length);
          const fault3 = title3.substr(title3.indexOf('-'), title3.length);
          const title = this.carTitle + fault2 + fault3;

          data.title = title;
          this.businessTitle = title;
          // 日期格式化
          if (data.failureDate) {
            const failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
            data.failureDate = failureDate;
          }
          if (data.productDate) {
            const productDate = data.productDate.format('YYYY-MM-DD HH:mm:ss');
            data.productDate = productDate;
          }

          const id = this.$store.getters.getUser().id;
          const vm = this;
          const param1 = {
            issueSource: this.sourceName,
            type: 'coChair'
          };
          const param2 = {
            issueSource: this.sourceName,
            type: 'monitor'
          };
          const cocharFunction = vm.getSysUser(param1).then(res => {
            vm.coChair = vm.coChair ? vm.coChair : res.id;
            return vm.coChair;
          });
          const monitorFunction = vm.getSysUser(param2).then(res => {
            vm.monitor = vm.monitor ? vm.monitor : res.id;
            return vm.monitor;
          });
          // vm.coChair = vm.coChair ? vm.coChair : cocharId;
          // vm.monitor = vm.monitor ? vm.monitor : monitorId;
          if (this.businessKey) {
            data.id = this.id;
            data.optCounter = this.optCounter;
            Promise.all([cocharFunction, monitorFunction]).then((result) => {
              this.editSaveQuestion(data).then(res => {
                this.businessKey = res.id;
                this.optCounter = res.optCounter;
                const param = {
                  businessKey: this.businessKey,
                  businessTitle: this.businessTitle,
                  processDefinitionKey: 'IRS1',
                  subSys: 'irs',
                  taskId: null,
                  userId: id,
                  variables: {
                    coChair: result[0],
                    monitor: result[1],
                    issc: '0',
                    businessKey: this.businessKey,
                    assigner: vm.monitor
                  }
                };
                this.workFlowSubmit(param).then(res2 => {
                  if (res2) {
                    setTimeout(() => {
                      hide();
                      this.$message.success('提交成功', 1).then(() => {
                        commitButton.reset();
                        this.$router.push({
                          path: this.$route.query.form || '/'
                        });
                      });
                    }, 200);
                  }
                });
              });
            });
          } else {
            data.id = this.id;
            data.optCounter = this.optCounter;
            Promise.all([cocharFunction, monitorFunction]).then((result) => {
              this.saveQuestion(data).then(res => {
                this.businessKey = res.id;
                const param = {
                  businessKey: this.businessKey,
                  businessTitle: this.businessTitle,
                  processDefinitionKey: 'IRS1',
                  subSys: 'irs',
                  taskId: null,
                  userId: id,
                  variables: {
                    coChair: result[0],
                    monitor: result[1],
                    issc: '0',
                    businessKey: this.businessKey,
                    assigner: vm.monitor
                  }
                };
                this.workFlowSubmit(param).then(res2 => {
                  if (res2) {
                    setTimeout(() => {
                      hide();
                      this.$message.success('提交成功', 1).then(() => {
                        commitButton.reset();
                        this.$router.push({
                          path: this.$route.query.form || '/'
                        });
                      });
                    }, 200);
                  }
                });
              });
            });
          }
        } else {
          commitButton.reset();
        }
      });
    },
    handleSave () {
      this.valiRequire = false;
      const saveButton = this.$refs.saveButton;
      this.$nextTick(() => {
        saveButton.reset();
        this.form.validateFields(Object.keys(this.form.getFieldsValue()), { force: true }, () => {});
      });

      const hide = this.$message.loading('正在保存中...', 0);
      const data = this.form.getFieldsValue();
      data.fileList = this.record.fileList;
      if (data.milage === undefined) {
        data.milage = '';
      }
      const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
      data.faultTreeIds = tree;
      const title2 = this.faultTreeIds2Title || '';
      const title3 = this.codeTitle || '';

      const fault2 = title2.substr(title2.indexOf('-'), title2.length);
      const fault3 = title3.substr(title3.indexOf('-'), title3.length);
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

      if (this.name === 'create') {
        if (this.businessKey) {
          data.id = this.id;
          data.optCounter = this.optCounter;
          this.editSaveQuestion(data).then(res => {
            this.businessKey = res.id;
            this.optCounter = res.optCounter;
            setTimeout(() => {
              hide();
              this.$message.success('保存成功', 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/'
                });
              });
            }, 200);
          });
        } else {
          this.saveQuestion(data).then(res => {
            this.businessKey = res.id;
            setTimeout(() => {
              hide();
              this.$message.success('保存成功', 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/'
                });
              });
            }, 200);
          });
        }
      } else if (this.name === 'edit') {
        data.id = this.id;
        data.optCounter = this.optCounter;
        const status = Number(this.statusCode);
        // 如果进入工作流保存做必填项校验
        if (status > 100100) {
          this.valiRequire = true;
          this.form.validateFields((err) => {
            if (!err) {
              this.editSaveQuestion(data).then(res => {
                this.businessKey = res.id;
                this.optCounter = res.optCounter;
                setTimeout(() => {
                  hide();
                  this.$message.success('保存成功', 1).then(() => {
                    saveButton.reset();
                    this.$router.push({
                      path: this.$route.query.form || '/'
                    });
                  });
                }, 200);
              });
            } else {
              setTimeout(() => {
                hide();
                saveButton.reset();
              }, 200);
            }
          });
        } else {
          this.editSaveQuestion(data).then(res => {
            this.businessKey = res.id;
            this.optCounter = res.optCounter;
            setTimeout(() => {
              hide();
              this.$message.success('保存成功', 1).then(() => {
                saveButton.reset();
                this.$router.push({
                  path: this.$route.query.form || '/'
                });
              });
            }, 200);
          });
        }
      }
    },
    handleSearch (e) {
      e.preventDefault();
    },
    gradeChange () {

    },
    handleReset () {
      this.$router.push({
        path: this.$route.query.form || '/'
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
        'manufactureBaseId', 'failureDate', 'frequency', 'responsibleDepartmentId', 'description', 'file',
        'contact', 'testType',
        'firstCausePart', 'partId', 'supplierId', 'softwareVersion', 'calibrationVersion',
        'hardwareVersion', 'confirmationVersion', 'vinNo', 'productDate', 'maintenanceStation', 'milage',
        'remark', 'workConditionInfo', 'preliminaryInvestigation'
      ], 'record');
    }
  }
};
</script>

<style lang="less" scoped>
  #components-form-demo-advanced-search {
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

    }

    .collapse-title {
      font-family: SourceHanSansCN-Medium;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      cursor: pointer;
    }

    .activeClass {
      font-family: PingFangSC-Regular;
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
      padding-left: 16px;
      font-family: SourceHanSansCN-Medium;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;

    }

    .backBtn {
      width: 80px;
      height: 32px;
      line-height: 32px;
      font-family: SourceHanSansCN-Normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.65);

      img {
        width: 13.8px;
        height: 12.5px;
        margin: 9.5px 2.2px;
      }
    }

    .uploadText {
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      width: 290px;
      margin-left: 74px;
      margin-top: -22px;
    }

    .submitBtn {
      font-family: PingFangSC-Regular;
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
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      text-align: left;
      line-height: 22px;
      background: #FFFFFF;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      border-radius: 4px;
    }

  }

  /deep/.ant-card-head-title {
    font-family: SourceHanSansCN-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }

  .questionTitle {
    font-family: SourceHanSansCN-Medium;
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
    z-index:5000;
    left: 0px!important;
    width: 100%!important;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
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
