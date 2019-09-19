<template>
  <div id="components-form-demo-advanced-search">
    <a-modal
      title="再分配"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :mask-closable="false"
      @ok="handleUser"
      @cancel="handleCancel"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="rediStribution"
        style="height:50px;margin-top:20px;"
      >
        <a-col :span="24">
          <a-form-item :label="`选择责任人`">
            <net-select
              v-decorator="[ 'champion',{rules: [{ required: true, message: '请选择责任人' }]} ]"
              url="/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT"
              :transform="selectOptionChampion"
              :delay="true"
              placeholder="请选择"
              :allow-clear="true"
              style="width:272px;height:32px;"
            >
            </net-select>
          </a-form-item>
        </a-col>
      </a-form>
    </a-modal>
    <a-modal
      title="驳回（7钻分析之前)"
      :visible="visibleReject"
      :mask-closable="false"
      @ok="RejectSubmit"
      @cancel="CancelReject"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="rejectForm"
        style="height:60px;margin-top:10px;"
      >
        <a-col :span="24">
          <a-form-item :label="`理由`">
            <v-textarea
              v-decorator="[ 'comment',{rules: [{ required: true, message: '请选择理由' }]} ]"
              placeholder="请输入"
              :allow-clear="true"
            />
            </net-select>
          </a-form-item>
        </a-col>
      </a-form>
    </a-modal>
    <a-modal
      style="top:200px;!important"
      :title="AnalysisTitle"
      :visible="visibleAnalysis"
      width="600px"
      :mask-closable="false"
      @ok="AnalysisOk"
      @cancel="AnalysisCancel"
    >
      <a-form
        class="ant-advanced-search-form"
        :form="AnalysisForm"
      >
        <a-row v-show="false">
          <a-col :span="22">
            <a-form-item :label="`id`">
              <v-textarea
                v-decorator="[
                  'id',
                ]"
                style="width:340px;height:56px;"
                placeholder="请输入"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`标准要求`">
              <v-textarea
                v-decorator="[
                  'standard',
                  {rules: [{ required: true, message: '请输入标准要求' }]}
                ]"
                style="width:340px;height:56px;"
                placeholder="请输入"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`实际情况`">
              <v-textarea
                v-decorator="[
                  'actualSituation',
                  {rules: [{ required: true, message: '请输入实际情况' }]}
                ]"
                style="width:340px;height:56px;"
                placeholder="请输入"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <a-form-item :label="`结论`">
              <v-textarea
                v-decorator="[
                  'conclusion',
                  {rules: [{ required: true, message: '请输入结论' }]}
                ]"
                style="width:340px;height:56px;"
                placeholder="请输入"
                allow-clear
              />
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
      style="top:200px;!important"
      :title="AnalysisTitle"
      :visible="visibleDetail"
      wrap-class-name="visibleDetail"
      width="600px"
      :mask-closable="false"
      @ok="AnalysisDetailOk"
      @cancel="AnalysisDetailCancel"
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
                    :key="index"
                    :title="item"
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
      style="top:200px;!important"
      :title="fileModalTitle"
      :visible="visibleUpdate"
      width="600px"
      :mask-closable="false"
      @ok="updateOk"
      @cancel="updateCancel"
    >
      <div class="fileEdit">
        <a-form
          class="ant-advanced-search-form"
          :form="updateForm"
        >
          <a-row v-show="false">
            <a-col :span="17">
              <a-form-item :label="`id`">
                <v-input
                  v-decorator="[
                    'id',
                  ]"
                  placeholder="请输入"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="fileNameFlag">
            <a-col :span="17">
              <a-form-item :label="`文件名称`">
                <v-input
                  v-decorator="[
                    'fileName',
                    {rules:[{required: true,message: '请输入文件名称'}]}
                  ]"
                  placeholder="请输入"
                  allow-clear
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
                  v-decorator="[
                    'isUpdae',
                    {rules:[{required: true,message: '请选择是否更新'}]}
                  ]"

                  :options="updateRadio"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="22">
              <a-form-item
                :label="`更新内容`"
              >
                <v-textarea
                  v-decorator="[
                    'updateContent',
                    {rules:[{required: true,message: '请输入更新内容'}]}
                  ]"
                  placeholder="请输入"
                  allow-clear
                  style="width:340px; height:56px;"
                />
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
      </div>
      <!-- <div class="fileEdit"
           style="display:none;"
      >
        <a-form
          class="ant-advanced-search-form"
          :form="updateForm"
        >
          <a-row v-show="false">
            <a-col :span="17">
              <a-form-item :label="`id`">
                <p v-if="updateData.id">
                  {{ updateData.id }}
                </p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="fileNameFlag">
            <a-col :span="17">
              <a-form-item :label="`文件名称`">
                <p>{{ updateData.fileName }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="17">
              <a-form-item
                :label="`是否更新`"
                style="margin-bottom:0;"
              >
                <p>{{ updateData.isUpdae }}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="22">
              <a-form-item
                :label="`更新内容`"
              >
                <p>{{ updateData.updateContent }}</p>
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
      </div> -->
    </a-modal>
    <a-affix
      :offset-top="64"
      @change="offsetChange"
    >
      <div class="top-buttons">
        <div class="backButton">
          <a-button
            v-if="pagePermission.button_back_3"
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
            v-if="pagePermission.button_allocation_3"
            html-type="submit"
            @click="showModal"
          >
            再分配
          </a-button>
          <a-button
            v-if="pagePermission.button_redistribution_3"
            type="primary"
            html-type="submit"
            class="submitBtn"
            @click="handleReject"
          >
            再分析
          </a-button>
          <a-button
            v-if="pagePermission.button_submit_3"
            type="primary"
            html-type="submit"
            class="submitBtn"
            @click="handleSubmit"
          >
            提交
          </a-button>
          <!-- <a-button
            v-if="pagePermission.button_commit_3"
            style="marginLeft: 8px"
            class="saveBtn"
            @click="handleSave"
          >
            保存
          </a-button> -->
          <a-button
            style="marginLeft: 8px"
            class="saveBtn"
            @click="handleSave"
          >
            保存
          </a-button>
          <a-button
            v-if="pagePermission.button_cancel_3"
            style="marginLeft: 8px"
            class="cancelBtn"
            @click="handleReset"
          >
            取消
          </a-button>
        </div>
      </div>
    </a-affix>
    <div class="formConetnt">
      <div class="messageForm">
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
              <div class="pageTitle clearfix">
                <span>问题标题：</span>
                <!-- <span class="carTitle">{{ detailList.vehicleModelId }}</span> -->
                <!-- <span class="functionTitle">{{ detailList.function }}</span>
            <span class="codeTitle">{{ detailList.code }}</span> -->
                <span class="carTitle">
                  {{ detailList.title }}
                </span>
                <span style="float:right;margin-right:100px;">编号：{{ detailList.code }}</span>
              </div>

              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`车型`">
                    <p v-if="detailList.vehicleModelName">
                      {{ detailList.vehicleModelName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`所属系统`">
                    <p v-if="detailList.faultTreeIds1Name">
                      {{ detailList.faultTreeIds1Name }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`所属功能`">
                    <p v-if="detailList.faultTreeIds2Name">
                      {{ detailList.faultTreeIds2Name }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`故障代码`">
                    <p
                      v-if="detailList.faultTreeIds3Name"
                      style="width:164px;"
                    >
                      {{ detailList.faultTreeIds3Name }}
                    </p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`问题分类`">
                    <p v-if="detailList.sourceName">
                      {{ detailList.sourceName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题等级`">
                    <p v-if="detailList.gradeName">
                      {{ detailList.gradeName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题阶段`">
                    <p v-if="detailList.projectPhaseName">
                      {{ detailList.projectPhaseName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`故障发生日期`">
                    <p v-if="detailList.failureDate">
                      {{ detailList.failureDate }}
                    </p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`生产基地`">
                    <p v-if="detailList.manufactureBaseName">
                      {{ detailList.manufactureBaseName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`责任部门`">
                    <p v-if="detailList.responsibleDepartmentName">
                      {{ detailList.responsibleDepartmentName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题频次`">
                    <p v-if="detailList.frequency">
                      {{ detailList.frequency }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    :label="`联系人电话`"
                    class="quesetionContact"
                  >
                    <p v-if="detailList.contact">
                      {{ detailList.contact }}
                    </p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item :label="`创建人`">
                    <p v-if="detailList.creatorName">
                      {{ detailList.creatorName }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`创建部门`">
                    <p v-if="detailList.creatorDept">
                      {{ detailList.creatorDept }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`问题提报日期:`">
                    <p v-if="detailList.createDate">
                      {{ detailList.createDate }}
                    </p>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="`附件`">
                    <img src="/static/question/file.png">
                    <span
                      v-if="detailList.fileList"
                      class="fileListNumber"
                    >{{ detailList.fileList.length }}</span>
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
                    <p v-if="detailList.description">
                      {{ detailList.description }}
                    </p>
                  </a-form-item>
                </a-col>
                <div
                  v-if="!showMoreFlag"
                  class="showMore"
                  @click="showMore"
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
                      <p v-if="detailList.testTypeName">
                        {{ detailList.testTypeName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`祸首件`">
                      <p v-if="detailList.firstCausePartName">
                        {{ detailList.firstCausePartName }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`零件号`">
                      <p v-if="detailList.partName">
                        {{ detailList.partName }}
                      </p>
                    </a-form-item>
                  </a-col>

                  <a-col :span="6">
                    <a-form-item :label="`供应商名称`">
                      <p v-if="detailList.supplierName">
                        {{ detailList.supplierName }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item :label="`软件版本号`">
                      <p v-if="detailList.softwareVersion">
                        {{ detailList.softwareVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`标定版本号`">
                      <p v-if="detailList.calibrationVersion">
                        {{ detailList.calibrationVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`硬件版本号`">
                      <p v-if="detailList.hardwareVersion">
                        {{ detailList.hardwareVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`配置字版本号`">
                      <p v-if="detailList.confirmationVersion">
                        {{ detailList.confirmationVersion }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item :label="`维修网点`">
                      <p v-if="detailList.maintenanceStation">
                        {{ detailList.maintenanceStation }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`故障里程`">
                      <p v-if="detailList.milage">
                        {{ detailList.milage }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`VIN`">
                      <p v-if="detailList.vinNo">
                        {{ detailList.vinNo }}
                      </p>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item :label="`生产时间`">
                      <p v-if="detailList.productDate">
                        {{ detailList.productDate }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="24">
                  <a-col :span="6">
                    <a-form-item :label="`备注`">
                      <p v-if="detailList.remark">
                        {{ detailList.remark }}
                      </p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <div
                  v-if="showMoreFlag"
                  class="showMore"
                  @click="showMore"
                >
                  <span>收起</span>
                  <img src="/static/question/retractIcon.png">
                </div>
              </div>
            </div>
          </a-card>
        </a-form>
      </div>
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
                    <span>step {{ index }} status: {{ status }}</span>
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
                  style="cursor:pointer;"
                  @click="goto(0)"
                />
                <a-step
                  title="责任判定"
                  style="cursor:pointer;"
                  @click="goto(1)"
                />
                <a-step
                  title="原因分析"
                  style="cursor:pointer;"
                  @click="goto(2)"
                />
                <a-step
                  title="措施判定"
                  style="cursor:pointer;"
                  @click="goto(3)"
                />
                <a-step
                  title="措施实施"
                  style="cursor:pointer;"
                  @click="goto(4)"
                />
                <a-step
                  title="效果验证"
                  style="cursor:pointer;"
                  @click="goto(5)"
                />
                <a-step
                  title="问题关闭"
                  style="cursor:pointer;"
                  @click="goto(6)"
                />
              </a-steps>
            </div>
            <div
              v-if="stepCurrent===0&&backFlag===false"
              class="Dcontent D0content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`是否立项`">
                    <a-radio-group
                      v-decorator="[
                        'isProject',
                        {rules: [{ required: true, message: '请选择是否立项' }]}
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
                    <a-form-item :label="`理由`">
                      <a-textarea
                        v-decorator="[
                          'dissatisfaction',
                          {rules: [{ required: true, message: '请输入理由' }]}
                        ]"
                        placeholder="请输入"
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
                        v-decorator="[
                          'isNeedIca',
                          {rules: [{ required: true, message: '请选择是否立项' }]}
                        ]"
                        :options="contActionOption"
                        @change="conActionChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row v-if="conActionFlag">
                  <a-col :span="21">
                    <a-form-item :label="`围堵措施`">
                      <a-textarea
                        v-decorator="[ 'icaDescription',{rules: [{ required: true, message: '请输入围堵措施' }]}]"
                        placeholder="请输入"
                        style="width:572px;height:88px;"
                      ></a-textarea>
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
              v-if="stepCurrent!=0&&backCurrent==0&&backFlag"
              class="Dcontent D0back"
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
                    <p>{{ problemDefinitionData.isProject===1?'是':'否' }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <div v-if="problemDefinitionData.isProject===1">
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`需要围堵措施`">
                      <p>{{ problemDefinitionData.isNeedIca }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row v-if="problemDefinitionData.isNeedIca===1">
                  <a-col :span="21">
                    <a-form-item :label="`围堵措施`">
                      <p>{{ problemDefinitionData.icaDescription }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div v-if="stepDetail.isProject===0">
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
                          :key="index"
                          :title="item"
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
              v-if="stepCurrent===1&&backFlag===false"
              class="Dcontent D1content"
            >
              <div
                class="triangle_border_up"
                style="left:216px;"
              >
                <span></span>
              </div>
              <div v-if="userFlag">
                <a-row style="margin-left:340px;">
                  <a-col :span="21">
                    <a-form-item>
                      <a-radio-group
                        v-decorator="[ 'type']"
                        :options="determineRadio"
                        @change="determineChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div v-if="!NeedFlage">
                  <a-row>
                    <a-col :span="21">
                      <a-form-item :label="`责任部门`">
                        <net-select
                          v-decorator="['owerDeptLv1',{rules: [{ required: true, message: '请选择责任部门' }]} ]"
                          url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                          :transform="selectOption"
                          :delay="true"
                          placeholder="请选择"
                          :allow-clear="true"
                          style="width:272px;height:32px;"
                        >
                        </net-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="21">
                      <a-form-item :label="`责任人`">
                        <net-select
                          v-decorator="[ 'champion',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                          :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=${record.owerDeptLv1}`"
                          :transform="selectOptionChampion"
                          :delay="true"
                          placeholder="请选择"
                          :allow-clear="true"
                          style="width:272px;height:32px;"
                        >
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
                              v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                              :transform="selectOptionChampion"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第2钻： 工具是否正确？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                              :transform="selectOptionChampion"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第3钻： 物料是否正确？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser1',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=MD`"
                              :transform="selectOptionChampion"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第4钻： 物料规格检测？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser4',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=SQE`"
                              :transform="selectOptionChampion"
                              :delay="true"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第5钻： 过程变更？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser5',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=ME`"
                              :transform="selectOptionChampion"
                              :delay="true"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第6钻： 部件变更？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser6',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=TC`"
                              :transform="selectOptionChampion"
                              :delay="true"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
                            </net-select>
                          </a-form-item>
                        </li>
                        <li class="clearfix">
                          <span>第7钻： 是否是极端复杂问题？</span>
                          <a-form-item>
                            <net-select
                              v-decorator="['zuanUser7',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                              :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=TFT`"
                              :transform="selectOptionChampion"
                              :delay="true"
                              placeholder="请选择"
                              :allow-clear="true"
                              style="width:200px;height:32px"
                            >
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
                          <a-radio-group
                            v-decorator="[ 'verifySeven',{rules: [{ required: true, message: '请选择审核结果' }]}]"
                            :options="verifyRadio"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <div v-if=" record.verifySeven==='0' ">
                      <a-row>
                        <a-col :span="21">
                          <a-form-item :label="'结束7钻分析：'">
                            <a-radio-group
                              v-decorator="[ 'endSeven',{rules: [{ required: true, message: '请选择是否结束7钻' }]}]"
                              :options="endSevenRadio"
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <div v-if=" record.endSeven==='0' ">
                        <a-row>
                          <a-col :span="21">
                            <a-form-item :label="'责任部门：'">
                              <net-select
                                v-decorator="['owerDeptLv1',{rules: [{ required: true, message: '请选择责任部门' }]}]"
                                url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
                                :transform="selectOption"
                                :delay="true"
                                placeholder="请选择"
                                :allow-clear="true"
                                style="width:272px;height:32px;"
                              >
                              </net-select>
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-row>
                          <a-col :span="21">
                            <a-form-item :label="'责任人：'">
                              <net-select
                                v-decorator="['champion',{rules: [{ required: true, message: '请选择责任人' }]} ]"
                                :url="`/sys/workflowGroup/groupMemberByName?typeCode=RESPONSIBLE_DEPARTMENT&nameCode=${record.owerDeptLv1}`"
                                :transform="selectOptionChampion"
                                :delay="true"
                                placeholder="请选择"
                                :allow-clear="true"
                                style="width:272px;height:32px;"
                              >
                              </net-select>
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </div>
                    </div>

                    <a-row v-if="record.verifySeven==='1'">
                      <a-col :span="21">
                        <a-form-item :label="'不通过原因：'">
                          <a-textarea
                            v-decorator="['comment',{rules: [{ required: true, message: '请输不通过原因' }]} ]"
                            placeholder="请输入"
                          >
                          </a-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="stepCurrent!=1&&backCurrent==1&&backFlag"
              class="Dcontent D1back"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="backTitle">
                <p>{{ issueDefinitionData.type==='0'?'直接判定':'需要7钻分析' }}</p>
              </div>
              <div v-if="issueDefinitionData.type==='0'">
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任部门`">
                      <p>{{ issueDefinitionData.owerDeptLv1 }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`责任人`">
                      <p>{{ issueDefinitionData.champion }}</p>
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
                            v-for="(item,index) in issueDefinitionData.fileList"
                            :key="index"
                            :title="item"
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
              <div v-if="issueDefinitionData.type==='1'">
                <div class="processList clearfix">
                  <div class="processTitle">
                    7钻分析责任人:
                  </div>
                  <div class="processUl">
                    <ul>
                      <li class="clearfix">
                        <span>7钻流程</span>
                        <span>分析负责人</span>
                      </li>
                      <li class="clearfix">
                        <span>第1钻： 过程是否正确？</span>
                        <span>{{ issueDefinitionData.zuanUser1 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第2钻： 工具是否正确？</span>
                        <span>{{ issueDefinitionData.zuanUser1 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第3钻： 物料是否正确？</span>
                        <span>{{ issueDefinitionData.zuanUser1 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第4钻： 物料规格检测？</span>
                        <span>{{ issueDefinitionData.zuanUser4 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第5钻： 过程变更？</span>
                        <span>{{ issueDefinitionData.zuanUser5 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第6钻： 部件变更？</span>
                        <span>{{ issueDefinitionData.zuanUser6 }}</span>
                      </li>
                      <li class="clearfix">
                        <span>第7钻： 是否是极端复杂问题？</span>
                        <span>{{ issueDefinitionData.zuanUser7 }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="stepCurrent===2&&backFlag===false"
              class="Dcontent D2content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`根本原因（中英文）`">
                    <a-textarea
                      v-decorator="[
                        'rootCauseDescription',
                        {
                          rules:[
                            {required: true, message: '请输入根本原因'}, {validator: languageVer}
                          ]}
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                    ></a-textarea>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`附件`">
                    <a-upload
                      v-decorator="[
                        'D2file'
                      ]"
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
              v-if="stepCurrent!=2&&backCurrent==2&&backFlag"
              class="Dcontent D2back"
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
                          :key="index"
                          :title="item"
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
              v-if="stepCurrent===3&&backFlag===false"
              class="Dcontent D3content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="examineResult">
                <div>审核结果</div>
                <a-form-item :label="`审核`">
                  <p>{{}}</p>
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <p>{{}}</p>
                </a-form-item>
              </div>
              <div class="Dtitle">
                <span>措施判定</span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`短期措施`">
                    <v-textarea
                      v-decorator="[
                        'icaDescription',
                        {rules: [{validator: languageVer}]}
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                      :allow-clear="true"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`长期措施（中英文）`">
                    <v-textarea
                      v-decorator="[
                        'pcaDescription',
                        {rules: [
                          { required: true, message: '请输入长期措施' },
                          {validator: languageVer}
                        ]}
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                      :allow-clear="true"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`小批量验证`">
                    <v-input
                      v-decorator="[
                        'smallBatchValidation',
                      ]"
                      placeholder="请输入"
                      style="width:572px;"
                      :allow-clear="true"
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
                      v-decorator="[
                        'pcaPlanTime',
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`长期措施验证计划日期:`">
                    <a-date-picker
                      v-decorator="[
                        'pcaExecTime ',
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`计划关闭日期`">
                    <a-date-picker
                      v-decorator="[
                        'estimatedClosureTime',
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div
              v-if="stepCurrent!=3&&backCurrent==3&&backFlag"
              class="Dcontent D3back"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="Dtitle">
                <span>措施判定</span>
              </div>
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
                          :key="index"
                          :title="item"
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
              <div class="examine">
                <div class="Dtitle examineTitle">
                  <span>审核</span>
                </div>
                <a-form-item :label="`是否通过审核`">
                  <a-radio-group
                    v-decorator="[
                      'recurrencePrevention',
                      {rules: [{ required: true, message: '请选择是否通过审核' }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <v-textarea
                    v-decorator="[
                      'description',
                      {rules: [{ required: true, message: '请输入不通过理由' }]}
                    ]"
                    placeholder="请输入"
                    allow-clear
                    style="width:572px;height:88px;"
                  />
                </a-form-item>
              </div>
            </div>
            <div
              v-if="stepCurrent===4&&backFlag===false"
              class="Dcontent D4content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="examineResult">
                <div>
                  <span>审核结果</span>
                </div>
                <a-form-item :label="`审核`">
                  <p>{{}}</p>
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <p>{{}}</p>
                </a-form-item>
              </div>
              <div class="Dtitle">
                <span>措施实施</span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`短期效果(中英文)`">
                    <v-textarea
                      v-decorator="[
                        'icaExecDescription',
                        {
                          rules: [
                            {validator: languageVer,message:'请输入中英文'},
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                      :allow-clear="true"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`短期措施实施日期`">
                    <a-date-picker
                      v-decorator="[
                        'icaExecTime'
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`长期措施实施描述(中英文)`">
                    <v-textarea
                      v-decorator="[
                        'pcaDescription',
                        {rules: [
                          { required: true, message: '请输入长期措施' },
                          {validator: languageVer}
                        ]}
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                      :allow-clear="true"
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
                  <a-form-item :label="`长期措施实施日期`">
                    <a-date-picker
                      v-decorator="[
                        'pcaExecTime',
                        {rules: [{ required: true, message: '请输入长期措施实施日期' }]}
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div
              v-if="stepCurrent!=4&&backCurrent==4&&backFlag"
              class="Dcontent D4back"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="Dtitle">
                <span>措施实施</span>
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
                          :key="index"
                          :title="item"
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
              <div class="examine">
                <div class="Dtitle examineTitle">
                  <span>审核</span>
                </div>
                <a-form-item :label="`是否通过审核`">
                  <a-radio-group
                    v-decorator="[
                      'recurrencePrevention',
                      {rules: [{ required: true, message: '请选择是否通过审核' }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <v-textarea
                    v-decorator="[
                      'description',
                      {rules: [{ required: true, message: '请输入不通过理由' }]}
                    ]"
                    placeholder="请输入"
                    allow-clear
                    style="width:572px;height:88px;"
                  />
                </a-form-item>
              </div>
            </div>

            <div
              v-if="stepCurrent===5&&backFlag===false"
              class="Dcontent D5content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="examineResult">
                <div>
                  <span>审核结果</span>
                </div>
                <a-form-item :label="`审核`">
                  <p>{{}}</p>
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <p>{{}}</p>
                </a-form-item>
              </div>
              <div class="Dtitle">
                <span>效果验证</span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`效果验证`">
                    <v-textarea
                      v-decorator="[
                        'description',
                        {rules: [{ required: true, message: '请输入效果验证' }]}
                      ]"
                      placeholder="请输入"
                      style="width:572px;height:88px;"
                      :allow-clear="true"
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
              <a-row style="margin-left:220px;">
                <a-col :span="8">
                  <a-form-item :label="`断点VIN`">
                    <v-input
                      v-decorator="[
                        'breakpointVin ',
                        {rules: [{ required: true, message: '请输入断点VIN' }]}
                      ]"
                      placeholder="请输入"
                      :allow-clear="true"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-form-item :label="`断点时间`">
                    <a-date-picker
                      v-decorator="[
                        'breakpointDate ',
                        {rules: [{ required: true, message: '请选择断点时间' }]}
                      ]"
                      format="YYYY-MM-DD HH:mm:ss"
                      show-time
                      style="width:231px;"
                      :disabled-date="disabledDate"
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
              v-if="stepCurrent!=5&&backCurrent==5&&backFlag"
              class="Dcontent D5back"
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
              <div class="examine">
                <div class="Dtitle examineTitle">
                  <span>审核</span>
                </div>
                <a-form-item :label="`是否通过审核`">
                  <a-radio-group
                    v-decorator="[
                      'recurrencePrevention',
                      {rules: [{ required: true, message: '请选择是否通过审核' }]}
                    ]"
                    :options="recurrencePreventionRadio"
                  />
                </a-form-item>
                <a-form-item :label="`不通过理由`">
                  <v-textarea
                    v-decorator="[
                      'description',
                      {rules: [{ required: true, message: '请输入不通过理由' }]}
                    ]"
                    placeholder="请输入"
                    allow-clear
                    style="width:572px;height:88px;"
                  />
                </a-form-item>
              </div>
              <div>
                <div class="Dtitle examineTitle">
                  <span>提出人验证</span>
                </div>
                <a-row>
                  <a-form-item :label="`验证结果(中英文)`">
                    <v-textarea
                      v-decorator="[
                        'description',
                        {rules: [
                          {required: true, message: '请输入验证结果' },
                          {validator: languageVer}
                        ]}
                      ]"
                      placeholder="请输入"
                      allow-clear
                      style="width:572px;height:88px;"
                    />
                  </a-form-item>
                </a-row>
                <div class="examine">
                  <div class="Dtitle examineTitle">
                    <span>审核</span>
                  </div>
                  <a-form-item :label="`是否通过审核`">
                    <a-radio-group
                      v-decorator="[
                        'recurrencePrevention',
                        {rules: [{ required: true, message: '请选择是否通过审核' }]}
                      ]"
                      :options="recurrencePreventionRadio"
                    />
                  </a-form-item>
                  <a-form-item :label="`不通过理由`">
                    <v-textarea
                      v-decorator="[
                        'description',
                        {rules: [{ required: true, message: '请输入不通过理由' }]}
                      ]"
                      placeholder="请输入"
                      allow-clear
                      style="width:572px;height:88px;"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
            <div
              v-if="stepCurrent===6&&backFlag===false"
              class="Dcontent D6content"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`是否需要进入再发防止库`">
                    <a-radio-group
                      v-decorator="[
                        'recurrencePrevention',
                        {rules: [{ required: true, message: '请选择是否需要进入再发防止库' }]}
                      ]"
                      :options="recurrencePreventionRadio"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`是否加签`">
                    <a-radio-group
                      v-decorator="[
                        'isSign'
                      ]"
                      :options="recurrencePreventionRadio"
                      @change="apostilleChange"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="signLeaderFlag">
                <a-col :span="21">
                  <a-form-item :label="`加签领导`">
                    <net-select
                      v-decorator="[ 'signLeaderId',{rules: [{ required: true, message: '请选择加签领导' }]} ]"
                      :url="`issue/v1/workflow/getSysUser?issueSource=${detailList.source}&type=director`"
                      :transform="selectOptionSingn"
                      placeholder="请选择"
                      :allow-clear="true"
                      style="width:272px;height:32px;"
                    >
                    </net-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <div
              v-if="stepCurrent==6&&backCurrent==6&&backFlag"
              class="Dcontent D6back"
            >
              <div class="triangle_border_up">
                <span></span>
              </div>
              <div class="Dtitle">
                <span>问题关闭</span>
              </div>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`关闭人`">
                    <p>{{ stepClose.creator }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`关闭时间`">
                    <p>{{ stepClose.createDate }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="21">
                  <a-form-item :label="`进入再发防止库`">
                    <p>{{ stepClose.recurrencePrevention }}</p>
                  </a-form-item>
                </a-col>
              </a-row>
              <div class="examine">
                <div class="Dtitle">
                  <span>加签审阅</span>
                </div>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`是否审阅`">
                      <a-radio-group
                        v-decorator="[
                          'Review'
                        ]"
                        :options="ReviewRadio"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`备注`">
                      <v-textarea
                        v-decorator="[ 'signRemark' ]"
                        placeholder="请输入"
                        :allow-clear="true"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div class="examine">
                <div class="Dtitle">
                  <span>加签审阅</span>
                </div>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`审阅领导`">
                      <p>{{ stepClose.signLeaderName }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item :label="`审阅时间`">
                      <p>{{ stepClose.signDate }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="21">
                    <a-form-item
                      :label="`备注`"
                    >
                      <p>{{ stepClose.signRemark }}</p>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-card>
      </a-form>
      <a-form class="ant-advanced-search-form">
        <a-collapse :bordered="false">
          <a-collapse-panel
            key="0"
            header="操作记录"
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
  </div>
</template>
<script>
import { autoUpdateFileds, createFormFields } from '@util/formhelper.js';
import { createNamespacedHelpers } from 'vuex';
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
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    VInput: () => import('@comp/form/VInput.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue')
  },
  props: ['id'],
  data () {
    const that = this
    return {
      // 页面权限控制
      pagePermission: {
        A0_1: true,
        A0_2: true,
        A0_3: true,
        A1_1: true,
        A1_2: true,
        A1_3: true,
        A1_4: true,
        A1_5: true,
        A1_6: true,
        A1_7: true,
        A1_8: true,
        A1_9: true,
        A1_10: true,
        A1_11: true,
        A1_12: true,
        A1_13: true,
        A1_14: true,
        A1_15: true,
        A1_16: true,
        A1_17: true,
        A2: true,
        A2_1: true,
        A2_2: true,
        A2_3: true,
        A2_4: true,
        A2_5: true,
        A3_2: true,
        A4: true,
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
        button_redistribution_3: false

      },
      stepId: '', // 每一步id
      userId: that.$store.getters.getUser().id,
      taskId: null, // 任务id
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
      visibleReject: false,
      isCheckError: '0', // 验证不通过需要回到7钻
      signLeaderFlag: false, // 加签领导
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
      rejectForm: null,
      dataFile: [], // 附件
      dataRecord: [], // 操作记录
      stepDetail: [], // 某个问题的步骤详细信息
      stepMeasures: [], // 措施详细信息
      stepImplementation: [],
      stepEffect: [],
      problemDefinitionData: {},
      issueDefinitionData: {},
      rootCauseData: {}, // 根本原因
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
        value: 1
      }, {
        label: '否',
        value: 0
      }],
      contActionOption: [{
        label: '需要',
        value: 1
      }, {
        label: '不需要',
        value: 0
      }],
      ReviewRadio: [
        {
          label: '已审阅',
          value: 1
        }
      ],
      conActionFlag: true, // 围堵措施是否显示表示
      satisfyFlag: true, // 是否满足标识
      showMoreFlag: false, // 查看更多
      detailList: [],
      titleFlag: false, // 问题标题是否显示
      carTitle: '', // 车型标题
      functionTitle: '', // 功能标题，
      codeTitle: '', // 故障代码标题，
      stepCurrent: 1, // 当前步骤状态  从数据库读取状态
      backCurrent: 7, // 回退到的步骤数
      backFlag: false, // 是否点击回退
      disAgree: true, // 是否需要输入不同意关闭理由
      // D2
      radioDefault: 'Yes',
      determineRadio: [{
        label: '直接判定',
        value: '1'
      }, {
        label: '需要7钻分析',
        value: '2'
      }],
      verifyRadio: [{
        label: '通过',
        value: 1
      }, {
        label: '不通过',
        value: 0
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
        value: 1
      }, {
        label: '否',
        value: 0
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
        isProject: 1, //  是否满足立项条件
        dissatisfaction: '', // 不满足理由
        Remarks: '', // 备注
        isNeedIca: 1, // 是否需要围堵措施
        icaDescription: '', // 围堵措施
        // D1
        owerDeptLv1: [], // 责任部门
        champion: [], // 责任人
        type: '1', // 判定
        verifySeven: '2', // 7钻审核
        sevenFailReason: '', // 不通过原因
        comment: '', // 不通过原因
        // 7钻责任人
        endSeven: '1',
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
        recurrencePrevention: 0,
        isSign: 0,
        signLeaderId: '',
        Review: '1',
        signRemark: ''
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
      },
      // 驳回
      rejectRecord: {
        comment: ''
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
    this.rejectForm = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, [
        'rejectForm'
      ], 'rejectRecord'),
      onValuesChange: autoUpdateFileds(this, 'rejectRecord')
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
      'analysisDetail',
      'getIssueAutomousRegion'
    ]),
    disabledDate (current) {
      return current && current > moment().endOf('day');
    },
    // 是否需要围堵措施
    conActionChange (e) {
      if (e.target.value === 1) {
        this.conActionFlag = true;
      } else {
        this.conActionFlag = false;
      }
    },
    // 是否加签
    apostilleChange (e) {
      if (e.target.value === 1) {
        this.signLeaderFlag = true;
      } else {
        this.signLeaderFlag = false;
      }
    },
    // 驳回
    handleReject () {
      this.visibleReject = true;
    },
    RejectSubmit () {
      this.visibleReject = false;
      this.isCheckError = '1';
    },
    CancelReject () {
      this.visibleReject = false;
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
    selectOptionSingn (input) {
      const optionArray = [{
        value: input.id,
        label: input.username
      }];
      // input.forEach((item) => {
      //   optionArray.push({
      //     value: item.id,
      //     label: item.username
      //   })
      // })

      return optionArray;
    },
    selectOption (input) {
      const optionArray = [];

      input.forEach((item) => {
        optionArray.push({
          value: item.code,
          label: item.name
        })
      })

      return optionArray;
    },
    selectOptionChampion (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.userId,
          label: item.username
        })
      })
      return optionArray;
    },

    showAnalysis (param) {
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
         } */


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
      this.AnalysisForm.validateFields((err) => {
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
      this.updateForm.validateFields((err) => {
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
      // const param = {
      //   pageSize: 10,
      //   pageNo: 1
      // }
      // 查看问题详情
      this.eidtQuestion(this.id).then(res => {
        this.detailList = res;
      })
      this.getIssueAutomousRegion(this.id).then(res => {
        this.pagePermission = {}
        const that = this
        res.forEach(item => {
          that.pagePermission[item.DETAIL_REGION] = true
        })
        console.info(this.pagePermission)
      })
      /* this.getAnalysis(this.id).then(res => {
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
        }) */
      this.getFilePage().then(res => {
        this.dataFile = res.list;
      });
      this.getRecord().then(res => {
        this.dataRecord = res.list;
      });
      this.getQuestionStepAll(this.id);
    },
    getQuestionStepAll (id) {
      // this.getQuestionStep(this.id).then(res => {
      //  this.stepDetail = res;
      // this.updateData = res.updateList;
      // });
      this.problemDefinition(id).then(res => {
        this.problemDefinitionData = res || {};
        this.updateData = this.problemDefinitionData.updateList;
      });
      this.issueDefinition(id).then(res => {
        this.issueDefinitionData = res || {};
        this.analysisData = this.issueDefinitionData.sevenDiamondsVos
      });
      this.rootCause(id).then(res => {
        this.rootCauseData = res || {};
      })

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
      this.closeDetail(this.id).then(res => {
        this.stepClose = res;
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
    handleOk () {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel () {
      this.visible = false
    },
    // 是否需要7钻分析
    determineChange (e) {
      if (e.target.value === '1') {
        this.NeedFlage = false;
      } else if (e.target.value === '2') {
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
      } else if (this.backCurrent === 6 && this.stepCurrent === 6) {
        this.backFlag = true;
        this.closeDetail(this.id).then(res => {
          this.stepClose = res;
        })
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
    handleSubmit () {
      this.handleSave()
      const vm = this
      vm.coChair = vm.coChair ? vm.coChair : vm.getSysUser(vm.detailList.sourceName, 'coChairStepMonitor').id;
      vm.monitor = vm.monitor ? vm.monitor : vm.getSysUser(vm.detailList.sourceName, 'stepMonitor').id;
      this.formDcontent.validateFields((err) => {
        if (!err) {
          const data = this.formDcontent.getFieldsValue();
          const transData = {
            businessKey: this.id, // 问题id
            businessTitle: data.title, // 问题title
            processDefinitionKey: 'BJEV1', // BJEV1  固定值
            subSys: 'irs', //  子系统编号
            taskId: this.taskId, //  任务id
            userId: this.userId, //  当前用户id
            variables: {
              businessKey: this.id, // 问题id
              comment: data.comment || '0',
              assigner: data.zuanUser1,
              coChair: vm.coChair,
              monitor: vm.monitor,
              isDirectSerious: '0', // 是否直接极端严重事情
              isEnd: this.record.isClose, // 是否关闭
              isPass: data.verifySeven, // 审核是否通过
              isQZEnd: data.endSeven, // 是否结束七钻
              isAB: (data.gradeName === 'A' || data.gradeName === 'B') ? '1' : '0',
              isQZ: data.type, // 是否需要七钻
              isCheckError: this.isCheckError, // 验证不通过(需要回到七钻前)
              isLeaderSign: '0', // 领导加签
              isItem: data.isProject, // 是否立项
              zuanUser1: data.zuanUser1,
              zuanUser4: data.zuanUser4,
              zuanUser5: data.zuanUser5,
              zuanUser6: data.zuanUser6,
              zuanUser7: data.zuanUser7
            }
          }
          vm.workFlowSubmit(transData).then(res => {
            this.taskId = res.taskId;
            vm.$message.success('提交成功');
          });
        }
      });
    },
    // 再分配提交
    handleUser () {
      // this.rediStribution.validateFields((err) => {
    //     if (!err) {
    //       const data = this.rediStribution.getFieldsValue();
    //   //     this.redistribute(data).then(
    //   //       this.ModalText = 'The modal will be closed after two seconds';
    //   //       setTimeout(() => {
    //   //         this.visible = false;
    //   //       }, 2000);

    //   //   }
    //   // });
    },
    handleSave () {
      const data = this.formDcontent.getFieldsValue();
      // const thisCopy=this;
      // eslint-disable-next-line no-underscore-dangle
      const _this = this;
      data.issueId = this.id;
      if (this.stepCurrent === 0) {
        data.optCounter = _this.problemDefinitionData.optCounter;
        this.problemDefinitionAdd(data).then(res => {
          this.problemDefinitionData = res
        })
      }
      if (this.stepCurrent === 1) {
        data.optCounter = _this.issueDefinitionData.optCounter;
        this.issueDefinitionAdd(data).then(res => {
          this.optCounter = res.optCounter;
        })
      }
      if (this.stepCurrent === 2) {
        data.id = this.analysisId;
        data.optCounter = _this.rootCauseData.optCounter;
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
        data.id = this.stepId;
        data.optCounter = this.optCounter;
        this.MeasureDecisionSave(data).then(() => {
          this.MeasureDetail(this.id).then(res => {
            this.stepMeasures = res;
            this.optCounter = res.optCounter;
            this.stepId = res.id;
            //  data.optCounter=res.optCounter;
          });
        });
      } else if (this.stepCurrent === 4) {
        data.id = this.stepId;
        data.optCounter = this.optCounter;
        this.MeasureDecisionSave(data).then(() => {
          this.ImplementationDetail(this.id).then(res => {
            this.stepImplementation = res;
            this.optCounter = res.optCounter;
            this.stepId = res.id;
          });
        });
      } else if (this.stepCurrent === 5) {
        data.id = this.stepId;
        data.optCounter = this.optCounter;
        this.effectSave(data).then(() => {
          this.effectDetail(this.id).then(res => {
            this.stepEffect = res;
            this.optCounter = res.optCounter;
            this.stepId = res.id;
          });
        })
      } else if (this.stepCurrent === 6) {
        data.id = this.stepId;
        data.optCounter = this.optCounter;
        this.closeSave(data).then(() => {
          this.closeDetail(this.id).then(res => {
            this.stepClose = res;
            this.optCounter = res.optCounter;
            this.stepId = res.id;
          })
        })
      }
    },
    handleSearch (e) {
      e.preventDefault();
    },

    handleChange () {
    },
    levelChange (value) {
      console.log(`selected ${value}`);
    },
    handleReset () {
      this.$router.push({
        path: this.$route.query.form || '/'
      });
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
      if (e.target.value === 1) {
        this.satisfyFlag = true;
      } else if (e.target.value === 0) {
        this.satisfyFlag = false;
      }
    },
    // 滚动时触发按钮固定
    offsetChange () {
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
  /deep/.ant-btn {
    .anticon {
      margin-left:-4px;
    }
  }
  /deep/ .ant-modal{
      top:120px!important;
    }
  .new-steps-icon {
    line-height: 1;
    top: -6px;
    position: relative;
    left: -3px;
  }

  #components-form-demo-advanced-search {

     .formConetnt{
        margin-top: 40px;
     }
      .messageForm{
      /deep/ .ant-row{
        height: 40px;
        line-height: 40px;
      }
    }
    // .UserModal{
    //  /deep/.ant-modal-footer{
    //       padding:10px 5px;
    //        /deep/.ant-btn-loading{
    //        padding-left:0!important;
    //      }
    //  }
    // }
    .examineResult{
       border-bottom: 1px solid rgba(0,0,0,0.09);
       width:1012px;
       margin-left:32px;
       margin-bottom:20px;
    }
    .Dtitle{
      margin-left:32px;
    }
    .examineTitle{
      border-top: 1px solid rgba(0,0,0,0.09);
      margin-right:32px;
      display: block;
      width:1012px;
      padding-top: 20px;
      margin-top:41px;
    }

   .fileListNumber{
    width: 20px;
    height: 20px;
    display: inline-block;
    border: 1px solid #8c8c8c;
    line-height: 19px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    color: rgba(0,0,0,0.85);
    margin-left:6px;
   }
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
      cursor: pointer;

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
      width: 1168px;
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
      cursor: pointer;
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
      margin-left:10px;
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
    .triangle_border_up{
       position: absolute;
       left: 494px;
       top: -15px;
    }
  }
  .D3back{
     .triangle_border_up{
        position: absolute;
        left: 494px;
        top: -15px;
    }
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
  /deep/ .ant-affix {
    left: 0px!important;
    width: 100%!important;
    background: rgba(75,75,75,0.85);
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.65);
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

  .clearfix {
    overflow: hidden;
    *zoom: 1;
  }

  .ant-advanced-search-form {
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
  .examine{
     /deep/ .ant-form-item-label {
      label {
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
    }

  }
</style>
