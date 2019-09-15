<template>
  <div id="components-form-demo-advanced-search">
    <a-modal
      title="再分配"
      :visible="visible"
      @ok="handleUser"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="rediStribution"
      >
        <a-col :span="18">
          <a-form-item :label="`选择责任人`">
            <a-select
              placeholder="请选择"
              :allow-clear="true"
              v-decorator="[
                'dtfUser',
                {rules: [{ required: true, message: '请选择责任人' }]}
              ]"
            >
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
    <a-modal
      :title="AnalysisTitle"
      :visible="visibleAnalysis"
      @ok="AnalysisOk"
      @cancel="AnalysisCancel"
      width="600px"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="AnalysisForm"
      >
        <a-row v-show="false">
          <a-col :span="22">
            <a-form-item :label="`id`">
              <a-textarea
                style="width:340px;height:56px;"
                placeholder="请输入"
                v-decorator="[
                  'id',
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`标准要求`">
              <a-textarea
                style="width:340px;height:56px;"
                placeholder="请输入"
                v-decorator="[
                  'standard',
                  {rules: [{ required: true, message: '请输入标准要求' }]}
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`实际情况`">
              <a-textarea
                style="width:340px;height:56px;"
                placeholder="请输入"
                v-decorator="[
                  'actualSituation',
                  {rules: [{ required: true, message: '请输入实际情况' }]}
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`结论`">
              <a-textarea
                style="width:340px;height:56px;"
                placeholder="请输入"
                v-decorator="[
                  'conclusion',
                  {rules: [{ required: true, message: '请输入结论' }]}
                ]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item label="附件">
              <a-upload
                name="file"
                :multiple="true"
                :headers="headers"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload" />
                  上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      :title="AnalysisTitle"
      :visible="visibleDetail"
      wrap-class-name="visibleDetail"
      @ok="AnalysisDetailOk"
      @cancel="AnalysisDetailCancel"
      width="600px"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="DetailForm"
      >
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
            <a-form-item
              :label="`标准要求`"
              style="margin-bottom:0;"
            >
              <p>
                {{ DetailForm.standard }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              :label="`实际情况`"
              style="margin-bottom:0;"
            >
              <p>
                {{ DetailForm.actualSituation }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="10">
            <a-form-item
              :label="`结论`"
              style="margin-bottom:0;"
            >
              <p>
                {{ DetailForm.conclusion }}
              </p>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item
              label="附件"
              style="margin-bottom:0;color: rgba(0,0,0,0.45);font-size: 14px;height:auto;"
            >
              <div class="stepFileList clearfix">
                <ul class="fileList clearfix">
                  <li
                    v-for="(item,index) in stepDetail.fileList"
                    :title="item"
                    :key="index"
                  >
                    <img src="/static/question/file.png">
                    <span>
                      {{ item }}
                    </span>
                  </li>
                </ul>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      :title="fileModalTitle"
      :visible="visibleUpdate"
      @ok="updateOk"
      @cancel="updateCancel"
      width="600px"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="updateForm"
      >
        <a-row v-show="false">
          <a-col :span="17">
            <a-form-item :label="`id`">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'id',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-show="fileNameFlag">
          <a-col :span="17">
            <a-form-item :label="`文件名称`">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'fileName',
                  {rules:[{required: true,message: '请输入文件名称'}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="17">
            <a-form-item
              :label="`是否更新`"
              style="margin-bottom:0;"
            >
              <a-radio-group
                :options="updateRadio"

                v-decorator="[
                  'isUpdae',
                  {rules:[{required: true,message: '请选择是否更新'}]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item
              :label="`更新内容`"
            >
              <a-textarea
                placeholder="请输入"
                style="width:340px; height:56px;"

                v-decorator="[
                  'updateContent',
                  {rules:[{required: true,message: '请输入更新内容'}]}
                ]"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="18">
            <a-form-item
              :label="`附件`"
            >
              <a-upload
                name="file"

                :multiple="true"

                :headers="headers"

                @change="handleChange"
              >
                <a-button>
                  <a-icon
                    type="upload"
                  />
                  上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <div class="TopButton">
      <div class="backButton">
        <a-button
          slot="tabBarExtraContent"
          class="backBtn"
          @click="goBack"
        >
          <img src="/static/question/back.png" />
          返回
        </a-button>
      </div>
      <div class="rightButton">
        <a-button
          html-type="submit"
          @click="showModal"
          v-if="stepCurrent!=6"
        >
          再分配
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
          class="submitBtn"
        >
          提交
        </a-button>

        <a-button
          style="marginLeft: 8px"
          @click="handleSave"
          class="saveBtn"
        >
          保存
        </a-button>
        <a-button
          style="marginLeft: 8px"
          @click="handleReset"
          class="cancelBtn"
        >
          取消
        </a-button>
      </div>
    </div>
    <a-form
      class="ant-advanced-search-form"
      :form="form"
      @submit="handleSearch"
    >
      <a-card
        title="问题详情"
        class="cardTitle"
      >
        <img
          src="/static/question/editIcon.png"
          class="editIcon"
          @click="editDetail"
        >
        <!-- <div class="baseMessage">
          基本信息
        </div> -->
        <!-- <div class="edit" v-if="editFlag">
        </div> -->
        <div class="detailText clearfix">
          <div class="baseMessage">
            基本信息
          </div>
          <div class="pageTitle">
            <span>问题标题：</span>
            <!-- <span class="carTitle">{{ detailList.vehicleModelId }}</span> -->
            <!-- <span class="functionTitle">{{ detailList.function }}</span>
            <span class="codeTitle">{{ detailList.code }}</span> -->
            <span class="carTitle">
              {{ detailList.title }}
            </span>
          </div>

          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`车型`">
                <p>{{ detailList.vehicleModelName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`所属系统`">
                <p>{{ detailList.faultTreeIds1Name }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`所属功能`">
                <p>{{ detailList.faultTreeIds2Name }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`故障代码`">
                <p style="width:164px;">
                  {{ detailList.faultTreeIds3Name }}
                </p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`问题分类`">
                <p>{{ detailList.sourceName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题等级`">
                <p>{{ detailList.gradeName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题阶段`">
                <p>{{ detailList.projectPhaseName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`故障发生日期`">
                <p>{{ detailList.failureDate }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`生产基地`">
                <p>{{ detailList.manufactureBaseName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`责任部门`">
                <p>{{ detailList.responsibleDepartmentName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题频次`">
                <p>{{ detailList.frequency }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item
                :label="`联系人电话`"
                class="quesetionContact"
              >
                <p>{{ detailList.contact }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item :label="`创建人`">
                <p>{{ detailList.creatorName }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`创建部门`">
                <p>{{ detailList.creatorDept }}</p>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="`问题提报日期:`">
                <p>{{ detailList.createDate }}</p>
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
              <a-form-item
                class="form-item-flex-2"
                :label="`问题描述`"
                :label-col="{span:2}"
              >
                <p>{{ detailList.description }}</p>
              </a-form-item>
            </a-col>
            <div
              class="showMore"
              @click="showMore"
              v-if="!showMoreFlag"
            >
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
                  <p>{{ detailList.testTypeName }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`祸首件`">
                  <p>{{ detailList.firstCausePartName }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`零件号`">
                  <p>{{ detailList.partName }}</p>
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
                  <p>{{ detailList.maintenanceStation }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`故障里程`">
                  <p>{{ detailList.milage }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`VIN`">
                  <p>{{ detailList.vinNo }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :label="`生产时间`">
                  <p>{{ detailList.productDate }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item :label="`备注`">
                  <p>{{ detailList.remark }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <div
              class="showMore"
              @click="showMore"
              v-if="showMoreFlag"
            >
              <span>收起</span>
              <img src="/static/question/retractIcon.png">
            </div>
          </div>
        </div>
      </a-card>
    </a-form>
    <a-form
      class="ant-advanced-search-form"
      :form="formDcontent"
    >
      <a-card
        title="问题流程"
        class="cardTitle"
      >
        <a-input-number v-model="stepCurrent"></a-input-number>
        <div class="ant-advanced-search-form">
          <div class="step">
            <a-steps :current="stepCurrent">
              <a-popover
                slot="progressDot"
                slot-scope="{index, status}"
              >
                <template slot="content">
                  <span>step {{index}} status: {{status}}</span>
                </template>
                <span class="new-steps-icon">
                  <img
                    v-if="index < stepCurrent"
                    src="/static/img/shixinyuan.png"
                  />
                  <img
                    v-if="index === stepCurrent"
                    src="/static/img/kongxinyuan.png"
                  />
                  <img
                    v-if="stepCurrent < index"
                    src="/static/img/huiseyuan.png"
                  />
                </span>
              </a-popover>
              <a-step
                title="问题定义"
                @click="goto(0)"
              />
              <a-step
                title="责任判定"
                @click="goto(1)"
              />
              <a-step
                title="原因分析"
                @click="goto(2)"
              />
              <a-step
                title="措施判定"
                @click="goto(3)"
              />
              <a-step
                title="措施实施"
                @click="goto(4)"
              />
              <a-step
                title="效果验证"
                @click="goto(5)"
              />
              <a-step
                title="问题关闭"
                @click="goto(6)"
              />
            </a-steps>
          </div>
          <div
            class="Dcontent D0content"
            v-if="stepCurrent===0&&backFlag===false"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否立项`">
                  <a-radio-group
                    :options="satisfy"
                    @change="satisfyChange"
                    v-decorator="[
                      'isProject',
                      {rules: [{ required: true, message: '请选择是否立项' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <div v-if="!satisfyFlag">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`理由`">
                    <a-textarea
                      placeholder="请输入"
                      v-decorator="[
                        'dissatisfaction',
                        {rules: [{ required: true, message: '请输入理由' }]}
                      ]"
                    ></a-textarea>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div v-if="satisfyFlag">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`是否需要围堵措施`">
                    <a-radio-group
                      :options="contActionOption"
                      @change="conActionChange"
                      v-decorator="[
                        'isNeedIca',
                        {rules: [{ required: true, message: '请选择是否立项' }]}
                      ]"
                    />

                    <a-radio-group :options="contActionOption"
                                   @change='conActionChange'
                                   v-decorator="['isNeedIca',{rules: [{ required: true, message: '请选择是否立项' }]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="conActionFlag">
                <a-col :span="21">
                  <a-form-item :label="`围堵措施`">
                    <a-textarea placeholder="请输入"
                                style="width:572px;height:88px;"
                                v-decorator="[ 'icaDescription',{rules: [{ required: true, message: '请输入围堵措施' }]}]"></a-textarea>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload
                    name="files"
                    :multiple="true"
                    :headers="headers"
                    @change="handleChange"
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D0back"
            v-if="stepCurrent!=0&&backCurrent==0&&backFlag"
          >
            <div
              class="triangle_border_up"
              style="left:80px;"
            >
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`立项条件`">
                  <p>{{ problemDefinitionData.isProject==='0'?'是':'否' }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <div v-if="problemDefinitionData.isProject==='0'">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`需要围堵措施`">
                    <p>{{ problemDefinitionData.isNeedIca }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="problemDefinitionData.isNeedIca==='0'">
                <a-col :span="21">
                  <a-form-item :label="`围堵措施`">
                    <p>{{ problemDefinitionData.icaDescription }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div v-if="stepDetail.isProject==='1'">
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
                <a-form-item
                  :label="`附件`"
                  style="height:auto;"
                >
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li
                        v-for="(item,index) in stepDetail.fileList"
                        :title="item"
                        :key="index"
                      >
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
              <a-row style="margin-left:340px;">
                <a-col :span="21">
                  <a-form-item>
                    <a-radio-group :options="determineRadio" @change="determineChange" v-decorator="[ 'determine']"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <div v-if="!NeedFlage">
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任部门`">
                      <net-select url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                                  :transform="selectOption"
                                  :delay="true"
                                  placeholder="请选择"
                                  :allow-clear="true"
                                  style="width:272px;height:32px;"
                                  v-decorator="['owerDeptLv1',{rules: [{ required: true, message: '请选择责任部门' }]} ]">
                      </net-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任人`">
                      <net-select
                        :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&deptId=${record.owerDeptLv1}`"
                        :transform="selectOptionChampion"
                        :delay="true"
                        placeholder="请选择"
                        :allow-clear="true"
                        style="width:272px;height:32px;"
                        v-decorator="[ 'champion',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                      </net-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`附件`">
                      <a-upload
                        name="file"
                        :multiple="true"
                        :headers="headers"
                        @change="handleChange"
                      >
                        <a-button>
                          <a-icon type="upload" />
                          上传文件
                        </a-button>
                      </a-upload>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div v-if="NeedFlage">
                <div class="processList clearfix">
                  <div class="processTitle">
                    <span>*</span>请指定7钻分析责任人:
                  </div>
                  <div class="processUl">
                    <ul>
                      <li class="clearfix">
                        <span>7钻流程</span>
                        <span>分析负责人</span>
                      </li>
                      <li class="clearfix">
                        <span>第1钻： 过程是否正确？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                            :transform="selectOptionChampion"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>

                      </li>
                      <li class="clearfix">
                        <span>第2钻： 工具是否正确？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                            :transform="selectOptionChampion"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
                      </li>
                      <li class="clearfix">
                        <span>第3钻： 物料是否正确？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                            :transform="selectOptionChampion"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
                      </li>
                      <li class="clearfix">
                        <span>第4钻： 物料规格检测？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=SQE`"
                            :transform="selectOptionChampion"
                            :delay="true"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser4',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
                      </li>
                      <li class="clearfix">
                        <span>第5钻： 过程变更？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=ME`"
                            :transform="selectOptionChampion"
                            :delay="true"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser5',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
                      </li>
                      <li class="clearfix">
                        <span>第6钻： 部件变更？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=TC`"
                            :transform="selectOptionChampion"
                            :delay="true"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser6',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
                      </li>
                      <li class="clearfix">
                        <span>第7钻： 是否是极端复杂问题？</span>
                        <a-form-item>
                          <net-select
                            :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=TFT`"
                            :transform="selectOptionChampion"
                            :delay="true"
                            placeholder="请选择"
                            :allow-clear="true"
                            style="width:200px;height:32px"
                            v-decorator="['zuanUser7',{rules: [{ required: true, message: '请选择责任人' }]} ]">
                          </net-select>
                        </a-form-item>
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
                <div>
                  <a-row>
                   <span>审核结果：</span>
                  </a-row>
                  <a-row>
                    <a-form-item :label="'审批：'">
                      <label>不通过</label>
                    </a-form-item>
                  </a-row>
                  <a-row>
                    <a-form-item :label="'不通过原因：'">
                      <label>不通过</label>
                    </a-form-item>
                  </a-row>
                </div>
                <div>
                  <a-row>
                    <a-form-item>
                      <span>6钻分析</span>
                    </a-form-item>
                  </a-row>
                </div>
                <a-table
                  row-key="id"
                  :data-source="analysisData"
                  :columns="columnsAnalysis"
                  :pagination="false"
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
                </a-table>
                <div>
                  <a-form-item>
                    <span>
                      审核
                    </span>
                  </a-form-item>
                  <a-row>
                    <a-col :span="21">
                      <a-form-item :label="'审核：'">
                        <a-radio-group :options="verifyRadio"
                                       v-decorator="[ 'verifySeven',{rules: [{ required: true, message: '请选择审核结果' }]}]"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <div v-if=" record.verifySeven==='0' ">
                    <a-row>
                      <a-col :span="21">
                        <a-form-item :label="'结束7钻分析：'">
                          <a-radio-group :options="endSevenRadio"
                                         v-decorator="[ 'endSeven',{rules: [{ required: true, message: '请选择是否结束7钻' }]}]"/>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <div v-if=" record.endSeven==='0' ">
                      <a-row>
                        <a-col :span="21">
                          <a-form-item :label="'责任部门：'">
                            <net-select url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                                        :transform="selectOption"
                                        :delay="true"
                                        placeholder="请选择"
                                        :allow-clear="true"
                                        style="width:272px;height:32px;"
                                        v-decorator="['owerDeptLv1',{rules: [{ required: true, message: '请选择责任部门' }]}]">
                            </net-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col :span="21">
                          <a-form-item :label="'责任人：'">
                            <net-select
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&deptId=${record.owerDeptLv1}`"
                              :transform="selectOptionChampion"
                              :delay="true" placeholder="请选择"
                              :allow-clear="true"
                              style="width:272px;height:32px;"
                              v-decorator="['champion',{rules: [{ required: true, message: '请选择责任部门' }]} ]">
                            </net-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </div>
                  </div>

                  <a-row v-if="record.verifySeven==='1'">
                    <a-col :span="21">
                      <a-form-item :label="'不通过原因：'">
                        <a-textarea placeholder="请输入"
                                    v-decorator="['icaDescription',{rules: [{ required: true, message: '请输不通过原因' }]} ]">
                        </a-textarea>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </div>

          </div>
          <div class="Dcontent D1back" v-if="stepCurrent!=1&&backCurrent==1&&backFlag">
            <div class="triangle_border_up">
              <span></span>
            </div>
            <div class="backTitle">
              <p>{{issueDefinitionData.type==='0'?'直接判定':'需要7钻分析'}}</p>
            </div>
            <div v-if="issueDefinitionData.type==='0'">
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`责任部门`">
                    <p>{{issueDefinitionData.owerDeptLv1}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`责任人`">
                    <p>{{issueDefinitionData.champion}}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`附件`" style="height:auto;">
                    <div class="stepFileList clearfix">
                      <ul class="fileList clearfix">
                        <li v-for="(item,index) in issueDefinitionData.fileList" :title="item" :key="index">
                          <img src="/static/question/file.png">
                          <span>{{ item }}</span>
                        </li>

                      </ul>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div v-if="issueDefinitionData.type==='1'">
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
                      <span>{{issueDefinitionData.zuanUser1}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第2钻： 工具是否正确？</span>
                      <span>{{issueDefinitionData.zuanUser1}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第3钻： 物料是否正确？</span>
                      <span>{{issueDefinitionData.zuanUser1}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第4钻： 物料规格检测？</span>
                      <span>{{issueDefinitionData.zuanUser4}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第5钻： 过程变更？</span>
                      <span>{{issueDefinitionData.zuanUser5}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第6钻： 部件变更？</span>
                      <span>{{issueDefinitionData.zuanUser6}}</span>
                    </li>
                    <li class="clearfix">
                      <span>第7钻： 是否是极端复杂问题？</span>
                      <span>{{issueDefinitionData.zuanUser7}}</span>
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
                      'rootCauseDescription',
                       {rules: [{ required: true, message: '请输入根本原因' }]}
                    ]"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload
                    name="files"
                    :multiple="true"
                    :headers="headers"
                    @change="handleChange"
                    v-decorator="[
                      'D2file'
                    ]"
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D2back"
            v-if="stepCurrent!=2&&backCurrent==2&&backFlag"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`根本原因（中英文）`">
                  <p>{{ stepDetail.rootCauseDescription }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item
                  :label="`附件`"
                  style="height:auto;"
                >
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li
                        v-for="(item,index) in stepDetail.D2file"
                        :title="item"
                        :key="index"
                      >
                        <img src="/static/question/file.png">
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D3content"
            v-if="stepCurrent===3&&backFlag===false"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施`">
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'icaDescription',
                      {rules: [{validator: languageVer}]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施（中英文）`">
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'pcaDescription',
                      {rules: [
                        { required: true, message: '请输入长期措施' },
                        {validator: languageVer}
                      ]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`小批量验证`">
                  <a-input
                    placeholder="请输入"
                    style="width:572px;"
                    v-decorator="[
                      'smallBatchValidation',
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload
                    name="file"
                    :multiple="true"
                    :headers="headers"
                    @change="handleChange"
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item
                  :label="`长期措施实施计划日期`"
                >
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'pcaPlanTime',
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施验证计划日期:`">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'pcaExecTime ',
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`计划关闭日期`">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'estimatedClosureTime',
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D3back"
            v-if="stepCurrent!=3&&backCurrent==3&&backFlag"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <div class="examine">
              <div>审核结果</div>
              <a-radio-group :options="recurrencePreventionRadio" v-decorator="[
                      'recurrencePrevention',
                      {rules: [{ required: true, message: '请选择是否需要进入再发防止库' }]}
                    ]"/>
            </div>
            <div>措施判定</div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施`">
                  <p>{{ stepMeasures.icaDescription }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施`">
                  <p>{{ stepDetail.pcaDescription }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施计划日期`">
                  <p>{{ stepDetail.pcaPlanTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施验证计划日期:`">
                  <p>{{ stepDetail.pcaExecTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item
                  :label="`附件`"
                  style="height:auto;"
                >
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li
                        v-for="(item,index) in stepDetail.fileList"
                        :title="item"
                        :key="index"
                      >
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
                  <p>{{ stepDetail.smallBatchValidation }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`计划关闭日期`">
                  <p>{{ stepDetail.estimatedClosureTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D4content"
            v-if="stepCurrent===4&&backFlag===false"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期效果(中英文)`">
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'icaExecDescription',
                      {rules: [{validator: languageVer}]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施实施日期`">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'icaExecTime'
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施描述(中英文)`">
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'pcaDescription',
                      {rules: [
                        { required: true, message: '请输入长期措施' },
                        {validator: languageVer}
                      ]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload
                    name="file"
                    :multiple="true"
                    :headers="headers"
                    @change="handleChange"
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施日期`">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'pcaExecTime',
                      {rules: [{ required: true, message: '请输入长期措施实施日期' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D4back"
            v-if="stepCurrent!=4&&backCurrent==4&&backFlag"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期效果`">
                  <p>{{ stepImplementation.icaExecDescription }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`短期措施实施日期`">
                  <p>{{ stepImplementation.icaExecTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`长期措施实施描述`">
                  <p>{{ stepImplementation.pcaDescription }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item
                  :label="`附件`"
                  style="height:auto;"
                >
                  <div class="stepFileList clearfix">
                    <ul class="fileList clearfix">
                      <li
                        v-for="(item,index) in stepDetail.fileList"
                        :title="item"
                        :key="index"
                      >
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
                  <p>{{ stepImplementation.pcaExecTime }}</p>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <div
            class="Dcontent D5back"
            v-if="stepCurrent!=5&&backCurrent==5&&backFlag"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`效果验证`">
                  <p>{{ stepEffect.description }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left:220px;">
              <a-col :span="8">
                <a-form-item :label="`断点VIN`">
                  <p>{{ stepEffect.breakpointVin }}</p>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item :label="`断点时间`">
                  <p>{{ stepEffect.breakpointDate }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item :label="`涉及文件更新:`">
              <div class="updateTable">
                <a-table
                  row-key="id"
                  :data-source="updateData"
                  :columns="columnsUpdate"
                  :pagination="false"
                >
                  <span
                    slot="id"
                    slot-scope="text, row"
                  >
                    <a
                      href="javascript:;"
                      @click="showUpdate(row)"
                    >查看</a>
                  </span>
                </a-table>
              </div>
            </a-form-item>


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

            <!-- <a-row>
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
             -->
          </div>
          <div
            class="Dcontent D5content"
            v-if="stepCurrent===5&&backFlag===false"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`效果验证`">
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'description',
                      {rules: [{ required: true, message: '请输入效果验证' }]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`附件`">
                  <a-upload
                    name="file"
                    :multiple="true"
                    :headers="headers"
                    @change="handleChange"
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传文件
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-left:220px;">
              <a-col :span="8">
                <a-form-item :label="`断点VIN`">
                  <a-input
                    placeholder="请输入"
                    v-decorator="[
                      'breakpointVin ',
                      {rules: [{ required: true, message: '请输入断点VIN' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item :label="`断点时间`">
                  <a-date-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    style="width:231px;"
                    v-decorator="[
                      'breakpointDate ',
                      {rules: [{ required: true, message: '请选择断点时间' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="fileUpdate clearfix">
              <a-col :span="21">
                <a-form-item :label="`涉及文件更新:`">
                  <div class="updateTable">
                    <a-table
                      row-key="id"
                      :data-source="updateData"
                      :columns="columnsUpdate"
                      :pagination="false"
                    >
                      <span
                        slot="id"
                        slot-scope="text, row"
                      >
                        <a
                          href="javascript:;"
                          @click="showUpdate(row)"
                        >查看</a>
                      </span>
                    </a-table>
                    <div
                      style="text-align:center;"
                      @click="showUpdate()"
                    >
                      <a-icon type="plus-circle" />
                      添加新的更新文件
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </div>
          </div>
          <div
            class="Dcontent D6content"
            v-if="stepCurrent===6&&backFlag===false"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否需要进入再发防止库`">
                  <a-radio-group
                    :options="recurrencePreventionRadio"
                    v-decorator="[
                      'recurrencePrevention',
                      {rules: [{ required: true, message: '请选择是否需要进入再发防止库' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否同意关闭`">
                  <a-radio-group
                    :options="isCloseRadio"
                    @change="CloseRadioChange"
                    v-decorator="[
                      'isClose',
                      {rules: [{ required: true, message: '请选择是否同意关闭' }]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item
                  :label="`不同意关闭理由`"
                  v-if="disAgree"
                >
                  <a-textarea
                    placeholder="请输入"
                    style="width:572px;height:88px;"
                    v-decorator="[
                      'reason ',
                      {rules: [{ required: true, message: '请输入不同意关闭理由' }]}
                    ]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div
            class="Dcontent D6back"
            v-if="stepCurrent!=6&&backCurrent==6&&backFlag"
          >
            <div class="triangle_border_up">
              <span></span>
            </div>

            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否需要进入再发防止库`">
                  <p>{{ stepClose.recurrencePrevention }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`是否同意关闭`">
                  <p>{{ stepClose.isClose }}</p>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="21">
                <a-form-item :label="`不同意关闭理由`">
                  <p>{{ stepClose.reason }}</p>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-card>
    </a-form>
    <a-form class="ant-advanced-search-form">
      <a-collapse :bordered="false">
        <a-collapse-panel
          header="操作记录"
          key="0"
        >
          <div id="fileAnchor">
            <a-table
              row-key="id"
              :data-source="dataRecord"
              :columns="columnsRecord"
              :pagination="{defaultPageSize: 10}"
            >
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

const {
  mapActions
} = createNamespacedHelpers('question');
const columns = [
  {
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
const columnsRecord = [
  {
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
  dataIndex: 'standard',
  align: 'center',
  scopedSlots: {
    customRender: 'standard'
  }
}, {
  title: '实际情况',
  dataIndex: 'actualSituation',
  align: 'center',
  scopedSlots: {
    customRender: 'actualSituation'
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
  dataIndex: 'isUpdae',
  align: 'center',
  scopedSlots: {
    customRender: 'isUpdae'
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
  dataIndex: 'fileList',
  align: 'center',
  scopedSlots: {
    customRender: 'fileList'
  }
},
{
  title: '操作',
  dataIndex: 'id',
  scopedSlots: {
    customRender: 'id'
  },
  width: 80
}
];
export default {
  name: 'QuestionDetail',
  components: {
    // EditableCell: () => import('@@/question/view/EditableCell'),
    NetSelect: () => import('@comp/form/NetSelect.vue')
  },
  props: ['id'],
  data () {
    const that = this
    return {
      userId: that.$store.getters.getUser().id,
      // 再分配弹框
      ModalText: 'Content of the modal',
      fileModalTitle: '添加更新文件',
      RejectTrue: true,
      analysisId: '',
      fileNameFlag: true,
      visible: false,
      visibleAnalysis: false, // 7钻编辑弹框
      visibleDetail: false, // 7钻详情
      confirmLoading: false,
      optCounter: '',
      columns,
      columnsRecord,
      columnsAnalysis,
      columnsUpdate,
      AnalysisTitle: '1钻-过程是否正确',
      data: [],
      analysisData: [
        {
          standard: '标准',
          actualSituation: '实际情况',
          conclusion: '结论',
          file: '文件',
          operation: '编辑'
        },
        {
          standard: '标准',
          actualSituation: '实际情况',
          conclusion: '结论',
          file: '文件',
          operation: '编辑'
        },
        {
          standard: '标准',
          actualSituation: '实际情况',
          conclusion: '结论',
          file: '文件',
          operation: '编辑'
        }
      ], // 7钻分析表格
      updateData: [], // 文件更新表格
      DetailForm: [], // 7钻查看表格
      updateForm: null, // 文件更新弹框表单
      dataFile: [], // 附件
      dataRecord: [], // 操作记录
      stepDetail: [], // 某个问题的步骤详细信息
      stepMeasures: [], // 措施详细信息
      stepImplementation: [],
      stepEffect: [],
      problemDefinitionData: {},
      issueDefinitionData: {},
      stepClose: [],
      editFlag: false,
      expand: false,
      form: null,
      coChair: null,
      monitor: null,
      visibleUpdate: false,
      formDcontent: null, // 步骤表单
      rediStribution: null, // 再分配
      NeedFlage: false, // 需要7钻标识
      userFlag: true, // 7钻责任人列表显示标识
      AnalysisForm: null, // 7钻分析表单
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
      conActionFlag: true, // 围堵措施是否显示表示
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
      verifyRadio: [{
        label: '通过',
        value: '0'
      }, {
        label: '不通过',
        value: '1'
      }],
      endSevenRadio: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
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
      recurrencePreventionRadio: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
        value: '1'
      }],
      isCloseRadio: [{
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
        // D0
        isProject: '0', //  是否满足立项条件
        dissatisfaction: '', // 不满足理由
        Remarks: '', // 备注
        isNeedIca: '0', // 是否需要围堵措施
        icaDescription: '', // 围堵措施
        // D1
        owerDeptLv1: [], // 责任部门
        champion: [], // 责任人
        type: '0', // 判定
        verifySeven: '2', // 7钻审核
        sevenFailReason: '', // 不通过原因
        // 7钻责任人
        zuanUser1: [],
        zuanUser4: [],
        zuanUser5: [],
        zuanUser6: [],
        zuanUser7: [],
        // D2
        rootCauseDescription: '',
        D2file: [],
        // D3
        // icaDescription: '',
        pcaDescription: '',
        pcaPlanTime: null,
        pcaExecTime: null,
        estimatedClosureTime: null,
        fileList: '',
        smallBatchValidation: '',
        // D4
        icaExecDescription: '',
        icaExecTime: null,
        // pcaDescription: null,
        // pcaExecTime: null,


        // D5
        description: '',
        breakpointVin: '',
        breakpointDate: null,

        // D6
        recurrencePrevention: '1',
        isClose: '1',
        reason: ''
      },
      // 再分配

      redistributionForm: {
        dtfUser: ''
      },
      // 7钻分析弹框数据绑定
      recordAnalysis: {
        id: '',
        standard: '',
        actualSituation: '',
        conclusion: '',
        file: ''
      },
      // 涉及文件更新
      recordUpdate: {
        id: '',
        fileName: '',
        isUpdae: '0',
        updateContent: '',
        fileList: ''
      }

    };
  },
  created () {
    this.formDcontent = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, [
        'isProject', 'isNeedIca', 'icaDescription', 'dissatisfaction', 'Remarks', 'planTime',
        'owerDeptLv1', 'champion', 'type', 'zuanUser1', 'zuanUser4', 'zuanUser5', 'zuanUser6',

        'zuanUser7', 'rootcause', 'D2file', 'icaDescription', 'pcaDescription',
        'pcaDescriptionTime', 'pcaExecTime', 'estimatedClosureTime', 'fileList', 'smallBatchValidation',
        'icaExecDescription', 'icaExecTime', 'pcaDescription', 'pcaExecTime',
        'description', 'breakpointVin', 'breakpointDate', 'recurrencePrevention', 'isClose',
        'reason'
      ], 'record'),
      onValuesChange: autoUpdateFileds(this, 'record')
    });
    this.rediStribution = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, ['dtfUser'], 'redistributionForm'),
      onValuesChange: autoUpdateFileds(this, 'redistributionForm')
    });
    this.AnalysisForm = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, [
        'id', 'standard', 'actualSituation', 'conclusion', 'file'
      ], 'recordAnalysis'),
      onValuesChange: autoUpdateFileds(this, 'recordAnalysis')
    });
    this.updateForm = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, [
        'id', 'fileName', 'isUpdae', 'updateContent', 'fileList'
      ], 'recordUpdate'),
      onValuesChange: autoUpdateFileds(this, 'recordUpdate')
    });
    this.request();
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
      'getSysUser',
      'sevenDiamonds',
      'analysisSave',
      'analysisDetail'
    ]),
    // 是否需要围堵措施
    conActionChange (e) {
      if (e.target.value === '0') {
        this.conActionFlag = true;
      } else {
        this.conActionFlag = false;
      }
    },
    goBack () {
      this.$router.push({
        path: this.$route.query.form || '/'
      });
    },
    // 是否驳回选择
    RejectRadioChange (e) {
      if (e.target.value === '0') {
        this.RejectTrue = true;
      } else {
        this.RejectTrue = false;
      }
    },
    selectOption (input, option) {
      const optionArray = [];

        input.forEach((item) => {

          optionArray.push({
            value: item.id,
            label: item.name
          })
        })

        return optionArray;
      },
      selectOptionChampion(input, option) {
        let optionArray = [];
        input.forEach((item) => {
          optionArray.push({
            value: item.userId,
            label: item.username
          })
        })
        return optionArray;
      },

      showAnalysis(param) {

        this.visibleAnalysis = true;
        this.DetailForm = param
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
         }*/


      this.AnalysisForm = this.$form.createForm(this, {

        mapPropsToFields: () => {
          return {
            id: this.$form.createFormField({
              value: param.id
            }),
            standard: this.$form.createFormField({
              value: param.standard
            }),
            actualSituation: this.$form.createFormField({
              value: param.actualSituation
            }),
            conclusion: this.$form.createFormField({
              value: param.conclusion
            }),
            file: this.$form.createFormField({
              value: param.file
            })
          };
        }

      });
    },
    showUpdate (param) {
      this.visibleUpdate = true;
      if (param) {
        this.fileNameFlag = false;
        this.fileModalTitle = param.fileName;
        this.updateForm = this.$form.createForm(this, {
          mapPropsToFields: () => {
            return {
              id: this.$form.createFormField({
                value: param.id
              }),
              fileName: this.$form.createFormField({
                value: param.fileName
              }),
              isUpdae: this.$form.createFormField({
                value: param.isUpdae
              }),
              updateContent: this.$form.createFormField({
                value: param.updateContent
              }),
              fileList: this.$form.createFormField({
                value: param.fileList != null ? param.fileList.length : 0
              })
            };
          }
        });
      } else {
        this.fileNameFlag = true;
      }
    },
    // 校验中英文
    languageVer (rule, value, callback) {
      const regzh = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
      const zh = regzh.test(value);
      const regen = new RegExp('[a-zA-Z]+', 'g');
      const en = regen.test(value);
      if (!zh || !en) {
        callback(new Error('必须同时含有中文和英文'));
      } else {
        callback();
      }
    },
    // 确定7钻分析弹框
    AnalysisOk () {
      this.AnalysisForm.validateFields((err, fieldsValue) => {
        if (!err) {
          const data = this.AnalysisForm.getFieldsValue();
          if (this.AnalysisForm === '') {
            data.id = this.AnalysisForm.id;
          }
          this.sevenDiamonds(data).then(res => {
            console.info(res)
          })
          /* this.analysisData.forEach((item, index) => {
              if (item.id === data.id) {
                item.id = data.id;
                item.standard = data.standard;
                item.actualSituation = data.actualSituation;
                item.conclusion = data.conclusion;
                item.file = data.file;
                console.log(item);
              }
            }) */
          this.visibleAnalysis = false;
        }
      });
    },
    AnalysisDetailOk () {
      this.visibleDetail = false;
    },
    AnalysisDetailCancel () {
      this.visibleDetail = false;
    },
    updateOk () {
      this.updateForm.validateFields((err, fieldsValue) => {
        if (!err) {
          this.visibleUpdate = false;
          // const data = this.updateForm.getFieldsValue();

          if (this.fileNameFlag === true) {
            const data = this.updateForm.getFieldsValue();
            data.issueId = this.id;
            if (!data.id) {
              this.addFile(data).then(() => {
                this.updateFile(this.id).then(res => {
                  this.updateData = res;
                })
              })
            } else {
              this.editFile(data).then(() => {
                this.updateFile(this.id).then(res => {
                  this.updateData = res;
                })
              })
            }
          } else {
            const data = this.updateForm.getFieldsValue();
            data.issueId = this.id;
            data.fileName = this.fileModalTitle;
            if (!data.id) {
              this.addFile(data).then(() => {
                this.updateFile(this.id).then(res => {
                  this.updateData = res;
                })
              })
            } else {
              this.editFile(data).then(() => {
                this.updateFile(this.id).then(res => {
                  this.updateData = res;
                })
              })
            }
          }
        }
      });
    },
    updateCancel () {
      this.visibleUpdate = false;
    },
    // 关闭7钻分析弹框
    AnalysisCancel () {
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
      const param = {
        pageSize: 10,
        pageNo: 1
      }
      // 查看问题详情
      this.eidtQuestion(this.id).then(res => {
        this.detailList = res;
      })
      this.getAnalysis(this.id).then(res => {
        this.analysisData = res.list;
        if (this.analysisData.length === 0) {
          this.analysisData = [{
            id: '8',
            standard: '',
            actualSituation: '',
            conclusion: '',
            file: '',
            operation: '编辑'
          },
          {
            id: '9',
            standard: '',
            actualSituation: '',
            conclusion: '',
            file: '',
            operation: '编辑'
          },
          {
            id: '10',
            standard: '',
            actualSituation: '',
            conclusion: '',
            file: '',
            operation: '编辑'
          }
          ];
        }
      })
      this.getFilePage().then(res => {
        this.dataFile = res.list;
      });
      this.getRecord().then(res => {
        this.dataRecord = res.list;
      });
      this.getQuestionStepAll(this.id);
    },
    getQuestionStepAll (id) {
      this.getQuestionStep(this.id).then(res => {
        this.stepDetail = res;
        // this.updateData = res.updateList;
      });
      this.problemDefinition(id).then(res => {
        this.problemDefinitionData = res || {};
        this.updateData = res.updateList;
      });
      this.issueDefinition(id).then(res => {
        this.issueDefinitionData = res || {};
        // this.analysisData = res.sevenDiamondsVos
      });

      this.updateFile(this.id).then(res => {
        if (res.length === 0) {
          const param = {
            issueId: this.id
          };
          this.firstCreateFile(param).then(updateData => {
            this.updateData = updateData;
          });
        } else {
          this.updateData = res;
        }
      });

      this.MeasureDetail(this.id).then(res => {
        this.stepMeasures = res;
      })
      this.ImplementationDetail(this.id).then(res => {
        this.stepImplementation = res;
      })
      this.effectDetail(this.id).then(res => {
        this.stepEffect = res;
      })
      this.analysisDetail(this.id).then(res => {
        if (res) {
          this.analysisId = res.id;
        }
      })
    },
    // 再分配弹框
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel (e) {
      this.visible = false
    },
    // 是否需要7钻分析
    determineChange (e) {
      if (e.target.value === '0') {
        this.NeedFlage = false;
      } else if (e.target.value === '1') {
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
    // 回退到param步
    goto (param) {
      this.backCurrent = param;
      if (this.backCurrent < this.stepCurrent) {
        this.backFlag = true;
        if (param === 3) {
          this.MeasureDetail(this.id).then(res => {
            this.stepMeasures = res;
          });
        } else if (param === 4) {
          this.ImplementationDetail(this.id).then(res => {
            this.stepImplementation = res;
          });
        } else if (param === 5) {
          this.effectDetail(this.id).then(res => {
            this.stepEffect = res;
          })
        } else if (param === 6) {
          this.closeDetail(this.id).then(res => {
            this.stepClose = res;
          })
        }
      } else {
        this.backFlag = false;
      }
    },
    // tab栏切换
    callback (key) {
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
    handleSubmit (e) {
      // this.handleSave()
      const vm = this
      vm.coChair = vm.coChair ? vm.coChair : vm.getSysUser(vm.detailList.sourceName, 'coChairStepMonitor').id;
      vm.monitor = vm.monitor ? vm.monitor : vm.getSysUser(vm.detailList.sourceName, 'stepMonitor').id;
      this.formDcontent.validateFields((err, fieldsValue) => {
        if (!err) {
          const data = this.formDcontent.getFieldsValue();
          const transData = {
            businessKey: this.id, // 问题id
            businessTitle: data.title, // 问题title
            processDefinitionKey: 'BJEV1', // BJEV1  固定值
            subSys: 'irs', //  子系统编号
            taskId: null, //  任务id
            userId: this.userId, //  当前用户id
            variables: {
              assigner: data.zuanUser1,
              coChair: vm.coChair,
              monitor: vm.monitor,
              isDirectSerious: '0',
              isPass: '0',
              isQZEnd: '0',
              isAB: (data.gradeName === 'A' || data.gradeName === 'B') ? '1' : '0',
              isQZ: '0',
              isCheckError: '0',
              isLeaderSign: '0',
              isItem: data.isProject,
              zuanUser1: data.zuanUser1,
              zuanUser4: data.zuanUser4,
              zuanUser5: data.zuanUser5,
              zuanUser6: data.zuanUser6,
              zuanUser7: data.zuanUser7
            }
          }
          vm.workFlowSubmit(transData).then(res => {
            vm.$message.success('提交成功');
            // 隐藏7钻责任人模块
            // vm.userFlag = false;
          });
        }
      });
    },
    // 再分配提交
    handleUser (e) {
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
    handleSave () {
      const data = this.formDcontent.getFieldsValue();
      data.issueId = this.id;
      data.optCounter = this.optCounter;
      // data.optCounter = this.problemDefinitionData.optCounter
      if (this.stepCurrent === 0) {
        this.problemDefinitionAdd(data).then(res => {
          this.problemDefinitionData = res
          this.optCounter = res.optCounter;
        })
      }
      if (this.stepCurrent === 1) {
        this.issueDefinitionAdd(data).then(res => {
          this.optCounter = res.optCounter;
        })
      }
      if (this.stepCurrent === 2) {
        data.id = this.analysisId;
        this.analysisSave(data).then(res => {
          this.optCounter = res.optCounter;
        })
      }
      data.issueId = this.id;

      if (data.estimatedClosureTime) {
        data.estimatedClosureTime = data.estimatedClosureTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.pcaExecTime) {
        data.pcaExecTime = data.pcaExecTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (data.pcaPlanTime) {
        data.pcaPlanTime = data.pcaPlanTime.format('YYYY-MM-DD HH:mm:ss');
      }

      if (this.stepCurrent === 3) {
        this.MeasureDecisionSave(data).then(() => {
          this.MeasureDetail(this.id).then(res => {
            this.stepMeasures = res;
            //  data.optCounter=res.optCounter;
          });
        });
      } else if (this.stepCurrent === 4) {
        this.MeasureDecisionSave(data).then(() => {
          this.ImplementationDetail(this.id).then(res => {
            this.stepImplementation = res;
            //  data.optCounter=res.optCounter;
          });
        });
      } else if (this.stepCurrent === 5) {
        this.effectSave(data).then(res => {
          //  data.optCounter=res.optCounter;
        })
      } else if (this.stepCurrent === 6) {
        this.closeSave(data).then(res => {
          // data.optCounter=res.optCounter;
        })
      }
    },
    handleSearch (e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
      });
    },

    handleChange () {
    },
    levelChange (value) {
      console.log(`selected ${value}`);
    },
    handleReset () {
      this.form.resetFields();
    },

    toggle () {
      this.expand = !this.expand;
    },
    // 点击编辑按钮
    editDetail () {
      this.editFlag = true;
      const name = 'edit'
      const id = this.id
      this.$router.push({
        name: 'QuestionCreate',
        params: {
          name,
          id
        },
        query: {
          form: this.$route.path
        }
      })
    },
    // 是否满足立项条件切换
    satisfyChange (e) {
      this.record.isNeedIca = '0';
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
  .new-steps-icon {
    line-height: 1;
    top: -6px;
    position: relative;
    left: -3px;
  }

  #components-form-demo-advanced-search {

    // .UserModal{
    //  /deep/.ant-modal-footer{
    //       padding:10px 5px;
    //        /deep/.ant-btn-loading{
    //        padding-left:0!important;
    //      }
    //  }
    // }

    /deep/ .editable-cell-icon-check {
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

    /deep/ .ant-form-item-label {
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
    /deep/ .ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
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

    /deep/ .ant-table-thead > tr > th {
      background: rgba(0, 0, 0, 0.02);
    }

  }

  .updateTable {
    float: left;
    width: 572px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    margin-top: 5px;

    /deep/ .ant-table-thead > tr > th {
      background: rgba(0, 0, 0, 0.02);
    }
  }

  .D3back,
  .D4back {
    padding-top: 28px;

    /deep/ .ant-form-item {
      margin-bottom: 0;
    }

    /deep/ .ant-form-item-label {
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
    /deep/ .ant-form-item {
      margin-bottom: 0;
    }

    /deep/ .ant-form-item-label {
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

  /deep/ .ant-card-head-title {
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
