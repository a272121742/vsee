<template>
  <a-form
    class="advance-search-form"
    :form="form"
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
            autocomplete="off"
            allow-clear
            :placeholder="$t('search.please_input') + $t('issue.title')"
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
            allow-clear
            show-search
            url="/masterdata/v1/vehiclemodel"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
            :transform="transformVehicleModelName"
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
            allow-clear
            show-search
            url="/issue/v1/faultcategory?p_id=0"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds1')"
            :transform="transformFaultTreeIds1"
            @change="faultTreeIds1Change"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
            :cache="false"
            :disabled="!record.faultTreeIds1"
            :delay="!record.faultTreeIds1"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds2')"
            :transform="transformFaultTreeIds2"
            @change="faultTreeIds2Change"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :url="`/issue/v1/faultTree?fault_category_id=${record.faultTreeIds2}`"
            :cache="false"
            :disabled="!record.faultTreeIds2"
            :delay="!record.faultTreeIds2"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds3')"
            :transform="transformFaultTreeIds3"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            url="/sys/dict?dictType=issue_source"
            :cache="false"
            :delay="!record.source"
            :placeholder="$t('search.please_select') + $t('issue.source')"
            :transform="transformSource"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.grade')"
            url="/sys/dict?dictType=issue_grade"
            :transform="transformGrade"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.projectPhase')"
            url="/sys/dict?dictType=issue_phase"
            :transform="transformPhase"
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
            v-decorator="['manufactureBase']"
            allow-clear
            show-search
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.manufactureBase')"
            url="/masterdata/v1/manufactureBase"
            :transform="transformManufactureBase"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.firstCausePart')"
            url="/masterdata/v1/part"
            :transform="transformFirstCausePart"
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
            allow-clear
            show-search
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.supplierId')"
            url="/masterdata/v1/supplier"
            :transform="transformSupplierId"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题发生日期 -->
        <a-form-item :label="$t('issue.failureDate')">
          <a-date-picker
            v-decorator="['failureDate']"
            show-time
            allow-clear
            style="width: 100%;"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('search.please_select') + $t('issue.failureDate')"
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
              class="advance-action"
              type="primary"
              @click="submitSearch"
            >
              {{ $t('search.find_button') }}
            </a-button>
            <a-button
              class="advance-action"
              @click="resetSearch"
            >
              {{ $t('search.reset_button') }}
            </a-button>
            <a
              class="advance-action"
              @click="() => advanced = !advanced"
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
import { transform1, transform2, transform3 } from '@@cmd/model.js';

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue')
  },
  data () {
    return {
      advanced: false,
      form: null,
      record: {
      }
    }
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
        'source', 'grade', 'projectPhase', 'manufactureBase', 'firstCausePart',
        'supplierId', 'failureDate'
      ], 'record');
    },
    /**
     * 提交搜索内容
     */
    submitSearch () {
      this.$emit('change', this.record);
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
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
}
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
</style>
