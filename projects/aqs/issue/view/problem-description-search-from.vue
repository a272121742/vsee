<template>
  <div class="root">
    <h2 class="title">
      <a-icon type="iconbs_filled"></a-icon>
      {{ $t('issue.problemDescription') }}
    </h2>
    <a-form
      :form="problemDescForm"
      layout="vertical"
      self-update
      class="col-layout-form"
    >
      <a-row :gutter="24">
        <!-- 故障开始时间 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.falutDate')"
          >
            <a-date-picker
              v-decorator="[
                'falutDate', {
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :format="GLOBAL_SELECT_DATE_FORMAT"
              :disabled-date="disabledStartDate"
            />
          </a-form-item>
        </a-col>
        <!-- 故障结束时间 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.falutDateEnd')"
          >
            <a-date-picker
              v-decorator="[
                'falutDateEnd', {
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :format="GLOBAL_SELECT_DATE_FORMAT"
              :disabled-date="disabledEndDate"
            />
          </a-form-item>
        </a-col>
        <!-- 问题级别 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.asqIssueGrade')"
          >
            <single-net-select
              v-decorator="[
                'asqIssueGrade',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=issue_grade"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-item>
        </a-col>
        <!-- 故障现象  --->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultSignAnalysis')"
          >
            <a-input
              v-decorator="[
                'faultSymptom',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              placeholder="请输入"
              autocomplete="off"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <!-- 故障频次 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultFrequency')"
          >
            <a-input-number
              v-decorator="[
                'faultFrequency',{
                  rules: [
                    $v.required($t('issue.notBeBlank')),
                    $v.int('必须是数字')
                  ]
                }
              ]"
              class="inputNumber"
              :min="0"
              placeholder="必须为数字"
              autocomplete="off"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <!-- 所属系统 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultTreeIds1')"
          >
            <single-net-select
              v-decorator="[
                'faultTreeIds1',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/pfscategory?p_id=0"
              value-by="id"
              :label-of="(item) => item.name"
              allow-clear
              @change="handleSystem"
            />
          </a-form-item>
        </a-col>
        <!-- 所属功能 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultTreeIds2')"
          >
            <single-net-select
              v-decorator="[
                'faultTreeIds2',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfscategory?p_id=${problemDescFormRecord.faultTreeIds1}`"
              :delay="isEdit || !problemDescFormRecord.faultTreeIds1"
              :cache="false"
              :disabled="!problemDescFormRecord.faultTreeIds1"
              value-by="id"
              :label-of="(item) => item.name"
              allow-clear
              @change="faultTreeIds2Change"
            />
          </a-form-item>
        </a-col>
        <!-- 故障代码 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultTreeIds3')"
          >
            <single-net-select
              v-decorator="[
                'faultTreeIds3',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfsfault?psId=${problemDescFormRecord.faultTreeIds2}`"
              value-by="id"
              :label-of="(item) => item.name"
              :delay="isEdit || !problemDescFormRecord.faultTreeIds2"
              :cache="false"
              :disabled="!problemDescFormRecord.faultTreeIds2"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <!-- 是否再发 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.isRecur')"
          >
            <single-net-select
              v-decorator="[
                'isRecur',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=is_recur"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-item>
        </a-col>
        <!-- 故障工况 -->
        <a-col :span="formItemSpan">
          <a-form-item
            required
            :label="$t('issue.faultCondition')"
          >
            <a-input
              v-decorator="[
                'faultCondition',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]
                }
              ]"
              placeholder="请输入"
              autocomplete="off"
              allow-clear
              maxlength="500"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <!-- 附件上传 -->
          <a-form-item
            :label="$t('issue.accessory')"
            style="width: 25%"
          >
            <v-upload
              v-decorator="['files', {
                initialValue: problemDescFormRecord.files,
              }]"
              :headers="headers"
              :multiple="true"
              :action="$store.getters.getUrl('/field-q/v1/file/upload?recType=30021001')"
              download="/oss/ossFile/download"
            >
              <a-button icon="upload">
                {{ $t('action.upload') }}
              </a-button>
            </v-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import formRecordMix from '@mix/form-record.js';
import attachmentMix from '@mix/attachment.js';
import timeFormatMix from '@mix/time-format.js';
import { pick } from 'ramda';
import moment from 'moment';

const fileds = ['faultSymptom', 'asqIssueGrade', 'faultFeature', 'falutDateEnd', 'faultFrequency', 'falutDate', 'isRecur', 'faultCondition', 'files', 'faultTreeIds1', 'faultTreeIds2', 'faultTreeIds3'];

export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    VUpload: () => import('@comp/form/VUpload.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'issue',
      action: ['getReporterData', 'getAllReporterData'],
    }),
    formRecordMix('problemDescForm', fileds),
    attachmentMix,
    timeFormatMix,
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
        const falutDate = mergeData.falutDate ? moment(mergeData.falutDate) : void 0;
        const falutDateEnd = mergeData.falutDateEnd ? moment(mergeData.falutDateEnd) : void 0;
        this.problemDescFormRecord.files = mergeData.files || [];
        Object.assign(this.problemDescFormRecord, pick(fileds, {
          ...mergeData, falutDate, falutDateEnd,
        }));
        // this.problemDescFormRecord = pick(fileds, { ...mergeData, falutDate });
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  全选
     */
    resultData: {
      immediate: false,
      handler (resultData = []) {
        const { falutDate, falutDateEnd } = resultData[0];
        this.problemDescFormRecord.falutDate = moment(falutDate);
        this.problemDescFormRecord.falutDateEnd = moment(falutDateEnd);
        this.problemDescFormRecord.faultFrequency = this.$route.query.num;
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  非全选
     */
    noResultData: {
      immediate: false,
      handler (noResultData = []) {
        const { falutDate, falutDateEnd } = noResultData[0];
        this.problemDescFormRecord.falutDate = moment(falutDate);
        this.problemDescFormRecord.falutDateEnd = moment(falutDateEnd);
        this.problemDescFormRecord.faultFrequency = this.$route.query.num;
      },
    },
    /**
     * 用来监听 删除之后的故障频次也要跟着改变
     */
    '$store.state.issue.faultFrequency': function (value) {
      this.problemDescFormRecord.faultFrequency = value;
    },
  },
  created () {
  },
  methods: {
    moment,
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.problemDescForm.validateFieldsAndScroll((err) => {
          if (!err) {
            const problemDescList = { ...this.problemDescFormRecord };
            problemDescList.falutDate = problemDescList.falutDate.format(this.ACTION_LABEL_DATE_FORMAT);
            problemDescList.falutDateEnd = problemDescList.falutDateEnd.format(this.ACTION_LABEL_DATE_FORMAT);
            resolve(problemDescList);
          } else {
            reject(err);
          }
        });
      });
    },
    /**
     * 禁用时间
     */
    disabledStartDate (momentDate) {
      if (this.problemDescFormRecord.falutDateEnd) {
        const EndDate = this.problemDescFormRecord.falutDateEnd.format(this.GLOBAL_SELECT_DATE_FORMAT);
        return momentDate.isAfter(EndDate, 'day');
      }
      return momentDate.isAfter(moment(), 'day');
    },
    disabledEndDate (momentDate) {
      if (this.problemDescFormRecord.falutDate) {
        const startDate = this.problemDescFormRecord.falutDate.format(this.GLOBAL_SELECT_DATE_FORMAT);
        return momentDate.isAfter(moment(), 'day') || momentDate.isBefore(startDate, 'day');
      }
      return momentDate.isAfter(moment(), 'day');
    },
    /**
     * 所属系统选择
     */
    handleSystem () {
      this.problemDescFormRecord.faultTreeIds2 = '';
    },
    /**
     * 所属功能选择
     */
    faultTreeIds2Change () {
      this.problemDescFormRecord.faultTreeIds3 = '';
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
