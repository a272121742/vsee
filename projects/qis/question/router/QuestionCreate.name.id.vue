<template>
  <div id="components-form-demo-advanced-search">
    <div class="TopButton">
      <div class="backButton">
        <a-button slot="tabBarExtraContent" class="backBtn" @click="goBack">
          <img src="/static/question/back.png" />
          返回
        </a-button>
      </div>
      <div class="rightButton">
        <a-button type="primary" html-type="submit" @click="handleSubmit" class="submitBtn" v-if="submitBtn">
          提交
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleSave" type="primary" :class="[actiive]">
          保存
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleReset" class="cancelBtn">
          取消
        </a-button>
      </div>
    </div>
    <a-card :title="questionTitle" class="cardTitle">
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
        <div>
          <div class="collapse-title" @click="BaseOpen">
            <a-icon :type="BaseIcon" style="margin-right:10px" />基本信息</div>
          <div>
            <div :class="[BaseContent]">
              <div class="pageTitle">
                <span>问题标题：</span>
                <div v-if="carTitle||faultTreeIds2Title||codeTitle" style="display:inline-block;">
                  <span class="carTitle">{{ carTitle }}</span>
                  <span class="faultTreeIds2Title"> {{ faultTreeIds2Title }}</span>
                  <span class="codeTitle">{{ codeTitle }}</span>
                </div>

              </div>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`车型`">
                    <net-select url="/masterdata/v1/vehiclemodel" showSearch :transform="selectOption"  
                      :filterOption="filterOption" @change="vehicleModelIdChange" placeholder="请选择" :allow-clear="true"
                      v-decorator="[
                      'vehicleModelId',
                      {rules:[{required:true, message:'请选择车型'}]}
                  ]"></net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`所属系统`">
                    <net-select url="/issue/v1/faultcategory?p_id=0" show-search :transform="selectOption"
                      :delay="!!record.faultTreeIds1" placeholder="请选择" @change="handleSystem"
                      :filterOption="filterOption" :allow-clear="true" v-decorator="[
                      'faultTreeIds1',
                      {rules:[{required:true, message:'请选择所属系统'}]}
                    ]">

                    </net-select>

                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`所属功能`">
                    <net-select showSearch placeholder="请选择" :filterOption="filterOption"
                      :delay="!!record.faultTreeIds2" :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
                      :transform="selectOption" @change="faultTreeIds2Change" :allow-clear="true" v-decorator="[
                      'faultTreeIds2',
                      {rules:[{required:true, message:'请选择所属系统'}]}
                    ]">

                    </net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`故障代码`">
                    <net-select show-search  placeholder="请选择" :delay="!!record.faultTreeIds3"
                      :filterOption="filterOption" @change="faultTreeIds3Change"
                      :url="`/issue/v1/faultTree?fault_category_id=${record.faultTreeIds2}`" :transform="selectOption"
                      :allow-clear="true" v-decorator="[
                      'faultTreeIds3',
                      {rules:[{required:true, message:'请选择故障代码'}]}
                    ]">
                    </net-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`问题分类`">
                    <net-select show-search  placeholder="请选择" :filterOption="filterOption"
                      url="/sys/dict?dictType=issue_source" :transform="selectOptiondict" :allow-clear="true"
                      v-decorator="[
                      'source',
                      {rules:[{required:true, message:'请选择问题分类'}]}
                    ]">
                    </net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`严重等级`">
                    <net-select showSearch  placeholder="请选择" :filterOption="filterOption"
                      url="/sys/dict?dictType=issue_grade" :transform="selectOptiondict" :allow-clear="true"
                      v-decorator="[
                      'grade',
                      {rules:[{required:true, message:'请选择严重等级'}]}
                    ]">
                    </net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题阶段`">
                    <net-select showSearch  placeholder="请选择" :filterOption="filterOption"
                      url="/sys/dict?dictType=issue_phase" :transform="selectOptiondict" :allow-clear="true"
                      v-decorator="[
                      'projectPhase',
                      {rules:[{required:true, message:'请选择问题阶段'}]}
                    ]">
                    </net-select>

                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`故障发生日期`">
                    <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'failureDate'
                    ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`生产基地`">
                    <!-- TODO:  何莎 回显数据的时候下拉框无法匹配数据 -->
                    <net-select showSearch  placeholder="请选择" :filterOption="filterOption"
                      url="/masterdata/v1/manufactureBase" :transform="selectOptionBase" :allow-clear="true"
                      v-decorator="[
                      'manufactureBaseId',
                      {rules:[{required:true, message:'请选择生产基地'}]}
                    ]" />

                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`责任部门`">
                    <net-select showSearch  placeholder="请选择" :filterOption="filterOption"
                      :url="`/issue/faultTree?fault_category_id=${record.faultTreeIds2}`" :transform="selectOption"
                      :allow-clear="true" v-decorator="[
                      'responsibleDepartmentId',
                    ]">
                    </net-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题频次`">
                    <v-input allow-clear placeholder="请输入" v-decorator="[
                      'frequency',
                    ]" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`相关人手机`" class="quesetionContact">
                    <!-- TODO: 何莎  v-input  回显数据绑定数据源失败-->
                    <v-input allow-clear placeholder="请输入" v-decorator="[
                      'contact',
                    ]" />

                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="16">
                  <a-form-item class="form-item-flex-2" :label="`问题描述`">
                    <v-textarea placeholder="输入" allow-clear v-decorator="[
                      'description',
                      {rules: [{ required: true, message: '请输入问题描述' }]}
                    ]" />

                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="`附件`">
                    <a-upload action="/api/issue/v1/file/upload?recType=10021003" :headers="headers" name="file"
                      :multiple="true" @change="handleChange">
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
          <div class="collapse-title" @click="SuppelyOpen">           
            <a-icon :type="SuppelyIcon" style="margin-right:10px"  />
            补充信息
          </div>
           <div :class="supplyContent">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`VIN`">
                  <v-input allow-clear placeholder="请输入" v-decorator="[
                      'vinNo',
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`祸首件`">
                  <net-select showSearch  :filterOption="filterOption" url="/masterdata/v1/part" placeholder="请选择"
                    :transform="selectOption" :allow-clear="true" v-decorator="[
                      'firstCausePart',

                  ]"></net-select>

                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`零件号`">
                  <net-select showSearch  :filterOption="filterOption" url="/masterdata/v1/part" placeholder="请选择"
                    :transform="selectOption" :allow-clear="true" v-decorator="[
                      'partId',

                  ]"></net-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`供应商名称`">
                  <net-select showSearch  :filterOption="filterOption" url="/masterdata/v1/supplier" placeholder="请选择"
                    :transform="selectOption" :allow-clear="true" v-decorator="[
                      'supplierId',

                  ]"></net-select>

                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`生产时间`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'productDate'
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`试验类型`">
                  <net-select showSearch  :filterOption="filterOption" url="/sys/dict?dictType=issue_test_type" placeholder="请选择"  :transform="selectOptiondict" :allow-clear="true" v-decorator="[
                                          'testType',                   ]"></net-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`故障里程`">
                  <v-input allow-clear placeholder="请输入                                       Km" v-decorator="[
                      'milage',
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`维修网点`">
                  <v-input allow-clear placeholder="请输入" v-decorator="[
                      'maintenanceStation',
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">

              <a-col :span="6">
                <a-form-item :label="`软件版本号`">
                  <v-input allow-clear placeholder="请输入" v-decorator="[
                      'softwareVersion',
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`标定版本号`">
                  <v-input allow-clear placeholder="请输入" v-decorator="[
                      'calibrationVersion',
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`硬件版本号`">
                  <v-input allow-clear placeholder="请输入" v-decorator="[
                      'hardwareVersion',
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`配置字版本号`">
                  <v-input placeholder="请输入" allow-clear v-decorator="[
                      'confirmationVersion',
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`工况信息`">
                  <v-textarea allow-clear placeholder="请输入" v-decorator="[
                      'workConditionInfo',
                    ]"></v-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`初步排查情况`">
                  <v-textarea allow-clear placeholder="请输入" v-decorator="[
                      'preliminaryInvestigation',
                    ]"></v-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="`备注`">
                  <v-textarea allow-clear placeholder="请输入" v-decorator="[
                      'remark',
                    ]"></v-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
<script>
  import {
    createFormFields,
    autoUpdateFileds
  } from '@util/formhelper.js';
  import Axios from 'axios';
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
      VInput: () => import('@comp/form/VInput.vue'),
      VTextarea: () => import('@comp/form/VTextarea.vue'),
      NetButton: () => import('@comp/button/NetButton.vue'),
      PreventButton: () => import('@comp/button/PreventButton.vue'),
    },

    props: ['name', 'id'],
    data() {
      const {
        $store
      } = this;
      return {
        businessKey: '',
        businessTitle: '',
        BaseContent: '',
        supplyContent: 'supplyContent',
        DetailBase: true, //基本信息是否展开标识
        DetailSuppely: false, //补充信息是否展开标识
        BaseIcon: "down",
        SuppelyIcon: "right",
        questionTitle: '创建问题',
        optCounter: '',
        expand: false,
        form: null,
        functionUrl: '', //所属功能请求地址
        actiive: '',
        detailList: [], // 编辑显示
        submitBtn: false, // 是否显示提交按钮
        titleFlag: false, // 问题标题是否显示
        carTitle: '', // 车型标题
        faultTreeIds2Title: '', // 功能标题，
        codeTitle: '', // 故障代码标题
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
          token: $store.getters.getToken
        },
        // 数据模板
        record: {
          "faultTreeIds1": "", // 所属系统
          "faultTreeIds2": "", // 所属功能
          "faultTreeIds3": "", // 故障代码
          "grade": "", // 严重等级
          "source": "", // 问题分类
          "vehicleModelId": "", // 车型
          "projectPhase": "", // 问题阶段
          "manufactureBaseId": "", // 生产基地
          "failureDate": null, // 故障发生日期
          "frequency": '', // 问题频次
          "responsibleDepartmentId": "", // 责任部门
          "description": '', // 问题描述
          "file": '', // 文件上传
          "contact": '', // 问题相关人员联系方式
          /**
           * 补充信息
           */
          "testType": "", // 试验类型
          "firstCausePart": "", // 祸首件
          "partId": "", // 零件号
          "supplierId": "", // 供应商名称
          "softwareVersion": '', // 软件版本号
          "calibrationVersion": '', // 标定版本号
          "hardwareVersion": '', // 硬件版本号
          "confirmationVersion": '', // 配置字版本号
          "vinNo": '', // Vin
          "productDate": null, // 生产时间
          "maintenanceStation": '', // 维修网点
          "milage": '',
          "remark": '',
          "workConditionInfo": '', //工况信息

        }
      };
    },

    created() {
      this.form = this.$form.createForm(this, {
        mapPropsToFields: this.mapPropsToFields,
        onValuesChange: autoUpdateFileds(this, 'record')
      });
      // 初始化
      this.init();
    },
    methods: {
      ...mapActions([
        'addQuestion',
        'commitQuestion',
        'updateQuestion',
        'getQuestionPage',
        'eidtQuestion',
        'saveQuestion',
        'editSaveQuestion'
      ]),
      // 初始化
      init() {

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

            this.optCounter = res.optCounter;
            //日期格式回显
            if (res.failureDate) {
              let failureDate = moment(res.failureDate);
              this.record.failureDate = failureDate;
            }
            if (res.productDate) {
              let productDate = moment(res.productDate);
              this.record.productDate = productDate;
            }


            this.form.updateFields(this.mapPropsToFields());

            this.carTitle = this.record.vehicleModelName; // 车型标题
            this.faultTreeIds2Title = this.record.faultTreeIds2Name; // 功能标题，
            this.codeTitle = this.record.faultTreeIds3Name; // 故障代码标题
          });


        }
      },
      // //自定义文件上传
      // customRequest(data) {

      //   const formData = new FormData()
      //   formData.append('file', data.file)
      //   formData.append('token', data.headers.token) //随便写一个token示例
      //   this.saveFile(formData)
      // },
      // saveFile(formData) {
      //   debugger;

      //   Axios({
      //     url: "http://106.75.63.69:8080/issue/v1/file/upload?recType=10021003",
      //     method: 'post',
      //     data: formData
      //   }) .then((response) => {
      //       console.log(response)
      //     })
      //     .catch(function (error) {
      //       console.log(error)
      //     })


      // },
      //基本信息是否展开
      BaseOpen() {

        if (this.DetailBase) {
          this.DetailBase = false;
          this.BaseContent = "BaseContent";
          this.BaseIcon = "right";
        } else {
          this.DetailBase = true;
          this.BaseIcon = "down";
          this.BaseContent = "ContentDiv";
        }

      },
      SuppelyOpen() {

        if (this.DetailSuppely) {
          this.DetailSuppely = false;
          this.supplyContent = 'supplyContent'
          this.SuppelyIcon = "right";
        } else {
          this.SuppelyIcon = "down";
          this.supplyContent = 'ContentDiv'
          this.DetailSuppely = true;
        }
      },
      selectOption(input, option) {

        let optionArray = [];

        input.forEach((item) => {

          optionArray.push({
            value: item.id,
            label: item.name
          })
        })

        return optionArray;
      },
      selectOptionBase(input, option) {
        let optionArray = [];

        input.forEach((item) => {

          optionArray.push({
            value: item.id,
            label: item.nameZh + " " + item.nameEn
          })
        })

        return optionArray;
      },
      selectOptiondict(input, option) {
        let optionArray = [];

        input.forEach((item) => {

          optionArray.push({
            value: item.dictValue,
            label: item.dictName
          })
        })

        return optionArray;
      },
      //所属系统选择
      handleSystem(value) {
        //  this.functionUrl='/issue/v1/faultcategory?p_id'+value;
        this.record.faultTreeIds1 = value;
      },
      filterOption(input, option) {

        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      goBack() {
        this.$router.go(-1);
      },
      // 车型选择
      vehicleModelIdChange(value, option) {
        if (option != undefined) {
          if (option.componentOptions.children[0].text != undefined) {
            this.carTitle = option.componentOptions.children[0].text;
          }
        }



        // this.carTitle = value;
      },
      // 所属功能选择
      faultTreeIds2Change(value, option) {
        if (option != undefined) {
          if (option.componentOptions != undefined) {
            if (option.componentOptions.children[0].text != undefined) {
              this.faultTreeIds2Title = option.componentOptions.children[0].text;
            }
          }
        }

      },
      faultTreeIds3Change(value, option) {
        if (option != undefined) {
          if (option.componentOptions != undefined) {
            if (option.componentOptions.children[0].text != undefined) {
              this.faultTreeIds2Title = option.componentOptions.children[0].text;
            }
          }
        }

      },
      handleSubmit(e) {
        debugger;
        this.form.validateFields((err, fieldsValue) => {
          if (!err) {
            const data = this.form.getFieldsValue();


            let primaryKey = "所属系统-" + data.faultTreeIds1 + "," + "所属功能-" + data.faultTreeIds2 + "," + "故障代码-" +
              data
              .faultTreeIds3;
            data.faultTreeIds = primaryKey;
            let title = this.carTitle + '-' + this.faultTreeIds2Title + '-' + this.codeTitle;

            data.title = title;
            //日期格式化
            if (data.failureDate) {
              let failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
              data.failureDate = failureDate;
            }
            if (data.productDate) {
              let productDate = data.productDate.format('YYYY-MM-DD HH:mm:ss');
              data.productDate = productDate;

            }

            let id=this.$store.getters.getUser;
            console.log("id   "+id);

            // this.saveQuestion(data).then(res => {
            //      this.businessKey=res;
            // })
            let name = 'submit'

            // let param={
            //        "businessKey":this.businessKey,
            //        "businessTitle":this.businessTitle,
            //        "processDefinitionKey":'BJEV1',
            //        "subSys":'irs',
            //        "taskId":null,


            //   };

            // this.workFlowSubmit(data).then(res => {

            // });
          }
        });
      },
      handleSave() {

        const data = this.form.getFieldsValue();

        let primaryKey = "所属系统-" + data.faultTreeIds1 + "," + "所属功能-" + data.faultTreeIds2 + "," + "故障代码-" + data
          .faultTreeIds3;
        data.faultTreeIds = primaryKey;
        let title = this.carTitle + '-' + this.faultTreeIds2Title + '-' + this.codeTitle;
        this.businessTitle = title;
        data.title = title;
        //日期格式化
        if (data.failureDate) {
          let failureDate = data.failureDate.format('YYYY-MM-DD HH:mm:ss');
          data.failureDate = failureDate;
        }
        if (data.productDate) {
          let productDate = data.productDate.format('YYYY-MM-DD HH:mm:ss');
          data.productDate = productDate;

        }


        if (this.name === 'create') {

          this.saveQuestion(data).then(res => {
            this.businessKey = res;

          });



        } else if (this.name === 'edit') {
          data.id = this.id;
          data.optCounter = this.optCounter;

          this.editSaveQuestion(data).then(res => {
            this.businessKey = res;
          })
        }

      },
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFields((error, values) => {

        });
      },
      handleChange(info) {
        debugger;

        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. read from response and show file link
        fileList = fileList.map((file) => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.fileList = fileList
        console.log(fileList);
      },
      gradeChange(value) {

      },
      handleReset() {
        this.form.resetFields();
      },

      toggle() {
        this.expand = !this.expand;
      },
      /**
       * 映射表单组件到模型字段
       */
      mapPropsToFields() {
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
    },
  };
</script>

<style lang="less" scoped>
  #components-form-demo-advanced-search {
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

  .TopButton {
    overflow: hidden;
    *zoom: 1;

    .rightButton {
      float: right;
      margin: 20px 0;
    }

    .backButton {
      float: left;
      margin: 20px 0;
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