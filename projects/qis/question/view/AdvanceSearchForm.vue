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
        <a-form-item
          :label="$t('issue.title')"
          self-update
        >
          <v-input
            v-decorator="[
              'title'
            ]"
            :placeholder="$t('search.please_input')"
            autocomplete="off"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题编号 -->
        <a-form-item
          :label="$t('issue.code')"
          self-update
        >
          <v-input
            v-decorator="[
              'code'
            ]"
            :placeholder="$t('search.please_input')"
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
          <net-single-tree-select
            v-decorator="['vehicleModelId']"
            :placeholder="$t('search.please_select')"
            :transform="vehicleModelTreeTransform"
            allow-clear
            url="/masterdata/v1/vehicleproject/treeAll"
            :query="{ id: '${value}' }"
          />
          <!-- <net-select
            v-decorator="['vehicleModelId']"
            :placeholder="$t('search.please_select')"
            :transform="transformVehicleModelName"
            url="/masterdata/v1/vehiclemodel"
            allow-clear
          /> -->
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
            :transform="selectOptionFaultTree"
            :placeholder="$t('search.please_select')"
            :query="{ id: '${value}'}"
            allow-clear
            url="/masterdata/v1/pfscategory?p_id=0"
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
            url="/masterdata/v1/pfscategory"
            :query="{p_id: record.faultTreeIds1, id: '${value}'}"
            :delay="!record.faultTreeIds1"
            :cache="false"
            :disabled="!record.faultTreeIds1"
            :placeholder="$t('search.please_select')"
            :transform="selectOptionFaultTree"
            allow-clear
            show-search
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
            url="/masterdata/v1/pfsfault"
            :query="{psId: record.faultTreeIds2, id: '${value}'}"
            :delay="!record.faultTreeIds2"
            :cache="false"
            :disabled="!record.faultTreeIds2"
            :placeholder="$t('search.please_select')"
            :transform="selectOptionFaultTree3"
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
            :placeholder="$t('search.please_select')"
            :transform="transformSource"
            :max-tag-count="2"
            mode="multiple"
            url="/sys/dict?dictType=issue_source"
            allow-clear
            close-search
            delay
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
            :max-tag-count="2"
            :placeholder="$t('search.please_select')"
            :transform="transformGrade"
            mode="multiple"
            url="/sys/dict?dictType=issue_grade"
            allow-clear
            close-search
            delay
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
            :placeholder="$t('search.please_select')"
            :transform="transformPhase"
            :max-tag-count="2"
            mode="multiple"
            url="/sys/dict?dictType=issue_phase"
            allow-clear
            show-search
            close-search
            delay
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
            :placeholder="$t('search.please_select')"
            :transform="transformManufactureBase"
            :max-tag-count="1"
            mode="multiple"
            url="/masterdata/v1/manufactureBase"
            allow-clear
            close-search
            delay
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
            :placeholder="$t('search.please_select')"
            :transform="transformFirstCausePart"
            :query="{name: '${search}'}"
            url="/masterdata/v1/part"
            allow-clear
            delay
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 供应商名称 -->
        <a-form-item :label="$t('issue.supplierId')">
          <net-select
            v-decorator="['supplierId']"
            :placeholder="$t('search.please_select')"
            :transform="transformSupplierId"
            url="/masterdata/v1/supplier"
            allow-clear
            delay
          />
        </a-form-item>
      </a-col>
      
      <a-col 
        v-if="advanced"
        :span="6"
      >
        <!-- 「问题提出人」下拉 -->
        <a-form-item :label="$t('issue.proposerName')">
          <net-select
            v-decorator="['creator']"
            :placeholder="$t('search.please_select')"
            :transform="filterOptionCreator"
            :max-tag-count="1"
            mode="multiple"
            url="/issue/v1/issue/getIssueCreatorList"
            allow-clear
            delay
          >
          </net-select>
        </a-form-item>
      </a-col>

      <a-col 
        v-if="advanced"
        :span="6"
      >
        <!-- 「当前处理人」下拉 -->
        <a-form-item :label="$t('issue.assignerName')">
          <net-select
            v-decorator="['assigner']"
            :placeholder="$t('search.please_select')"
            :transform="filterOptionAssigner"
            :max-tag-count="1"
            mode="multiple"
            url="/issue/v1/issue/getIssueAssignerList"
            allow-clear
            delay
          >
          </net-select>
        </a-form-item>
      </a-col>


      <a-col 
        v-if="advanced"
        :span="6"
      >
        <!-- 「责任部门」下拉 -->
        <a-form-item :label="$t('issue.responsibleDepartmentId')">
          <net-select
            v-decorator="['responsibleDepartmentId']"
            :placeholder="$t('search.please_select')"
            :transform="filterOptionResponsibleDepId"
            :max-tag-count="1"
            mode="multiple"
            allow-clear
            show-search
            url="/sys/workflowGroup/groupNameByType?typeCode=RESPONSIBLE_DEPARTMENT"
          >
          </net-select>
        </a-form-item>
      </a-col>

                    
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题发生日期 -->
        <a-form-item :label="$t('issue.failureDate')">
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
        v-if="advanced"
        :span="6"
      >
        <!-- 问题关闭日期 -->
        <a-form-item :label="$t('issue.closeDate')">
          <a-range-picker
            v-decorator="['closeDate']"
            :placeholder="[$t('search.begin_date'), $t('search.end_date')]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
            allow-clear
            style="width: 100%;"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-if="advanced"
        :span="6"
      >
        <!-- 问题计划关闭日期 -->
        <a-form-item :label="$t('issue.planCloseDate')">
          <a-range-picker
            v-decorator="['planCloseDate']"
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
          :style="{'padding-top': advanced ? '28px': '28px'}"
        >
          <span
            style="float: right; overflow: hidden;"
          >
            <a-button
              v-permission="'issue:advance:search'"
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
            <a-button
              class="advance-action"
              @click="exportSearch"
            >
              {{ $t('search.export_button') }}
            </a-button>
            <a
              v-permission="'issue:advance:advance'"
              class="advance-action"
              @click="changeAdvance"
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
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';
import { clearObserver, transform, treeTransform } from '@util/datahelper.js';
import { omit } from 'ramda';
import {
  createNamespacedHelpers
} from 'vuex';
import { transform1, transform2, transform3, transform4, transform5, transform6 } from '~~/model.js';
import timeFormatMix from '~~/time-format.js';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

const {
  mapActions
} = createNamespacedHelpers('question');
export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue')
  },
  mixins: [timeFormatMix, moduleDynamicCache('question')],
  data () {
    const vm = this;
    // 映射数据源
    vm.mapPropsToFields = mapPropsToFields(vm, [
      'title', 'code', 'vehicleModelId', 'faultTreeIds1', 'faultTreeIds2', 'faultTreeIds3',
      'source', 'grade', 'projectPhase', 'manufactureBaseId', 'firstCausePart',
      'supplierId', 'creator', 'assigner', 'responsibleDepartmentId', 'failureDate', 'closeDate', 'planCloseDate', ''
    ], 'record');
    return {
      // 通过映射数据源生成表单
      form: vm.$form.createForm(this, {
        mapPropsToFields: vm.mapPropsToFields,
        onValuesChange: autoUpdateFileds(this, 'record')
      }),
      // advanced: false,
      record: {}
    };
  },
  computed: {
    advanced () {
      return this.advancePageConfig.showAdvance;
    }
  },
  watch: {
    advanced (advanced) {
      if (advanced) {
        this.form.updateFields();
      }
    }
  },
  created () {
    // 从store中取值，用于缓存搜索表单
    this.record = clearObserver(this.advancePageConfig.searchData);
    this.form.updateFields();
  },
  methods: {
    ...mapActions([
      'exportData'
    ]),
    /**
     * 提交搜索内容
     */
    submitSearch () {
      this.changeAdvancePageConfig({
        searchData: this.record
      });
      const record = omit(['failureDate', 'closeDate', 'planCloseDate'], clearObserver(this.record));
      // 问题发生日期转换时间段
      this.record.failureDate && this.record.failureDate[0] && (record.failureDateStart = this.record.failureDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.failureDate && this.record.failureDate[1] && (record.failureDateEnd = this.record.failureDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      // 问题关闭日期转换时间段
      this.record.closeDate && this.record.closeDate[0] && (record.closeDateStart = this.record.closeDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.closeDate && this.record.closeDate[1] && (record.closeDateEnd = this.record.closeDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      // 问题发生日期转换时间段
      this.record.planCloseDate && this.record.planCloseDate[0] && (record.planCloseDateStart = this.record.planCloseDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.planCloseDate && this.record.planCloseDate[1] && (record.planCloseDateEnd = this.record.planCloseDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      this.$emit('change', record);
    },
    /**
     * 收缩或展开高级搜索
     */
    changeAdvance () {
      this.changeAdvancePageConfig({ showAdvance: !this.advanced });
    },
    /**
     * 重置搜索内容
     */
    resetSearch () {
      this.$set(this, 'record', {});
      this.form.updateFields(this.mapPropsToFields());
      this.$emit('change', this.record);
    },
    /**
     * 导出搜索内容
     */
    exportSearch () {
      const record = omit(['failureDate', 'closeDate', 'planCloseDate'], this.record);
      // 问题发生日期转换时间段
      this.record.failureDate && this.record.failureDate[0] && (record.failureDateStart = this.record.failureDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.failureDate && this.record.failureDate[1] && (record.failureDateEnd = this.record.failureDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      // 问题关闭日期转换时间段
      this.record.closeDate && this.record.closeDate[0] && (record.closeDateStart = this.record.closeDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.closeDate && this.record.closeDate[1] && (record.closeDateEnd = this.record.closeDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      // 问题发生日期转换时间段
      this.record.planCloseDate && this.record.planCloseDate[0] && (record.planCloseDateStart = this.record.planCloseDate[0].format(this.DATA_RANGE.BEGIN_DAY_FORMAT));
      this.record.planCloseDate && this.record.planCloseDate[1] && (record.planCloseDateEnd = this.record.planCloseDate[1].format(this.DATA_RANGE.END_DAY_FORMAT));
      if (this.advancePageConfig.searchOrderData.field !== undefined) {
        record.orderField = this.advancePageConfig.searchOrderData.field;
      }
      if (this.advancePageConfig.searchOrderData.order !== undefined) {
        record.order = this.advancePageConfig.searchOrderData.order;
      }
      let str = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const prop in record) {
        // eslint-disable-next-line no-prototype-builtins
        if (record.hasOwnProperty(prop)) {
          str += `&${prop}=${record[prop]}`;
        }
        console.log(prop);
      }
      const a = document.createElement('a');
      const preUrl = this.$store.getters.getUrl();
      
      const token = this.$store.state.token;
      a.setAttribute('href', preUrl + `/issue/v1/issue/export?token=${token}` + str);
      // a.click在火狐下无法被触发，必须通过这种方式下载
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      a.remove();
      // this.exportData(record).then((res) => {

      // });
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
    transformManufactureBase: transform3,
    filterOptionCreator: transform4,
    filterOptionAssigner: transform5,
    filterOptionResponsibleDepId: transform6,
    vehicleModelTreeTransform: treeTransform(transform({ value: 'id', label: 'psNameZh', children: 'children', selectable: item => !(item.children && item.children.length) })),
    selectOptionFaultTree (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.psNameZh
        });
      });
      return optionArray;
    },
    selectOptionFaultTree3 (input) {
      const optionArray = [];
      input.forEach((item) => {
        optionArray.push({
          value: item.id,
          label: item.faultNameZh
        });
      });
      return optionArray;
    },
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
    margin-left: 0px;
  }
  .ant-btn {
    margin-right: 2px;
  }
</style>
