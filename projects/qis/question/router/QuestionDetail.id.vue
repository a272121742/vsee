<template>
  <div id="components-form-demo-advanced-search">
    <a-modal title="再分配" :visible="visible" @ok="handleUser" :confirm-loading="confirmLoading" @cancel="handleCancel">
      <a-form class="ant-advanced-search-form" :form="rediStribution">
        <a-col :span="18">
          <a-form-item :label="`选择责任人`">
            <a-select placeholder="请选择" :allow-clear="true" v-decorator="[
                'dtfUser',
                {rules: [{ required: true, message: '请选择责任人' }]}
              ]">
              <a-select-option value="D0">
                D0
              </a-select-option>
              <a-select-option value="D1">
                D1
              </a-select-option>
              <a-select-option value="D2">
                D2
              </a-select-option>
              <a-select-option value="D3">
                D3
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-form>
    </a-modal>
    <a-modal :title="AnalysisTitle" :visible="visibleAnalysis" @ok="AnalysisOk" @cancel="AnalysisCancel" width="600px">
      <a-form class="ant-advanced-search-form" :form="AnalysisForm">
        <a-row v-show="false">
          <a-col :span="22">
            <a-form-item :label="`id`">
              <a-textarea style="width:340px;height:56px;" placeholder="请输入" v-decorator="[
                'id',

              ]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`标准要求`">
              <a-textarea style="width:340px;height:56px;" placeholder="请输入" v-decorator="[
                'Standard',
                {rules: [{ required: true, message: '请输入标准要求' }]}
              ]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`实际情况`">
              <a-textarea style="width:340px;height:56px;" placeholder="请输入" v-decorator="[
                'reality',
                {rules: [{ required: true, message: '请输入实际情况' }]}
              ]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`结论`">
              <a-textarea style="width:340px;height:56px;" placeholder="请输入" v-decorator="[
                'conclusion',
                {rules: [{ required: true, message: '请输入结论' }]}
              ]"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="附件">
              <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                <a-button>
                  <a-icon type="upload" /> 上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal :title="AnalysisTitle" :visible="visibleDetail" wrapClassName="visibleDetail" @ok="AnalysisDetailOk"
      @cancel="AnalysisDetailCancel" width="600px">
      <a-form class="ant-advanced-search-form" :form="DetailForm">
        <a-row v-show="false">
          <a-col :span="10">
            <a-form-item :label="`id`" style="margin-bottom:0;">
              <p>{{DetailForm.id}}</p>

            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item :label="`标准要求`" style="margin-bottom:0;">
              <p>{{DetailForm.Standard}}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item :label="`实际情况`" style="margin-bottom:0;">
              <p>{{DetailForm.reality}}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item :label="`结论`" style="margin-bottom:0;">
              <p>{{DetailForm.conclusion}}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item label="附件" style="margin-bottom:0;color: rgba(0,0,0,0.45);font-size: 14px;height:auto;">
              <div class="stepFileList clearfix">
                <ul class="fileList clearfix">
                  <li v-for="(item,index) in stepDetail.fileList" :title="item" :key="index">
                    <img src="/static/question/file.png">
                    <span>{{ item }}</span>
                  </li>

                </ul>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal title="ECN" :visible="visibleUpdate" @ok="updateOk" @cancel="updateCancel" width="600px">
      <a-form class="ant-advanced-search-form" :form="updateForm">
        <a-row v-show="false">
          <a-col :span="17">
            <a-form-item :label="`id`">

              <a-input placeholder="请输入" v-decorator="[
                      'id',
                ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="17">
            <a-form-item :label="`是否更新`" style="margin-bottom:0;">

              <a-radio-group :options="updateRadio"  v-decorator=" [
                  'isUpdate',
                    {rules: [{ required: true, message: '请选择是否更新' } ]}
                  ]"   />

            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
             <a-form-item :label="`更新内容`">
              <a-textarea placeholder="请输入" style="width:340px; height:56px;" v-decorator="[
                       'updateContent',
                       {rules: [{ required: true, message: '请输入更新内容' }]}    ]">
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item :label="`附件`">
               <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                   <a-button>
                  <a-icon type="upload"  /> 上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>


      </a-form>
    </a-modal>
    <div class="TopButton">
      <div class="backButton">
        <a-button slot="tabBarExtraContent" class="backBtn">
          <img src="/static/question/back.png" />
          返回
        </a-button>
      </div>
      <div class="rightButton">
        <a-button html-type="submit" @click="showModal" v-if="stepCurrent!=6">
          再分配
        </a-button>
        <a-button type="primary" html-type="submit" @click="handleSubmit" class="submitBtn">
          提交
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleSave" class="saveBtn">
          保存
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="handleReset" class="cancelBtn">
          取消
        </a-button>
      </div>
    </div>

    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-card title="问题详情" class="cardTitle">
        <img src="/static/question/editIcon.png" class="editIcon" @click="editDetail" v-if="!editFlag">
        <!-- <div class="baseMessage">
          基本信息
        </div> -->
        <div class="edit" v-if="editFlag">
        </div>
        <div class="detailText clearfix" v-if="!editFlag">
          <div class="baseMessage">
            基本信息
          </div>
          <div class="pageTitle" >
            <span>问题标题：</span>
            <!-- <span class="carTitle">{{ detailList.vehicleModelId }}</span> -->
            <!-- <span class="functionTitle">{{ detailList.function }}</span>
            <span class="codeTitle">{{ detailList.code }}</span> -->
            <span class="carTitle">{{ detailList.title }}</span>
          </div>

          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`车型`">
                <p>{{ detailList.vehicleModelName  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`所属系统`">
                <p>{{ detailList.faultTreeIds1 }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`所属功能`">
                <p>{{ detailList.faultTreeIds2 }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`故障代码`">
                <p style="width:164px;">
                  {{ detailList.faultTreeIds3 }}
                </p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`问题分类`">
                <p>{{ detailList.source }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题等级`">
                <p>{{ detailList.grade }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题阶段`">
                <p>{{ detailList.projectPhase  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`故障发生日期`">
                <p>{{ detailList.failureDate  }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`生产基地`">
                <p>{{ detailList.manufactureBase }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`责任部门`">
                <p>{{ detailList.responsibleDepartmentName  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题频次`">
                <p>{{ detailList.frequency }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`联系人电话`" class="quesetionContact">
                <p>{{ detailList.contact }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`创建人`">
                <p>{{ detailList.creatorName  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`创建部门`">
                <p>{{ detailList.creatorDept  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题提报日期`">
                <p>{{ detailList.createDate  }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`附件`">
                <img src="/static/question/file.png">

              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item class="form-item-flex-2" :label="`问题描述`" :label-col="{span:2}">
                <p>{{ detailList.description }}</p>
              </a-form-item>
            </a-col>
            <div class="showMore" @click="showMore" v-if="!showMoreFlag">
              <span>查看更多</span>
              <img src="/static/question/Open.png">
            </div>
          </a-row>

          <div v-if="showMoreFlag">
            <div class="baseMessage">
              补充信息
            </div>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`试验类型`">
                  <p>{{ detailList.testType  }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`祸首件`">
                  <p>{{ detailList.firstCausePart  }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`零件号`">
                  <p>{{ detailList.partId  }}</p>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item :label="`供应商名称`">
                  <p>{{ detailList.supplierName }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`软件版本号`">
                  <p>{{ detailList.softwareVersion }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`标定版本号`">
                  <p>{{ detailList.calibrationVersion }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`硬件版本号`">
                  <p>{{ detailList.hardwareVersion }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`配置字版本号`">
                  <p>{{ detailList.confirmationVersion }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`维修网点`">
                  <p>{{ detailList.maintenanceStation  }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`故障里程`">
                  <p>{{ detailList.milage}}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`VIN`">
                  <p>{{ detailList.vinNo  }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`生产时间`">
                  <p>{{ detailList.productDate  }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`备注`">
                  <p>{{ detailList.remark  }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="showMore" @click="showMore" v-if="showMoreFlag">
              <span>收起</span>
              <img src="/static/question/retractIcon.png">
            </div>
          </div>
        </div>
      </a-card>
    </a-form>
    <a-form class="ant-advanced-search-form" :form="formDcontent">
      <a-card title="问题流程" class="cardTitle">
        <div class="ant-advanced-search-form">
          <div class="step">
            <a-steps :current="stepCurrent" progressDot>

              <a-step title="问题定义" @click="goto(0)" />
              <a-step title="责任判定" @click="goto(1)" />
              <a-step title="原因分析" @click="goto(2)" />
              <a-step title="措施判定" @click="goto(3)" />
              <a-step title="措施实施" @click="goto(4)" />
              <a-step title="效果验证" @click="goto(5)" />
              <a-step title="问题关闭" @click="goto(6)" />
            </a-steps>
          </div>

          <div class="Dcontent D0content" v-if="stepCurrent===0&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否立项`">
                  <a-radio-group :options="satisfy" @change="satisfyChange" v-decorator="[
                        'satisfyRadio',
                         {rules: [{ required: true, message: '请选择是否立项' }]}
                      ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <div v-if="!satisfyFlag">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`理由`">
                    <a-textarea placeholder="请输入" v-decorator="[
                        'dissatisfaction',
                         {rules: [{ required: true, message: '请输入理由' }]}
                      ]"></a-textarea>
                  </a-form-item>
                </a-col>
              </a-row>

            </div>

            <div v-if="satisfyFlag">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`是否需要围堵措施`">

                    <a-radio-group :options="contActionOption" @change='conActionChange' v-decorator="[
                        'containmentAction',
                         {rules: [{ required: true, message: '请选择是否立项' }]}
                      ]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="conActionFlag">
                <a-col :span="21">
                  <a-form-item :label="`围堵措施`">
                    <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'Measures',
                      {rules: [{ required: true, message: '请输入围堵措施' }]}
                    ]"></a-textarea>

                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                    <a-button>
                      <a-icon type="upload" /> 上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D0back" v-if="stepCurrent!=0&&backCurrent==0&&backFlag">
            <div class="triangle_border_up" style="left:80px;">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`立项条件`">
                  <p>{{ stepDetail.satisfyRadio==='0'?'是':'否' }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <div v-if="stepDetail.satisfyRadio==='0'">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`需要围堵措施`">
                    <p>{{stepDetail.containmentAction}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="stepDetail.containmentAction==='0'">
                <a-col :span="21">
                  <a-form-item :label="`围堵措施`">
                    <p>{{stepDetail.Measures}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div v-if="stepDetail.satisfyRadio==='1'">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`理由`">
                    <p>{{ stepDetail.dissatisfaction }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`" style="height:auto;">
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li v-for="(item,index) in stepDetail.fileList" :title="item" :key="index">
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>

                    </ul>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D1content" v-if="stepCurrent===1&&backFlag===false">
            <div class="triangle_border_up" style="left:216px;">
              <span></span>
            </div>
            <div v-if="userFlag">
              <a-row style="margin-left:340px;
          ">
                <a-col :span="21">

                  <a-form-item>
                    <a-radio-group :options="determineRadio" @change="determineChange" v-decorator="[
                    'determine'
                    ]" />
                  </a-form-item>

                </a-col>
              </a-row>
              <div v-if="!NeedFlage">
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任部门`">
                      <a-select placeholder="请选择" :allow-clear="true" style="width:272px;height:32px;" v-decorator="[
                          'D1department',
                          {rules: [{ required: true, message: '请选择责任部门' }]}
                        ]">
                        <a-select-option value="D0">
                          D0
                        </a-select-option>
                        <a-select-option value="D1">
                          D1
                        </a-select-option>
                        <a-select-option value="D2">
                          D2
                        </a-select-option>
                        <a-select-option value="D3">
                          D3
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任人`">
                      <a-select placeholder="请选择" :allow-clear="true" style="width:272px;height:32px;" v-decorator="[
                          'D1user',
                          {rules: [{ required: true, message: '请选择责任人' }]}
                        ]">
                        <a-select-option value="D0">
                          D0
                        </a-select-option>
                        <a-select-option value="D1">
                          D1
                        </a-select-option>
                        <a-select-option value="D2">
                          D2
                        </a-select-option>
                        <a-select-option value="D3">
                          D3
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`附件`">
                      <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                        <a-button>
                          <a-icon type="upload" /> 上传文件
                        </a-button>
                      </a-upload>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div v-if="NeedFlage">
                <div class="processList clearfix">
                  <div class="processTitle"><span>*</span>请指定7钻分析责任人:</div>
                  <div class="processUl">
                    <ul>
                      <li class="clearfix">
                        <span>7钻流程</span>
                        <span>分析负责人</span>
                      </li>
                      <li class="clearfix">
                        <span>第1钻： 过程是否正确？</span>


                        <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'firstUser',

                              ]">
                          <a-select-option value="D0">
                            D0
                          </a-select-option>
                          <a-select-option value="D1">
                            D1
                          </a-select-option>
                          <a-select-option value="D2">
                            D2
                          </a-select-option>
                          <a-select-option value="D3">
                            D3
                          </a-select-option>
                        </a-select>

                      </li>
                      <li class="clearfix">
                        <span>第2钻： 工具是否正确？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'firstUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                      <li class="clearfix">
                        <span>第3钻： 物料是否正确？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'firstUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                      <li class="clearfix">
                        <span>第4钻： 物料规格检测？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'fourthUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                      <li class="clearfix">
                        <span>第5钻： 过程变更？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'FifthUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                      <li class="clearfix">
                        <span>第6钻： 部件变更？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'sixthUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                      <li class="clearfix">
                        <span>第7钻： 是否是极端复杂问题？</span>
                        <span>
                          <a-select placeholder="请选择" :allow-clear="true" style="width:200px;height:32px" v-decorator="[
                               'seventhUser',

                              ]">
                            <a-select-option value="D0">
                              D0
                            </a-select-option>
                            <a-select-option value="D1">
                              D1
                            </a-select-option>
                            <a-select-option value="D2">
                              D2
                            </a-select-option>
                            <a-select-option value="D3">
                              D3
                            </a-select-option>
                          </a-select>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
            <div class="analysisList clearfix">
              <div class="analysisTitle">
                <span>7钻分析</span>
              </div>
              <div class="analysisStep">
                <ul>
                  <li class="activefirst">
                    <span>第1钻</span>
                    <p>过程是否正确</p>
                    <div></div>
                  </li>
                  <li class="activefirst">
                    <div></div>
                    <span>第2钻</span>
                    <p>工具是否正确</p>
                    <div></div>
                  </li>
                  <li class="activefirst">
                    <div></div>
                    <span>第3钻</span>
                    <p>物料是否正确</p>
                    <div></div>
                  </li>
                  <li class="stepRemove">
                    <div></div>
                    <span>第4钻</span>
                    <p>物料规则检测</p>
                    <div></div>
                  </li>
                  <li>
                    <div></div>
                    <span>第5钻</span>
                    <p>过程变更</p>
                    <div></div>
                  </li>
                  <li class="active">
                    <div></div>
                    <span>第6钻</span>
                    <p>部件变更</p>
                    <div></div>
                  </li>
                  <li clasdataRecords="active">
                    <div></div>
                    <span>第7钻</span>
                    <p>是否是极端复杂问题</p>
                    <div></div>
                  </li>
                </ul>
              </div>
              <div class="analysisTable">
                <a-table row-key="id" :data-source="analysisData" :columns="columnsAnalysis" :pagination="false">
                  <span slot="operation" slot-scope="text, record">
                    <a href="javascript:;" @click=showAnalysis(record)>{{record.operation}}</a>
                  </span>

                </a-table>
              </div>
            </div>

          </div>


          <div class="Dcontent D1back" v-if="stepCurrent!=1&&backCurrent==1&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <div class="backTitle">
              <p>{{stepDetail.determine==='0'?'直接判定':'需要7钻分析'}}</p>
            </div>
            <div v-if="stepDetail.determine==='0'">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`责任部门`">
                    <p>{{stepDetail.D1department}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`责任人`">
                    <p>{{stepDetail.D1user}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`附件`" style="height:auto;">
                    <div class="stepFileList clearfix">
                      <ul class="fileList clearfix">
                        <li v-for="(item,index) in stepDetail.fileList" :title="item" :key="index">
                          <img src="/static/question/file.png">
                          <span>{{ item }}</span>
                        </li>

                      </ul>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div v-if="stepDetail.determine==='1'">
              <div class="processList clearfix">
                <div class="processTitle">7钻分析责任人:</div>
                <div class="processUl">
                  <ul>
                    <li class="clearfix">
                      <span>7钻流程</span>
                      <span>分析负责人</span>
                    </li>
                    <li class="clearfix">
                      <span>第1钻： 过程是否正确？</span>
                      <span>{{stepDetail.firstUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第2钻： 工具是否正确？</span>
                      <span>{{stepDetail.firstUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第3钻： 物料是否正确？</span>
                      <span>{{stepDetail.firstUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第4钻： 物料规格检测？</span>
                      <span>{{stepDetail.fourthUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第5钻： 过程变更？</span>
                      <span>{{stepDetail.FifthUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第6钻： 部件变更？</span>
                      <span>{{stepDetail.sixthUser}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第7钻： 是否是极端复杂问题？</span>
                      <span>{{stepDetail.seventhUser}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="Dcontent D2content" v-if="stepCurrent===2&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`根本原因（中英文）`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'rootcause',
                       {rules: [{ required: true, message: '请输入根本原因' }]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange" v-decorator="[
                      'D2file' ]">
                    <a-button>
                      <a-icon type="upload" /> 上传文件
                    </a-button>
                  </a-upload>

                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D2back" v-if="stepCurrent!=2&&backCurrent==2&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`根本原因（中英文）`">
                  <p>{{stepDetail.rootcause}}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`" style="height:auto;">
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li v-for="(item,index) in stepDetail.D2file" :title="item" :key="index">
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D3content" v-if="stepCurrent===3&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'shortMeasures',
                      {rules: [{validator: languageVer}]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施（中英文）`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'longMeasures',
                      {rules: [{ required: true, message: '请输入长期措施' },{validator: languageVer}]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`小批量验证`">
                  <a-input placeholder="请输入" style="width:572px;" v-decorator="[
                      'Smallbatch',
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                    <a-button>
                      <a-icon type="upload" /> 上传文件
                    </a-button>
                  </a-upload>

                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施计划日期`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'longMeasuresTime',

                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施验证计划日期:`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'VerificationTime',

                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`计划关闭日期`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'D3DateTime',

                    ]" />
                </a-form-item>
              </a-col>
            </a-row>

          </div>
          <div class="Dcontent D3back" v-if="stepCurrent!=3&&backCurrent==3&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施`">
                  <p>{{ stepDetail.shortMeasures }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施`">
                  <p>{{ stepDetail.longMeasures }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施计划日期`">
                  <p>{{ stepDetail.longMeasuresTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施验证计划日期:`">
                  <p>{{ stepDetail.VerificationTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`" style="height:auto;">
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li v-for="(item,index) in stepDetail.D3file" :title="item" :key="index">
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>

                    </ul>

                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`小批量验证`">
                  <p>{{stepDetail.Smallbatch}}</p>
                </a-form-item>

              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`计划关闭日期`">
                  <p>{{ stepDetail.D3DateTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>

          </div>
          <div class="Dcontent D4content" v-if="stepCurrent===4&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期效果(中英文)`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'ShortEffects',
                      {rules: [{validator: languageVer}]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施实施日期`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'shortMeasuresTime'
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施描述(中英文)`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'D4longMeasures',
                      {rules: [{ required: true, message: '请输入长期措施' },{validator: languageVer}]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                    <a-button>
                      <a-icon type="upload" /> 上传文件
                    </a-button>
                  </a-upload>

                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施日期`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'D4LMeasuresTime',
                     {rules: [{ required: true, message: '请输入长期措施实施日期' }]}
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>

          </div>
          <div class="Dcontent D4back" v-if="stepCurrent!=4&&backCurrent==4&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期效果`">
                  <p>{{ stepDetail.ShortEffects }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施实施日期`">
                  <p>{{ stepDetail.shortMeasuresTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施描述`">
                  <p>{{ stepDetail.D4longMeasures }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`" style="height:auto;">
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li v-for="(item,index) in stepDetail.D4file" :title="item" :key="index">
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>

                    </ul>

                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施日期`">
                  <p>{{ stepDetail.D4LMeasuresTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>


          </div>

          <div class="Dcontent D3back" v-if="stepCurrent!=5&&backCurrent==5&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`效果验证`">
                  <p>{{ stepDetail.EffectVerification }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left:220px;">
              <a-col :span="8">
                <a-form-item :label="`断点VIN`">
                  <p>{{ stepDetail.breakPointVIN }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item :label="`断点时间`">
                  <p>{{ stepDetail.breakPointTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否有ECN`">
                  <p>{{ stepDetail.ECN }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`FMEA是否更新`">
                  <p>{{ stepDetail.FMEA }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`控制计划是否更新`">
                  <p>{{ stepDetail.controlPlan }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left:220px;">
              <a-col :span="8">
                <a-form-item :label="`ECN号码`">
                  <p>{{ stepDetail.ECNtelphone }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item :label="`ECN状态`">
                  <p>{{ stepDetail.ECNStatus }}</p>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="21">
                <a-form-item :label="`备件处理方案`">
                  <p>{{ stepDetail.SpareParts }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否驳回`">
                  <p>{{ stepDetail.Reject }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`驳回理由`">
                  <p>{{ stepDetail.RejectReason }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`当前步骤计划完成日期`">
                  <p>{{ stepDetail.D5planTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`" style="height:auto;">
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li v-for="(item,index) in stepDetail.D5file" :title="item" :key="index">
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>

                    </ul>

                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D5content" v-if="stepCurrent===5&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`效果验证`">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'EffectVerification',
                      {rules: [{ required: true, message: '请输入效果验证' }]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload name="file" :multiple="true" :headers="headers" @change="handleChange">
                    <a-button>
                      <a-icon type="upload" /> 上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left:220px;">
              <a-col :span="8">
                <a-form-item :label="`断点VIN`">
                  <a-input placeholder="请输入" v-decorator="[
                      'breakPointVIN',
                      {
                        rules: [{ required: true, message: '请输入断点VIN' }]}
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item :label="`断点时间`">
                  <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:231px;" v-decorator="[
                      'breakPointTime',
                      {rules: [{ required: true, message: '请选择断点时间' }]}
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="fileUpdate clearfix">
              <a-col :span="21">
                <a-form-item :label="`涉及文件更新:`">
                  <div class="updateTable">
                    <a-table row-key="id" :data-source="updateData" :columns="columnsUpdate" :pagination="false">
                      <span slot="updateoperation" slot-scope="text, record">
                        <a href="javascript:;" @click=showUpdate(record)>{{record.updateoperation}}</a>
                      </span>
                    </a-table>
                    <div>
                      添加新的更新文件</div>
                  </div>
                </a-form-item>
              </a-col>
            </div>

          </div>
          <div class="Dcontent D6content" v-if="stepCurrent===6&&backFlag===false">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否需要进入再发防止库`">
                  <a-radio-group :options="PreventeRepositoryRadio" v-decorator="[
                      'PreventeRepository',
                      {rules: [{ required: true, message: '请选择是否需要进入再发防止库' }]}
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否同意关闭`">
                  <a-radio-group :options="AgreeCloseRadio" @change="CloseRadioChange" v-decorator="[
                      'AgreeClose',
                      {rules: [{ required: true, message: '请选择是否同意关闭' }]}
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`不同意关闭理由`" v-if="disAgree">
                  <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'disagreeReason',
                      {rules: [{ required: true, message: '请输入不同意关闭理由' }]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="Dcontent D3back" v-if="stepCurrent!=6&&backCurrent==6&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否需要进入再发防止库`">
                  <p>{{ stepDetail.PreventeRepository }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否同意关闭`">
                  <p>{{ stepDetail.AgreeClose }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`不同意关闭理由`">
                  <p>{{ stepDetail.disagreeReason }}</p>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-card>
    </a-form>
    <a-form class="ant-advanced-search-form">
      <a-collapse :bordered="false">
        <a-collapse-panel header="操作记录" key="0">

          <div id="fileAnchor">
            <a-table row-key="id" :data-source="dataRecord" :columns="columnsRecord"
              :pagination="{defaultPageSize: 10}">
            </a-table>
          </div>

        </a-collapse-panel>
      </a-collapse>

    </a-form>
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
  import EditableCell from '@@/question/view/EditableCell'

  const {
    mapActions
  } = createNamespacedHelpers('question');
  const columns = [{

    title: '序号',
    dataIndex: 'no',
    scopedSlots: {
      customRender: 'no'
    }
  }, {
    title: '附件名称',
    dataIndex: 'name',
    scopedSlots: {
      customRender: 'name'
    }
  }, {
    title: '上传时间',
    dataIndex: 'uploadTime',
    scopedSlots: {
      customRender: 'uploadTime'
    }
  }, {
    title: '上传人',
    dataIndex: 'uploadUser',
    scopedSlots: {
      customRender: 'uploadUser'
    }
  }, {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {
      customRender: 'operation'
    },
    width: 80
  }];

  const columnsRecord = [{

      title: '操作记录',
      dataIndex: 'recode',
      scopedSlots: {
        customRender: 'recode'
      }
    }, {
      title: '解决进度',
      dataIndex: 'progress',
      scopedSlots: {
        customRender: 'progress'
      }
    },
    {
      title: '变更人',
      dataIndex: 'user',
      scopedSlots: {
        customRender: 'user'
      }
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      scopedSlots: {
        customRender: 'operateTime'
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      scopedSlots: {
        customRender: 'remark'
      },
      width: 80
    }
  ];
  const columnsAnalysis = [{

      title: '标准要求',
      dataIndex: 'Standard',
      align: 'center',
      scopedSlots: {
        customRender: 'Standard'
      }
    }, {
      title: '实际情况',
      dataIndex: 'reality',
      align: 'center',
      scopedSlots: {
        customRender: 'reality'
      }
    },
    {
      title: '结论',
      dataIndex: 'conclusion',
      align: 'center',
      scopedSlots: {
        customRender: 'conclusion'
      }
    },
    {
      title: '附件',
      dataIndex: 'file',
      align: 'center',
      scopedSlots: {
        customRender: 'file'
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: {
        customRender: 'operation'
      },
      width: 80
    }
  ];
  const columnsUpdate = [{

      title: '文件名称',
      dataIndex: 'fileName',
      align: 'center',
      scopedSlots: {
        customRender: 'fileName'
      }
    }, {
      title: '是否更新',
      dataIndex: 'isUpdate',
      align: 'center',
      scopedSlots: {
        customRender: 'isUpdate'
      }
    },
    {
      title: '更新内容',
      dataIndex: 'updateContent',
      align: 'center',
      scopedSlots: {
        customRender: 'updateContent'
      }
    },
    {
      title: '附件',
      dataIndex: 'updatefile',
      align: 'center',
      scopedSlots: {
        customRender: 'updatefile'
      }
    },
    {
      title: '操作',
      dataIndex: 'updateoperation',
      scopedSlots: {
        customRender: 'updateoperation'
      },
      width: 80
    }
  ];
  export default {
    name: 'QuestionDetail',
    components: {
      EditableCell
    },
    props: ['id'],
    data() {
      return {
        // 再分配弹框
        ModalText: 'Content of the modal',
        RejectTrue: true,
        visible: false,
        visibleAnalysis: false, //7钻编辑弹框
        visibleDetail: false, //7钻详情
        confirmLoading: false,
        columns,
        columnsRecord,
        columnsAnalysis,
        columnsUpdate,
        AnalysisTitle: '1钻-过程是否正确',
        data: [],
        analysisData: [], //7钻分析表格
        updateData: [], //文件更新表格
        DetailForm: [], //7钻查看表格
        updateForm: null, //文件更新弹框表单
        dataFile: [], // 附件
        dataRecord: [], // 操作记录
        stepDetail: [], // 某个问题的步骤详细信息
        editFlag: false,
        expand: false,
        form: null,
        visibleUpdate: false,
        formDcontent: null, // 步骤表单
        rediStribution: null, // 再分配
        NeedFlage: false, //需要7钻标识
        userFlag: false, //7钻责任人列表显示标识
        AnalysisForm: null, //7钻分析表单
        satisfy: [{
          label: '是',
          value: '0'
        }, {
          label: '否',
          value: '1'
        }],
        contActionOption: [{
          label: '需要',
          value: '0'
        }, {
          label: '不需要',
          value: '1'
        }],
        conActionFlag: true, //围堵措施是否显示表示
        satisfyFlag: true, // 是否满足标识
        showMoreFlag: false, // 查看更多
        detailList: [],
        titleFlag: false, // 问题标题是否显示
        carTitle: '', // 车型标题
        functionTitle: '', // 功能标题，
        codeTitle: '', // 故障代码标题，
        stepCurrent: 5, // 当前步骤状态   从数据库读取状态
        backCurrent: 7, // 回退到的步骤数
        backFlag: false, // 是否点击回退
        disAgree: true, // 是否需要输入不同意关闭理由
        // D2
        radioDefault: 'Yes',
        determineRadio: [{
          label: '直接判定',
          value: '0'
        }, {
          label: '需要7钻分析',
          value: '1'
        }],
        // D5
        updateRadio: [{
          label: '是',
          value: '0'
        }, {
          label: '否',
          value: '1'
        }],
        // D6
        PreventeRepositoryRadio: [{
          label: '是',
          value: '0'
        }, {
          label: '否',
          value: '1'
        }],
        AgreeCloseRadio: [{
          label: '同意关闭',
          value: '0'
        }, {
          label: '不同意关闭',
          value: '1'
        }],
        headers: {
          authorization: 'authorization-text'
        },
        // 数据模板
        record: {
          //D0
          satisfyRadio: '0', //  是否满足立项条件
          dissatisfaction: '', // 不满足理由
          Remarks: '', // 备注
          containmentAction: '0', //是否需要围堵措施
          Measures: '', //围堵措施
          // D1
          D1department: [], //责任部门
          D1user: [], //责任人
          determine: '0', //判定
          //7钻责任人
          firstUser: [],
          fourthUser: [],
          FifthUser: [],
          sixthUser: [],
          seventhUser: [],
          //D2
          rootcause: '',
          D2file: [],
          // D3
          shortMeasures: '',
          longMeasures: '',
          longMeasuresTime: null,
          VerificationTime: null,
          D3DateTime: null,
          D3file: '',
          Smallbatch: '',
          // D4
          ShortEffects: '',
          shortMeasuresTime: null,
          D4longMeasures: null,
          D4LMeasuresTime: null,

          // D5
          EffectVerification: '',
          breakPointVIN: '',
          breakPointTime: null,

          // D6
          PreventeRepository: '1',
          AgreeClose: '1',
          disagreeReason: ''
        },
        // 再分配

        redistributionForm: {
          dtfUser: ''
        },
        //7钻分析弹框数据绑定
        recordAnalysis: {
          id: '',
          Standard: '',
          reality: '',
          conclusion: '',
          file: ''
        },
        //涉及文件更新
        recordUpdate: {
          id: '',
          fileName: '',
          isUpdate: '0',
          updateContent: '',
          updatefile: '',
        }

      };
    },

    created() {
      this.request();
      this.formDcontent = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'satisfyRadio', 'containmentAction', 'Measures', 'dissatisfaction', 'Remarks', 'planTime',
          'D1department', 'D1user', 'determine', 'firstUser', 'fourthUser', 'FifthUser', 'sixthUser',
          'seventhUser', 'rootcause', 'D2file', 'shortMeasures', 'longMeasures',
          'longMeasuresTime', 'VerificationTime', 'D3DateTime', 'D3file', 'Smallbatch',
          'ShortEffects', 'shortMeasuresTime', 'D4longMeasures', 'D4LMeasuresTime',
          'EffectVerification', 'breakPointVIN', 'breakPointTime', 'PreventeRepository', 'AgreeClose',
          'disagreeReason'
        ], 'record'),
        onValuesChange: autoUpdateFileds(this, 'record')
      });

      this.rediStribution = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, ['dtfUser'], 'redistributionForm'),
        onValuesChange: autoUpdateFileds(this, 'redistributionForm')
      });
      this.AnalysisForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'id', 'Standard', 'reality', 'conclusion', 'file'
        ], 'recordAnalysis'),
        onValuesChange: autoUpdateFileds(this, 'recordAnalysis')
      });
      this.updateForm = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'id', 'fileName', 'isUpdate', 'updateContent', 'updatefile'
        ], 'recordUpdate'),
        onValuesChange: autoUpdateFileds(this, 'recordUpdate')
      });
    },
    methods: {
      moment,
      ...mapActions([
        'addQuestion',
        'commitQuestion',
        'updateQuestion',
        'getFilePage',
        'getRecord',
        'getQuestionStep',
        'redistribute',
        'eidtQuestion',
        'getAnalysis'
      ]),
      //是否需要围堵措施
      conActionChange(e) {

        if (e.target.value === '0') {
          this.conActionFlag = true;
        } else {
          this.conActionFlag = false;
        }
      },
      // 是否驳回选择
      RejectRadioChange(e) {
        if (e.target.value === '0') {
          this.RejectTrue = true;
        } else {
          this.RejectTrue = false;
        }
      },
      showAnalysis(param) {
        this.visibleAnalysis = true;
        this.DetailForm = param
        this.AnalysisForm = this.$form.createForm(this, {

          mapPropsToFields: () => {
            return {
              id: this.$form.createFormField({
                value: param.id,
              }),
              Standard: this.$form.createFormField({
                value: param.Standard,
              }),
              reality: this.$form.createFormField({
                value: param.reality,
              }),
              conclusion: this.$form.createFormField({
                value: param.conclusion,
              }),
              file: this.$form.createFormField({
                value: param.file,
              }),
            };
          }

        });


      },
      showUpdate(param) {
        this.visibleUpdate = true;
        this.updateForm = this.$form.createForm(this, {

          mapPropsToFields: () => {
            return {
              id: this.$form.createFormField({
                value: param.id,
              }),
              fileName: this.$form.createFormField({
                value: param.fileName,
              }),
              isUpdate: this.$form.createFormField({
                value: param.isUpdate,
              }),
              updateContent: this.$form.createFormField({
                value: param.updateContent,
              }),
              updatefile: this.$form.createFormField({
                value: param.updatefile,
              })

            };
          }

        });
        console.log(this.updateForm);
      },
      //校验中英文
      languageVer(rule, value, callback) {
        let regzh = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        let zh = regzh.test(value);
        let regen = new RegExp("[a-zA-Z]+", "g");
        let en = regen.test(value);
        if (!zh || !en) {
          callback('必须同时含有中文和英文');
        } else {
          callback();
        }

      },
      //确定7钻分析弹框
      AnalysisOk() {

        this.AnalysisForm.validateFields((err, fieldsValue) => {
          if (!err) {

            const data = this.AnalysisForm.getFieldsValue();
            if (this.AnalysisForm === "") {
              data.id = this.AnalysisForm.id;
            }


            this.analysisData.forEach((item, index) => {

              if (item.id === data.id) {

                item.id = data.id;
                item.Standard = data.Standard;
                item.reality = data.reality;
                item.conclusion = data.conclusion;
                item.file = data.file;
                console.log(item);
              }
            })
            console.log(this.analysisData)
            this.visibleAnalysis = false;
          }
        });

      },
      AnalysisDetailOk() {
        this.visibleDetail = false;
      },
      AnalysisDetailCancel() {
        this.visibleDetail = false;
      },
      updateOk() {
        this.updateForm.validateFields((err, fieldsValue) => {
          if (!err) {

            this.visibleUpdate = false;
            const data = this.updateForm.getFieldsValue();

            this.updateData.forEach((item, index) => {

              if (item.id === data.id) {

                item.id = data.id;

                if (data.fileName) {
                  item.fileName = data.fileName
                }
                item.isUpdate = data.isUpdate;
                item.updateContent = data.updateContent;
                item.updatefile = data.updatefile;

              }
            })

          }
        });


      },
      updateCancel() {
        this.visibleUpdate = false;
      },
      //关闭7钻分析弹框
      AnalysisCancel() {
        this.visibleAnalysis = false;
      },
      // 是否同意关闭

      CloseRadioChange(e) {
        if (e.target.value === '0') {
          this.disAgree = false;
        } else {
          this.disAgree = true;
        }
      },
      request() {
        let param = {
          pageSize: 10,
          pageNo: 1,
        }

        //查看问题详情

        this.eidtQuestion(this.id).then(res => {
          this.detailList = res;
        })

        this.getAnalysis(this.id).then(res => {

          this.analysisData = res.list;

          if (this.analysisData.length == 0) {
            this.analysisData = [{

                "id": "8",
                Standard: '',
                reality: '',
                conclusion: '',
                file: '',
                operation: '编辑'
              },
              {
                "id": "9",
                Standard: '',
                reality: '',
                conclusion: '',
                file: '',
                operation: '编辑'

              },
              {
                "id": "10",
                Standard: '',
                reality: '',
                conclusion: '',
                file: '',
                operation: '编辑'

              },
            ];
          }
        })


        this.getFilePage().then(res => {
          this.dataFile = res.list;
        });
        this.getRecord().then(res => {

          this.dataRecord = res.list;
        });
        this.getQuestionStep(1).then(res => {

          this.stepDetail = res;

          this.updateData = res.updateList;

        });
      },
      // 再分配弹框
      showModal() {
        this.visible = true
      },
      handleOk(e) {
        this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false
      },
      //是否需要7钻分析
      determineChange(e) {
        if (e.target.value === '0') {
          this.NeedFlage = false;
        } else if (e.target.value === '1') {
          this.NeedFlage = true;
        }
      },
      // 车型选择
      vehicleModelIdChange(value) {
        this.carTitle = value;

        if (value) {
          this.titleFlag = true;
        }
      },
      // 回退到param步
      goto(param) {
        this.backCurrent = param;

        if (this.backCurrent < this.stepCurrent) {
          this.backFlag = true;
        } else {
          this.backFlag = false;
        }
      },
      // tab栏切换
      callback(key) {

      },
      // 查看更多
      showMore() {
        this.showMoreFlag = !this.showMoreFlag;
      },

      // 所属功能选择
      functionChange(value) {
        this.functionTitle = value;
        if (value) {
          this.titleFlag = true;
        }
      },
      faultCodeChange(value) {
        this.codeTitle = value;
        if (value) {
          this.titleFlag = true;
        }
      },
      handleSubmit(e) {
        this.formDcontent.validateFields((err, fieldsValue) => {
          if (!err) {

            const data = this.formDcontent.getFieldsValue();
            let name = 'submit';
            this.addQuestion(data).then(res => {

              this.$message.success('提交成功');
              //隐藏7钻责任人模块
              this.userFlag = false;

            });
          }
        });
      },
      // 再分配提交
      handleUser(e) {
        this.rediStribution.validateFields((err, fieldsValue) => {
          if (!err) {
            const data = this.rediStribution.getFieldsValue();
            this.redistribute(data).then(res => {
              this.ModalText = 'The modal will be closed after two seconds';

              setTimeout(() => {
                this.visible = false;
              }, 2000);
            });
          }
        });
      },
      handleSave() {
        const data = this.form.getFieldsValue();
        this.addQuestion(data).then(res => {

        });
      },
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFields((error, values) => {});
      },

      handleChange() {},
      levelChange(value) {
        console.log(`selected ${value}`);
      },
      handleReset() {
        this.form.resetFields();
      },

      toggle() {
        this.expand = !this.expand;
      },
      // 点击编辑按钮
      editDetail() {
        this.editFlag = true;
        let name = "edit"
        let id=this.id
        this.$router.push({
          name: 'QuestionCreate',
          params: {
            name,
            id
          }
        })
      },
      // 是否满足立项条件切换
      satisfyChange(e) {

        this.record.containmentAction = '0';
        if (e.target.value === '0') {
          this.satisfyFlag = true;
        } else if (e.target.value === '1') {
          this.satisfyFlag = false;
        }
      }
    }
  };
</script>
<style lang="less">
  .visibleDetail {
    .ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }

    }
  }
</style>
<style lang="less" scoped>
  #components-form-demo-advanced-search {

    // .UserModal{
    //  /deep/.ant-modal-footer{
    //       padding:10px 5px;
    //        /deep/.ant-btn-loading{
    //        padding-left:0!important;
    //      }
    //  }
    // }


    /deep/.editable-cell-icon-check {
      position: absolute;
      margin-left: 2px;
      margin-top: 6px;
    }


    .showMore {
      font-family: SourceHanSansCN-Normal;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      letter-spacing: 0;
      height: 53px;
      line-height: 53px;
      float: right;
      right: 52px;
      width: 82px;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .gotoFile {
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: #0098e0;
      letter-spacing: 0;
      margin-left: 16px;
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

    .step {
      width: 690px;
      height: 4px;
      margin-top: 40px;
      margin-left: 20px;
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
    }

    .baseMessage {
      font-family: SourceHanSansCN-Medium;
      font-size: 14px;
      color: #000;
      margin-left: 18px;
      margin-top: 16px;
      margin-bottom: 16px;
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

    .submitBtn {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: left;
      line-height: 22px;
      background: #0097e0;
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
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      border-radius: 4px;
    }
  }

  .Dcontent {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    border-radius: 4px;
    margin-top: 70px;
    padding-top: 28px;
    position: relative;
    width: 1076px;
    height: auto;

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
      font-family: SourceHanSansCN-Normal;
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
          font-family: PingFangSC-Regular;
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

  .D0back {
    /deep/ .ant-form-item {
      height: 46px;
      line-height: 46px;
      margin-bottom: 0;
      margin-left: 22px;
      margin-right: 22px;
    }

    /deep/.ant-form-item-label {
      height: 46px;
      line-height: 46px;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;

      label {
        color: rgba(0, 0, 0, 0.45);
      }
    }

    p {
      height: 46px;
      line-height: 46px;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
    }
  }

  .D1back {
    /deep/.ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }

  .D2back {
    padding-top: 28px;

    /deep/.ant-form-item {
      margin-bottom: 0;
    }

    /deep/.ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    em {
      font-family: SourceHanSansCN-Normal;
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
  }

  .analysisList {
    .analysisTitle {
      margin-left: 40px;

      span {
        font-family: SourceHanSansCN-Medium;
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
        width: 134px;
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
          width: 134px;
          padding-right: 24px;
          text-align: right;

          div {
            height: 4px;
            width: 134px;

          }

          span {
            font-family: SourceHanSansCN-Medium;
            font-size: 14px;
          }

          p {
            font-family: SourceHanSansCN-Normal;
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
    float: left;
    width: 798px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    margin-left: 65px;

    /deep/.ant-table-thead>tr>th {
      background: rgba(0, 0, 0, 0.02);
    }

  }

  .updateTable {
    float: left;
    width: 572px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    margin-top: 5px;

    /deep/.ant-table-thead>tr>th {
      background: rgba(0, 0, 0, 0.02);
    }
  }

  .D3back,
  .D4back {
    padding-top: 28px;

    /deep/.ant-form-item {
      margin-bottom: 0;
    }

    /deep/.ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    em {
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      font-style: normal;
    }

    p {
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .detailText {
    /deep/.ant-form-item {
      margin-bottom: 0;
    }

    /deep/.ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
      }

      p {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
      }
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
      background: #0097e0;
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
    margin: 14px auto;

    .rightButton {
      float: right;
      margin: 24px 0;
      margin-right: 24px;
    }

    .backButton {
      float: left;
      margin: 24px 0;
      margin-left: 24px;
    }
  }

  .clearfix {
    overflow: hidden;
    *zoom: 1;
  }

  .ant-advanced-search-form {
    padding: 24px;
    border-radius: 6px;
    margin-top: -40px;

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
    line-height: 28px;
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
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      margin-left: 122.4px;
      margin-right: 20px;

      span {
        display: inline-block;
        margin-right: 4px;
        content: '*';
        font-family: SimSun;
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
      }

    }

    .processUl {
      float: left;
      border: 1px solid rgba(0, 0, 0, 0.09);
      border-radius: 4px;

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
          font-family: SourceHanSansCN-Medium;
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
          font-family: PingFangSC-Regular;
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
</style>