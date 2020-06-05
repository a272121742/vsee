<template>
  <div class="root">
    <h2 class="title">
      <a-icon type="icon-single-bs-filled"></a-icon>
      {{ $t('issue.basicFaultInformation') }}
    </h2>
    <a-form-model
      ref="basicFaultInfForm"
      :model="basicFaultInfForm"
      layout="vertical"
    >
      <a-row :gutter="24">
        <!-- 车型 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="vhclSeriesCode"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.vhclSeriesCode')"
          >
            <single-net-select
              v-model="basicFaultInfForm.vhclSeriesCode"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicleseries/seriesCodeList"
              value-by="vhclSeriesCode"
              :label-of="(item) => item.vhclSeriesCode"
              allow-clear
              search-by="name"
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题来源 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="asqIssueSource"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.asqIssueSource')"
          >
            <single-net-select
              v-model="basicFaultInfForm.asqIssueSource"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=asq_issue_source"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题属类 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="asqIssueCategory"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.asqIssueCategory')"
          >
            <single-net-select
              v-model="basicFaultInfForm.asqIssueCategory"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=asq_issue_category"
              value-by="dictValue"
              :label-of="(item) => item.dictName"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 祸首件 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="firstCausePart"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.firstCausePart')"
          >
            <single-net-select
              v-model="basicFaultInfForm.firstCausePart"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/part/partList?orderField=name"
              value-by="id"
              :label-of="(item) => item.name === null ? item.code :item.name+'-'+item.code"
              allow-clear
              search-by="all"
            />
          </a-form-model-item>
        </a-col>
        <!-- 供应商 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="supplierId"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.supplierCode')"
          >
            <single-net-select
              v-model="basicFaultInfForm.supplierId"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/supplier/supplierList"
              value-by="id"
              :label-of="(item) => item.supplierName === null ? item.supplierCode : item.supplierName+ '-' + item.supplierCode"
              allow-clear
              search-by="all"
            />
          </a-form-model-item>
        </a-col>
        <!-- 发布时间 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            :label="$t('issue.createDate')"
          >
            <a-date-picker
              v-model="basicFaultInfForm.createDate"
              :format="DATE_FORMAT"
              disabled
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';
import { validator } from '@util/formhelper.js';
import { GET_MOMENT, GET_DATETIME_FORMAT } from '@util/datetime-helper.js';
import { pick } from 'ramda';


const fileds = ['vhclSeriesCode', 'asqIssueSource', 'asqIssueCategory', 'firstCausePart', 'createDate', 'supplierId'];

export default {
  mixins: [
    validator,
    storeModuleMix({
      name: 'issue',
      action: ['getReporterData', 'getAllReporterData'],
    }),
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
      basicFaultInfForm: {
        createDate: GET_MOMENT(Date.now()),
      },
    };
  },
  watch: {
    /**
     * 从编辑页面进来 监听外部数据，用于回显
     */
    mergeData: {
      immediate: true,
      handler (mergeData = {}) {
        const createDate = GET_MOMENT(mergeData.createDate) || GET_MOMENT(Date.now());
        this.basicFaultInfForm = pick(fileds, { ...mergeData, createDate });
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  全选
     */
    resultData: {
      immediate: false,
      handler (resultData = []) {
        const { vhclModelSaleCode, partId, supplierId } = resultData[0];
        this.basicFaultInfForm = {
          vhclSeriesCode: vhclModelSaleCode,
          firstCausePart: partId,
          createDate: GET_MOMENT(Date.now()),
          supplierId,
        };
      },
    },
    /**
     * 创建工单的时候 监听数据 ，用语回显  非全选
     */
    noResultData: {
      immediate: false,
      handler (noResultData = []) {
        const { vhclModelSaleCode, partId, supplierId } = noResultData[0];
        this.basicFaultInfForm = {
          vhclSeriesCode: vhclModelSaleCode,
          firstCausePart: partId,
          createDate: GET_MOMENT(Date.now()),
          supplierId,
        };
      },
    },
  },
  methods: {
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.basicFaultInfForm.validate((valid) => {
          if (valid) {
            const basicFaultInfList = { ...this.basicFaultInfForm };
            basicFaultInfList.createDate = GET_DATETIME_FORMAT(basicFaultInfList.createDate);
            resolve(basicFaultInfList);
          } else {
            reject(valid);
          }
          return valid;
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.root {
  .title {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    /deep/ .anticon {
      color: @primary-color;
    }
  }
  /deep/ .ant-select-dropdown-menu-root{
    overflow: visible ;
  }
  /deep/ .ant-select-dropdown-menu-item{
    overflow:visible ;
  }
}
</style>
