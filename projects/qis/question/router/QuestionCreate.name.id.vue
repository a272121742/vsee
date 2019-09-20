/* eslint-disable vue/attribute-hyphenation */
/* eslint-disable vue/attribute-hyphenation */
<template>
  <div id="components-form-demo-advanced-search">
    <a-affix
      :offset-top="64"
    >
      <div class="top-buttons">
        <div class="backButton">
          <a-button
            slot="tabBarExtraContent"
            class="backBtn"
            @click="goBack"
          >
            <a-icon type="rollback" />
            返回
          </a-button>
        </div>
        <div class="rightButton">
          <a-button
            v-if="submitBtn"
            type="primary"
            html-type="submit"
            class="submitBtn"
            @click="handleSubmit"
          >
            提交
          </a-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            type="primary"
            :class="[actiive]"
            @click="handleSave"
          >
            保存
          </a-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            class="cancelBtn"
            @click="handleReset"
          >
            取消
          </a-button>
        </div>
      </div>
    </a-affix>
    <div class="formConetnt">
      <a-card
        :title="questionTitle"
        class="cardTitle"
      >
        <a-form
          ref="form"
          class="ant-advanced-search-form"
          :form="form"
          @submit="handleSearch"
        >
          <div>
            <div class="collapse-title">
              <a-icon
                :type="BaseIcon"
                style="margin-right:10px"
              />基本信息
            </div>
            <div>
              <div :class="[BaseContent]">
                <div class="pageTitle">
                  <span>问题标题：</span>
                  <div
                    v-if="carTitle||faultTreeIds2Title||codeTitle"
                    style="display:inline-block;"
                  >
                    <span class="carTitle">{{ carTitle }}</span>
                    <span class="faultTreeIds2Title"> {{ faultTreeIds2Title }}</span>
                    <span class="codeTitle">{{ codeTitle }}</span>
                  </div>
                </div>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 车型名称 -->
                    <a-form-item :label="$t('issue.vehicleModelName')">
                      <net-select
                        v-decorator="[
                          'vehicleModelId',
                          {rules:[
                            {
                              required:true,
                              message:$t('search.please_select')+$t('issue.vehicleModelName')
                            }]}
                        ]"
                        url="/masterdata/v1/vehiclemodel"
                        show-search
                        :transform="selectOption"
                        :filter-option="filterOption"
                        :placeholder="$t('search.please_select')"
                        :allow-clear="true"
                        @change="vehicleModelIdChange"
                      ></net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 所属系统 -->
                    <a-form-item :label="$t('issue.faultTreeIds1')">
                      <net-select
                        v-decorator="[
                          'faultTreeIds1',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.faultTreeIds1')}]}
                        ]"
                        url="/issue/v1/faultcategory?p_id=0"
                        show-search
                        :transform="selectOption"
                        :delay="!isEdit"
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        :allow-clear="true"
                        @change="handleSystem"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <!-- 所属功能 -->
                  <a-col :span="6">
                    <a-form-item :label="$t('issue.faultTreeIds2')">
                      <net-select
                        v-decorator="[
                          'faultTreeIds2',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.faultTreeIds2')}]}
                        ]"
                        show-search
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        :disabled="!record.faultTreeIds1"
                        :delay="!isEdit"
                        :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
                        :cache="false"
                        :transform="selectOption"
                        :allow-clear="true"
                        @change="faultTreeIds2Change"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <!-- 故障代码 -->
                  <a-col :span="6">
                    <a-form-item :label="$t('issue.faultTreeIds3')">
                      <net-select
                        v-decorator="[
                          'faultTreeIds3',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.faultTreeIds3')}]}
                        ]"
                        show-search
                        :placeholder="$t('search.please_select')"
                        :delay="!isEdit"
                        :filter-option="filterOption"
                        :disabled="!record.faultTreeIds2"
                        :url="`/issue/v1/faultTree?fault_category_id=${record.faultTreeIds2}`"
                        :cache="false"
                        :transform="selectOption"
                        :allow-clear="true"
                        @change="faultTreeIds3Change"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 问题分类 -->
                    <a-form-item :label="$t('issue.source')">
                      <net-select
                        v-decorator="[
                          'source',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.source')}]}
                        ]"
                        show-search
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        url="/sys/dict?dictType=issue_source"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                        @change="handleSource"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 严重等级 -->
                    <a-form-item :label="$t('issue.grade')">
                      <net-select
                        v-decorator="[
                          'grade',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.grade')}]}
                        ]"
                        show-search
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        url="/sys/dict?dictType=issue_grade"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 问题阶段 -->
                    <a-form-item :label="$t('issue.projectPhase')">
                      <net-select
                        v-decorator="[
                          'projectPhase',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.projectPhase')}]}
                        ]"
                        show-search-
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        url="/sys/dict?dictType=issue_phase"
                        :transform="selectOptiondict"
                        :allow-clear="true"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="$t('issue.failureDate')">
                      <a-date-picker
                        v-decorator="[
                          'failureDate'
                        ]"
                        format="YYYY-MM-DD HH:mm:ss"
                        :disabled-date="disabledDate"
                        :placeholder="$t('search.please_select')"
                        show-time
                        style="width:261px;"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <!-- 生产基地 -->
                    <a-form-item :label="$t('issue.manufactureBase')">
                      <net-select
                        v-decorator="[
                          'manufactureBaseId',
                          {rules:[{required:true, message:$t('search.please_select')+$t('issue.manufactureBase')}]}
                        ]"
                        show-search-
                        :placeholder="$t('search.please_select')"
                        :filter-option="filterOption"
                        url="/masterdata/v1/manufactureBase"
                        :transform="selectOptionBase"
                        :allow-clear="true"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 责任部门 -->
                    <a-form-item :label="$t('issue.responsibleDepartmentId')">
                      <net-select
                        v-decorator="['responsibleDepartmentId']"
                        url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                        :transform="selectOptionSingn"
                        :placeholder="$t('search.please_select')"
                        :delay="!isEdit"
                        :allow-clear="true"
                      >
                      </net-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <!-- 问题频次 -->
                    <a-form-item :label="$t('issue.frequency')">
                      <v-input
                        v-decorator="[
                          'frequency',
                        ]"
                        allow-clear
                        :placeholder="$t('search.please_select')"
                      />
                    </a-form-item>
                  </a-col>
                  <!-- 相关人手机 -->
                  <a-col :span="6">
                    <a-form-item
                      :label="$t('issue.contact')"
                      class="quesetionContact"
                    >
                      <v-input
                        v-decorator="[
                          'contact',
                        ]"
                        allow-clear
                        :placeholder="$t('search.please_select')"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <!-- 问题描述 -->
                  <a-col :span="16">
                    <a-form-item
                      class="form-item-flex-2"
                      :label="$t('issue.description')"
                    >
                      <v-textarea
                        v-decorator="[
                          'description',
                          {rules: [{ required: true, message:$t('search.please_select')+$t('issue.description') }]}
                        ]"
                        :placeholder="$t('search.please_select')"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item :label="`附件`">
                      <a-upload
                        action="/api/issue/v1/file/upload?recType=10021003"
                        :headers="headers"
                        name="file"
                        :multiple="true"
                        :file-list="fileList"
                        :remove="removeFile"
                        @preview="downFile"
                        @change="handleChange"
                      >
                        <a-button>
                          <a-icon type="upload" /> 上传文件
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
              class="collapse-title"
              @click="SuppelyOpen"
            >
              <a-icon
                :type="SuppelyIcon"
                style="margin-right:10px"
              />
              补充信息
            </div>
            <div :class="supplyContent">
              <a-row :gutter="24">
                <a-col :span="6">
                  <!-- VIN -->
                  <a-form-item :label="$t('issue.vinNo')">
                    <v-input
                      v-decorator="[
                        'vinNo',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('issue.firstCausePart')">
                    <net-select
                      v-decorator="[
                        'firstCausePart',
                      ]"
                      show-search-
                      :filter-option="filterOption"
                      url="/masterdata/v1/part"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOption"
                      :allow-clear="true"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('issue.partId')">
                    <net-select
                      v-decorator="[
                        'partId',
                      ]"
                      show-search-
                      :filter-option="filterOption"
                      url="/masterdata/v1/part"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOption"
                      :allow-clear="true"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('issue.supplierId')">
                    <net-select
                      v-decorator="[
                        'supplierId',
                      ]"
                      show-search-
                      :filter-option="filterOption"
                      url="/masterdata/v1/supplier"
                      :placeholder="$t('search.please_select')"
                      :transform="selectOption"
                      :allow-clear="true"
                    ></net-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="$t('issue.productDate')">
                    <a-date-picker
                      v-decorator="[
                        'productDate'
                      ]"
                      :placeholder="$t('search.please_select')"
                      :disabled-date="disabledDate"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:261px;"
                    />
                  </a-form-item>
                </a-col>
                <!-- 试验类型 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.testType')">
                    <net-select
                      v-decorator="[
                        'testType',
                      ]"
                      show-search-

                      :filter-option="filterOption"

                      url="/sys/dict?dictType=issue_test_type"

                      :placeholder="$t('search.please_select')"

                      :transform="selectOptiondict"

                      :allow-clear="true"
                    ></net-select>
                  </a-form-item>
                </a-col>
                <!-- 故障里程 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.milage')">
                    <v-input
                      v-decorator="[
                        'milage',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
                <!-- 维修网点 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.maintenanceStation')">
                    <v-input
                      v-decorator="[
                        'maintenanceStation',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- 软件版本号 -->
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="$t('issue.softwareVersion')">
                    <v-input
                      v-decorator="[
                        'softwareVersion',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
                <!-- 标定版本号 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.calibrationVersion')">
                    <v-input
                      v-decorator="[
                        'calibrationVersion',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="$t('issue.hardwareVersion')">
                    <v-input
                      v-decorator="[
                        'hardwareVersion',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    />
                  </a-form-item>
                </a-col>
                <!-- 配置字版本号 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.confirmationVersion')">
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
                  <!-- 工况信息 -->
                  <a-form-item :label="$t('issue.workConditionInfo')">
                    <v-textarea
                      v-decorator="[
                        'workConditionInfo',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <!-- 初步排查情况 -->
                <a-col :span="6">
                  <a-form-item :label="$t('issue.preliminaryInvestigation')">
                    <v-textarea
                      v-decorator="[
                        'preliminaryInvestigation',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
                    ></v-textarea>
                  </a-form-item>
                </a-col>
                <!-- 备注 -->
                <a-col :span="12">
                  <a-form-item :label="$t('issue.remark')">
                    <v-textarea
                      v-decorator="[
                        'remark',
                      ]"
                      allow-clear
                      :placeholder="$t('search.please_input')"
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
  autoUpdateFileds
} from '@util/formhelper.js';

import {
  createNamespacedHelpers
} from 'vuex';
import moment from 'moment';

const {
  mapActions
} = createNamespacedHelpers('question');

const isDev = process.env.NODE_ENV === 'development';

export default {
  name: 'QuestionCreate',
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VInput: () => import('@comp/form/VInput.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue')
  },

  props: ['name', 'id'],
  data () {
    const {
      $store
    } = this;
    return {
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
      headers: {
        authorization: 'authorization-text',
        token: $store.getters.getToken()
      },
      // 数据模板
      record: {
        // faultTreeIds1: '', // 所属系统
        // faultTreeIds2: '', // 所属功能
        // faultTreeIds3: '', // 故障代码
        // grade: '', // 严重等级
        // source: '', // 问题分类
        // vehicleModelId: null, // 车型
        // projectPhase: '', // 问题阶段
        // manufactureBaseId: '', // 生产基地
        // failureDate: null, // 故障发生日期
        // frequency: '', // 问题频次
        // responsibleDepartmentId: '', // 责任部门
        // description: '', // 问题描述
        // file: '', // 文件上传
        // contact: '', // 问题相关人员联系方式
        // /**
        //    * 补充信息
        //    */
        // testType: '', // 试验类型
        // firstCausePart: '', // 祸首件
        // partId: '', // 零件号
        // supplierId: '', // 供应商名称
        // softwareVersion: '', // 软件版本号
        // calibrationVersion: '', // 标定版本号
        // hardwareVersion: '', // 硬件版本号
        // confirmationVersion: '', // 配置字版本号
        // vinNo: '', // Vin
        // productDate: null, // 生产时间
        // maintenanceStation: '', // 维修网点
        // milage: '',
        // remark: '',
        // workConditionInfo: '' // 工况信息

      }
    };
  },
  computed: {
    isEdit () {
      return this.name !== 'create';
    }
  },
  created () {
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record')
    });
    // 初始化
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
          // 附件
          const fileListArray = [];

          this.dataFileList = res.fileList;
          res.fileList.forEach((item) => {
            const fileObject = {
              uid: item.id,
              name: item.originalFilename,
              url: item.path,
              status: 'done'
            };
            fileListArray.push(fileObject);
          })
          this.fileList = fileListArray;
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
    selectOptionSingn (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.name
        })
      })

      return optionArray;
    },
    handleSource (value) {
      this.sourceName = value;
    },
    disabledDate (current) {
      return current && current > moment().endOf('day');
    },
    // 文件下载
    downFile (info) {
      const locationUrl = isDev ? 'http://106.75.63.69:8091' : window.location.origin;
      const a = document.createElement('a');
      a.download = info.name;
      if (info.url !== undefined) {
        const url = locationUrl + '/mojo-gateway/oss/ossFile/download?path=' + encodeURIComponent(info.url) + '&originalFilename=' + encodeURIComponent(info.name) + '&token=' + this.$store.getters.getToken();
        a.href = decodeURI(url);
      } else {
        const dataFile = info.response.data;
        const url = locationUrl + '/mojo-gateway/oss/ossFile/download?path=' + encodeURIComponent(dataFile.path) + '&originalFilename=' + encodeURIComponent(dataFile.originalFilename) + '&token=' + this.$store.getters.getToken();
        a.href = decodeURI(url);
      }

      // a.href = locationUrl + '/api/oss/ossFile/download?path=1.pdb&originalFilename=3.pdb';
      a.click();
      a.remove();
      return false;
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
        this.supplyContent = 'ContentDiv'
        this.SuppelyIcon = 'down';
        this.DetailSuppely = false;
      } else {
        this.SuppelyIcon = 'right';
        this.supplyContent = 'supplyContent'
        this.DetailSuppely = true;
      }
    },
    selectOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.name
        })
      })

      return optionArray;
    },
    selectOptionBase (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.nameZh + ' ' + item.nameEn
        })
      })

      return optionArray;
    },
    selectOptiondict (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.dictValue,
          label: item.dictName
        })
      })

      return optionArray;
    },
    // 所属系统选择
    handleSystem (value) {
      //  this.functionUrl='/issue/v1/faultcategory?p_id'+value;
      this.record.faultTreeIds1 = value;
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      this.form.validateFields((err) => {
        if (!err) {
          const data = this.form.getFieldsValue();
          const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
          data.faultTreeIds = tree;

          const title = this.carTitle + '-' + this.faultTreeIds2Title + '-' + this.codeTitle;

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
          const vm = this
          const param1 = {
            issueSource: this.sourceName,
            type: 'coChair'
          }
          const param2 = {
            issueSource: this.sourceName,
            type: 'monitor'
          }
          const cocharFunction = vm.getSysUser(param1).then(res => {
            vm.coChair = vm.coChair ? vm.coChair : res.id;
            return vm.coChair;
          })
          const monitorFunction = vm.getSysUser(param2).then(res => {
            vm.monitor = vm.monitor ? vm.monitor : res.id;
            return vm.monitor;
          })
          // vm.coChair = vm.coChair ? vm.coChair : cocharId;
          // vm.monitor = vm.monitor ? vm.monitor : monitorId;
          if (this.businessKey) {
            data.id = this.id;
            data.optCounter = this.optCounter;
            Promise.all([cocharFunction, monitorFunction]).then((result) => {
              console.log(result);
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
                    this.$router.push({
                      path: this.$route.query.form || '/'
                    });
                  }
                });
              })
            })
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
                    this.$router.push({
                      path: this.$route.query.form || '/'
                    });
                  }
                });
              });
            })
          }
        }
      });
    },
    handleSave () {
      const data = this.form.getFieldsValue();

      const tree = `所属系统-${data.faultTreeIds1},所属功能-${data.faultTreeIds2},故障代码-${data.faultTreeIds3}`;
      data.faultTreeIds = tree;
      const title = this.carTitle + '-' + this.faultTreeIds2Title + '-' + this.codeTitle;

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
      data.fileList = this.dataFileList;

      if (this.name === 'create') {
        if (this.businessKey) {
          data.id = this.id;
          data.optCounter = this.optCounter;
          this.editSaveQuestion(data).then(res => {
            this.businessKey = res.id;
            this.optCounter = res.optCounter;
            this.$router.push({
              path: this.$route.query.form || '/'
            });
          })
        } else {
          this.saveQuestion(data).then(res => {
            this.businessKey = res.id;
            this.$router.push({
              path: this.$route.query.form || '/'
            });
          });
        }
      } else if (this.name === 'edit') {
        this.form.validateFields((err) => {
          if (!err) {
            data.id = this.id;
            data.optCounter = this.optCounter;

            this.editSaveQuestion(data).then(res => {
              this.businessKey = res.id;
              this.optCounter = res.optCounter;
              this.$router.push({
                name: 'QuestionDetail',
                params: {
                  id: this.id
                },
                query: {
                  form: this.$route.path
                }
              })
            })
          }
        })
      }
    },
    handleSearch (e) {
      e.preventDefault();
    },
    handleChange (info) {
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        const result = file;
        if (file.response) {
          // Component will show file.url as link
          result.url = file.response.url;
        }
        return result;
      });
      this.fileList = fileList;
      const status = info.file.status;

      if (status === 'done') {
        if (info.file.response !== undefined) {
          this.dataFileList.push(info.file.response.data)
        }
      }

      console.log(this.dataFileList);
    },
    // 删除文件
    removeFile (file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
      const newDataList = this.dataFileList.slice();
      newDataList.splice(index, 1);
      this.dataFileList = newDataList;
      console.log(this.dataFileList);
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
      ], 'record')
    }
  }
};
</script>

<style lang="less" scoped>
  #components-form-demo-advanced-search {
    .formConetnt{
      margin-top:0px;
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
      width: 1020px;
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
    left: 0px!important;
    width: 100%!important;
    background: rgba(75,75,75,0.85);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
    .top-buttons {
      width: 1200px!important;
      margin: 0 auto!important;
    }
  }
  .top-buttons {
    overflow: hidden;
    padding: 16px 0;
    z-index:9999;

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

  }

  #components-form-demo-advanced-search {
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
  }
</style>
<style lang="less">

</style>
