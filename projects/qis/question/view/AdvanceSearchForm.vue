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
            allow-clear
            v-decorator="[
              'title'
            ]"
            :placeholder="$t('search.please_input') + $t('issue.title')"
          />
        </a-form-item>
      </a-col>

      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 车型名称 -->
        <a-form-item :label="$t('issue.vehicleModelName')">
          <net-select
            allow-clear
            url="/masterdata/v1/vehiclemodel"
            :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
            :transform="transformVehicleModelName"
            v-decorator="['vehicleModelId']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 所属系统 -->
        <a-form-item :label="$t('issue.faultTreeIds1')">
          <net-select
            allow-clear
            url="/issue/v1/faultcategory?p_id=0"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds1')"
            :transform="transformFaultTreeIds1"
            @change="faultTreeIds1Change"
            v-decorator="['faultTreeIds1']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 所属功能 -->
        <a-form-item :label="$t('issue.faultTreeIds2')">
          <net-select
            allow-clear
            :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds1}`"
            :cache="false"
            :disabled="!record.faultTreeIds1"
            :delay="!record.faultTreeIds1"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds2')"
            :transform="transformFaultTreeIds2"
            @change="faultTreeIds2Change"
            v-decorator="['faultTreeIds2']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 故障代码 -->
        <a-form-item :label="$t('issue.faultTreeIds3')">
          <net-select
            allow-clear
            :url="`/issue/v1/faultcategory?p_id=${record.faultTreeIds2}`"
            :cache="false"
            :disabled="!record.faultTreeIds2"
            :delay="!record.faultTreeIds2"
            :placeholder="$t('search.please_select') + $t('issue.faultTreeIds3')"
            :transform="transformFaultTreeIds3"
            v-decorator="['faultTreeIds3']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 问题分类 -->
        <a-form-item :label="$t('issue.source')">
          <net-select
            allow-clear
            url="/sys/dict?dictType=issue_source"
            :cache="false"
            :delay="!record.source"
            :placeholder="$t('search.please_select') + $t('issue.source')"
            :transform="transformSource"
            v-decorator="['source']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 严重等级 -->
        <a-form-item :label="$t('issue.grade')">
          <net-select
            allow-clear
            :placeholder="$t('search.please_select') + $t('issue.grade')"
            url="/sys/dict?dictType=issue_grade"
            :transform="transformGrade"
            v-decorator="['grade']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 问题阶段 -->
        <a-form-item :label="$t('issue.projectPhase')">
          <net-select
            allow-clear
            :placeholder="$t('search.please_select') + $t('issue.projectPhase')"
            url="/sys/dict?dictType=issue_phase"
            :transform="transformPhase"
            v-decorator="['projectPhase']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 生产基地 -->
        <a-form-item :label="$t('issue.manufactureBase')">
          <net-select
            allow-clear
            :placeholder="$t('search.please_select') + $t('issue.manufactureBase')"
            url="/masterdata/v1/manufactureBase"
            :transform="transformManufactureBase"
            v-decorator="['manufactureBase']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 祸首件 -->
        <a-form-item :label="$t('issue.firstCausePart')">
          <net-select
            allow-clear
            :placeholder="$t('search.please_select') + $t('issue.firstCausePart')"
            url="/masterdata/v1/part"
            :transform="transformFirstCausePart"
            v-decorator="['firstCausePart']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 供应商ID -->
        <a-form-item :label="$t('issue.supplierId')">
          <net-select
            allow-clear
            :placeholder="$t('search.please_select') + $t('issue.supplierId')"
            url="/masterdata/v1/supplier"
            :transform="transformSupplierId"
            v-decorator="['supplierId']"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="6"
        v-if="advanced"
      >
        <!-- 问题发生日期 -->
        <a-form-item :label="$t('issue.failureDate')">
          <a-date-picker
            show-time
            allow-clear
            style="width: 100%;"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('search.please_select') + $t('issue.failureDate')"
            v-decorator="['failureDate']"
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
              type="primary"
              @click="submitSearch"
            >
              {{ $t('search.find_button') }}
            </a-button>
            <a-button
              @click="resetSearch"
            >
              {{ $t('search.reset_button') }}
            </a-button>
            <a
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
        const record = this.form.getFieldsValue();
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
      const record = this.form.getFieldsValue();
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
    faultTreeIds1Change (value, option) {
      if (!value) {
        this.record.faultTreeIds2 = undefined;
        this.record.faultTreeIds3 = undefined;
      }
    },
    faultTreeIds2Change (value, option) {
      if (!value) {
        this.record.faultTreeIds3 = undefined;
      }
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

</style>
