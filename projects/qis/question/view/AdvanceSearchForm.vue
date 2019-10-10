<template>
  <a-form
    :form="form"
    class="advance-search-form"
    layout="vertical"
  >
    <a-row :gutter="24">
      <a-col
        :span="6"
      >
        <!-- 标题 -->
        <a-form-item :label="$t('issue.title')">
          <v-input
            v-decorator="[
              'title'
            ]"
            :placeholder="$t('search.please_input') + $t('issue.title')"
            autocomplete="off"
            allow-clear
          />
        </a-form-item>
      </a-col>

      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 车型名称 -->
        <a-form-item :label="$t('issue.vehicleModelName')">
          <net-select
            v-decorator="['vehicleModelId']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
            :transform="transformVehicleModelName"
            allow-clear
            show-search
            url="/masterdata/v1/vehiclemodel"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 所属系统 -->
        <a-form-item :label="$t('issue.faultTreeIds1')">
          <net-select
            v-decorator="['faultTreeIds1']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds1')"
            :transform="transformFaultTreeIds1"
            @change="faultTreeIds1Change"
            allow-clear
            show-search
            url="/issue/v1/faultcategory?p_id=0"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 所属功能 -->
        <a-form-item :label="$t('issue.faultTreeIds2')">
          <net-select
            v-decorator="['faultTreeIds2']"
            :filter-option="filterOption"
            :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
            :cache="false"
            :disabled="!record.faultTreeIds1"
            :delay="!record.faultTreeIds1"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds2')"
            :transform="transformFaultTreeIds2"
            @change="faultTreeIds2Change"
            allow-clear
            show-search
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 故障代码 -->
        <a-form-item :label="$t('issue.faultTreeIds3')">
          <net-select
            v-decorator="['faultTreeIds3']"
            :filter-option="filterOption"
            :url="`/issue/v1/faultTree?fault_category_id=${record.faultTreeIds2}`"
            :cache="false"
            :disabled="!record.faultTreeIds2"
            :delay="!record.faultTreeIds2"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds3')"
            :transform="transformFaultTreeIds3"
            allow-clear
            show-search
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题分类 -->
        <a-form-item :label="$t('issue.source')">
          <net-select
            v-decorator="['source']"
            :filter-option="filterOption"
            :cache="false"
            :delay="!record.source"
            :placeholder="$t('search.please_select') + $t('issue.source')"
            :transform="transformSource"
            allow-clear
            show-search
            url="/sys/dict?dictType=issue_source"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 严重等级 -->
        <a-form-item :label="$t('issue.grade')">
          <net-select
            v-decorator="['grade']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.grade')"
            :transform="transformGrade"
            allow-clear
            show-search
            url="/sys/dict?dictType=issue_grade"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题阶段 -->
        <a-form-item :label="$t('issue.projectPhase')">
          <net-select
            v-decorator="['projectPhase']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.projectPhase')"
            :transform="transformPhase"
            allow-clear
            show-search
            url="/sys/dict?dictType=issue_phase"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 生产基地 -->
        <a-form-item :label="$t('issue.manufactureBase')">
          <net-select
            v-decorator="['manufactureBaseId']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.manufactureBase')"
            :transform="transformManufactureBase"
            allow-clear
            show-search
            url="/masterdata/v1/manufactureBase"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 祸首件 -->
        <a-form-item :label="$t('issue.firstCausePart')">
          <net-select
            v-decorator="['firstCausePart']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.firstCausePart')"
            :transform="transformFirstCausePart"
            allow-clear
            show-search
            url="/masterdata/v1/part"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 供应商ID -->
        <a-form-item :label="$t('issue.supplierId')">
          <net-select
            v-decorator="['supplierId']"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.supplierId')"
            :transform="transformSupplierId"
            allow-clear
            show-search
            url="/masterdata/v1/supplier"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题发生日期 -->
        <a-form-item :label="$t('issue.failureDate')">
          <!-- <a-date-picker
            v-decorator="['failureDate']"
            show-time
            allow-clear
            style="width: 100%;"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('search.please_select') + $t('issue.failureDate')"
          /> -->
          <a-range-picker
            v-decorator="['failureDate']"
            :placeholder="[$t('search.begin_date'), $t('search.end_date')]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
            allow-clear
            style="width: 100%;"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        style="float: right;"
      >
        <a-form-item
          :style="{'padding-top': advanced ? '12px': '28px'}"
        >
          <span
            style="float: right; overflow: hidden;"
          >
            <a-button
              v-permission="'issue:advance:search'"
              @click="submitSearch"
              class="advance-action"
              type="primary"
            >
              {{ $t('search.find_button') }}
            </a-button>
            <a-button
              @click="resetSearch"
              class="advance-action"
            >
              {{ $t('search.reset_button') }}
            </a-button>
            <a
              v-permission="'issue:advance:advance'"
              @click="() => advanced = !advanced"
              class="advance-action"
            >
              {{ advanced ? $t('search.title_search') : $t('search.advance_search') }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';
import { transform1, transform2, transform3 } from '~~/model.js';
import timeFormatMix from '~~/time-format.js';
import { omit } from 'ramda';

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue')
  },
  mixins: [timeFormatMix],
  data () {
    return {
      advanced: false,
      form: null,
      record: {
      }
    };
  },
  watch: {
    advanced (value) {
      if (value) {
        this.form.updateFields(this.mapPropsToFields());
      }
    }
  },
  created () {
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record')
    });
  },
  methods: {
    /**
     * 字段映射函数
     */
    mapPropsToFields () {
      return createFormFields(this, [
        'title',
        'vehicleModelId', 'faultTreeIds1', 'faultTreeIds2', 'faultTreeIds3',
        'source', 'grade', 'projectPhase', 'manufactureBaseId', 'firstCausePart',
        'supplierId', 'failureDate'
      ], 'record');
    },
    /**
     * 提交搜索内容
     */
    submitSearch () {
      const record = omit(['failureDate'], this.record);
      this.record.failureDate && this.record.failureDate[0] && (record.failureDateStart = this.record.failureDate[0].format('YYYY-MM-DD HH:mm:00'));
      this.record.failureDate && this.record.failureDate[1] && (record.failureDateEnd = this.record.failureDate[1].format('YYYY-MM-DD HH:mm:00'));
      this.$emit('change', record);
    },
    /**
     * 重置搜索内容
     */
    resetSearch () {
      this.$set(this, 'record', {});
      this.form.updateFields(this.mapPropsToFields());
      this.$emit('change', this.record);
    },
    faultTreeIds1Change (value) {
      if (!value) {
        this.record.faultTreeIds2 = undefined;
        this.record.faultTreeIds3 = undefined;
      }
    },
    faultTreeIds2Change (value) {
      if (!value) {
        this.record.faultTreeIds3 = undefined;
      }
    },
    // 本地搜索通用函数
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    /**
     * 转换net-select获取的参数
     */
    transformVehicleModelName: transform1,
    transformFaultTreeIds1: transform1,
    transformFaultTreeIds2: transform1,
    transformFaultTreeIds3: transform1,
    transformFirstCausePart: transform1,
    transformSupplierId: transform1,
    transformGrade: transform2,
    transformPhase: transform2,
    transformSource: transform2,
    transformManufactureBase: transform3

  }
};
</script>

<style lang="less" scoped>
  .advance-search-form {
    margin-top: 6px;
    /deep/ .ant-form-item{
      margin-bottom: 4px;
    }
  }
  .advance-action {
    margin-left: 4px;
  }
  .ant-btn {
    margin-right: 12px;
  }
</style>
