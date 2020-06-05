<template>
  <div class="root">
    <h2 class="title">
      <a-icon type="icon-single-bs-filled"></a-icon>
      {{ $t('issue.problemDescription') }}
    </h2>
    <a-form-model
      ref="problemDescForm"
      :model="problemDescForm"
      layout="vertical"
    >
      <a-row :gutter="24">
        <!-- 故障开始时间 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="falutDate"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.falutDate')"
          >
            <a-date-picker
              v-model="problemDescForm.falutDate"
              :format="DATE_FORMAT"
              :disabled-date="disabledStartDate"
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障结束时间 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="falutDateEnd"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.falutDateEnd')"
          >
            <a-date-picker
              v-model="problemDescForm.falutDateEnd"
              :format="DATE_FORMAT"
              :disabled-date="disabledEndDate"
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题级别 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="asqIssueGrade"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.asqIssueGrade')"
          >
            <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
            <single-net-select
              v-model="problemDescForm.asqIssueGrade"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=issue_grade"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障现象  --->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="faultSymptom"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.faultSignAnalysis')"
          >
            <a-input
              v-model="problemDescForm.faultSymptom"
              :placeholder="$t('form.input')"
              autocomplete="off"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障频次 -->
        <a-col :span="formItemSpan">
          <!-- @FIXME: 验证使用国际化 -->
          <a-form-model-item
            prop="faultFrequency"
            :rules="[$v.required($t('issue.notBeBlank')), $v.int('必须是数字')]"
            :label="$t('issue.faultFrequency')"
          >
            <a-input-number
              v-model="problemDescForm.faultFrequency"
              class="inputNumber"
              :min="0"
              :placeholder="$t('form.input')"
              autocomplete="off"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属系统 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="faultTreeIds1"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.faultTreeIds1')"
          >
            <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
            <single-net-select
              v-model="problemDescForm.faultTreeIds1"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/pfscategory?p_id=0"
              value-by="id"
              :label-of="(item) => item.name"
              allow-clear
              @change="handleSystem"
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属功能 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="faultTreeIds2"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.faultTreeIds2')"
          >
            <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
            <single-net-select
              v-model="problemDescForm.faultTreeIds2"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfscategory?p_id=${problemDescForm.faultTreeIds1}`"
              :delay="isEdit || !problemDescForm.faultTreeIds1"
              :cache="false"
              :disabled="!problemDescForm.faultTreeIds1"
              value-by="id"
              :label-of="(item) => item.name"
              allow-clear
              @change="faultTreeIds2Change"
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="faultTreeIds3"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.faultTreeIds3')"
          >
            <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
            <single-net-select
              v-model="problemDescForm.faultTreeIds3"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfsfault?psId=${problemDescForm.faultTreeIds2}`"
              value-by="id"
              :label-of="(item) => item.name"
              :delay="isEdit || !problemDescForm.faultTreeIds2"
              :cache="false"
              :disabled="!problemDescForm.faultTreeIds2"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 是否再发 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="isRecur"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.isRecur')"
          >
            <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
            <single-net-select
              v-model="problemDescForm.isRecur"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=is_recur"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障工况 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="faultCondition"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.faultCondition')"
          >
            <a-input
              v-model="problemDescForm.faultCondition"
              :placeholder="$t('form.input')"
              autocomplete="off"
              allow-clear
              maxlength="500"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <!-- 附件上传 -->
          <a-form-model-item
            prop="files"
            :label="$t('issue.accessory')"
            style="width: 25%"
          >
            <v-upload
              v-model="problemDescForm.files"
              :headers="headers"
              :multiple="true"
              :action="$store.getters.getUrl('/field-q/v1/file/upload?recType=30021001')"
              download="/oss/ossFile/download"
            >
              <a-button icon="upload">
                {{ $t('action.upload') }}
              </a-button>
            </v-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import attachmentMix from '@mix/attachment.js';
import { validator } from '@util/formhelper.js';
import { GET_MOMENT, GET_DATETIME_FORMAT } from '@util/datetime-helper.js';
import { pick } from 'ramda';

const fileds = ['faultSymptom', 'asqIssueGrade', 'faultFeature', 'falutDateEnd', 'faultFrequency', 'falutDate', 'isRecur', 'faultCondition', 'files', 'faultTreeIds1', 'faultTreeIds2', 'faultTreeIds3'];

export default {
  mixins: [
    validator,
    storeModuleMix({
      name: 'issue',
      action: ['getReporterData', 'getAllReporterData'],
    }),
    attachmentMix,
  ],
  props: {
    // 从编辑页面 获取到的数据
    mergeData: {
      type: Object,
      default: () => ({}),
    },
    // 工单创建的时候 获取的数据  全选
    resultData: {
      type: Array,
      default: () => [],
    },
    // 工单创建的时候 获取的数据  非全选
    noResultData: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      formItemSpan: 6,
      problemDescForm: {
        falutDate: null,
        falutDateEnd: null,
      },
    };
  },
  computed: {
    isEdit () {
      return JSON.stringify(this.$route.query) === '{}';
    },
    /**
     * 故障频次是否显示
     */
    isShowFaultFrequency () {
      return this.$route.query.num !== undefined;
    },
  },
  watch: {
    /**
     * 从编辑页面进来 监听外部数据，用于回显
     */
    mergeData: {
      immediate: true,
      handler (mergeData = {}) {
        const falutDate = GET_MOMENT(mergeData.falutDate);
        const falutDateEnd = GET_MOMENT(mergeData.falutDateEnd);
        this.problemDescForm.files = mergeData.files || [];
        Object.assign(this.problemDescForm, pick(fileds, {
          ...mergeData, falutDate, falutDateEnd,
        }));
        // this.problemDescForm = pick(fileds, { ...mergeData, falutDate });
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  全选
     */
    resultData: {
      immediate: false,
      handler (resultData = []) {
        const { falutDate, falutDateEnd } = resultData[0];
        this.problemDescForm.falutDate = GET_MOMENT(falutDate);
        this.problemDescForm.falutDateEnd = GET_MOMENT(falutDateEnd);
        this.problemDescForm.faultFrequency = this.$route.query.num;
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  非全选
     */
    noResultData: {
      immediate: false,
      handler (noResultData = []) {
        const { falutDate, falutDateEnd } = noResultData[0];
        this.problemDescForm.falutDate = GET_MOMENT(falutDate);
        this.problemDescForm.falutDateEnd = GET_MOMENT(falutDateEnd);
        this.problemDescForm.faultFrequency = this.$route.query.num;
      },
    },
    /**
     * 用来监听 删除之后的故障频次也要跟着改变
     */
    '$store.state.issue.faultFrequency': function (value) {
      this.problemDescForm.faultFrequency = value;
    },
  },
  created () {
  },
  methods: {
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.problemDescForm.validate((valid) => {
          if (valid) {
            const problemDescList = { ...this.problemDescForm };
            problemDescList.falutDate = GET_DATETIME_FORMAT(problemDescList.falutDate);
            problemDescList.falutDateEnd = GET_DATETIME_FORMAT(problemDescList.falutDateEnd);
            resolve(problemDescList);
          } else {
            reject(valid);
          }
          return valid;
        });
      });
    },
    /**
     * 禁用时间
     */
    disabledStartDate (momentDate) {
      if (this.problemDescForm.falutDateEnd) {
        const EndDate = this.problemDescForm.falutDateEnd.format(this.GLOBAL_SELECT_DATE_FORMAT);
        return momentDate.isAfter(EndDate, 'day');
      }
      return momentDate.isAfter(GET_MOMENT(Date.now()), 'day');
    },
    disabledEndDate (momentDate) {
      if (this.problemDescForm.falutDate) {
        const startDate = this.problemDescForm.falutDate.format(this.GLOBAL_SELECT_DATE_FORMAT);
        return momentDate.isAfter(GET_MOMENT(Date.now()), 'day') || momentDate.isBefore(startDate, 'day');
      }
      return momentDate.isAfter(GET_MOMENT(Date.now()), 'day');
    },
    /**
     * 所属系统选择
     */
    handleSystem () {
      // this.problemDescForm.faultTreeIds2 = null;
      this.$set(this.problemDescForm, 'faultTreeIds2', null);
      this.$set(this.problemDescForm, 'faultTreeIds3', null);
    },
    /**
     * 所属功能选择
     */
    faultTreeIds2Change () {
      this.$set(this.problemDescForm, 'faultTreeIds3', null);
    },

  },
};
</script>

<style lang="less" scoped>
.root {
  .title {
    margin: 16px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    /deep/ .anticon {
      color: @primary-color;
    }
  }
  .inputNumber{
    width: 100%;
  }
}
</style>
