<template>
  <a-form
    v-show="!hide"
    :form="form"
    layout="inline"
  >
    <a-row :gutter="24">
      <a-col
        :span="8"
      >
        <!-- 问题编号 -->
        <a-form-item :label="$t('issue.code')">
          <v-input
            v-decorator="[
              'code'
            ]"
            :placeholder="$t('search.please_input') + $t('issue.code')"
            autocomplete="off"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="8"
      >
        <!-- 车型 -->
        <a-form-item :label="$t('issue.vehicleModelName')">
          <net-select
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
            :transform="transformField"
            v-decorator="['vehicleModelId']"
            allow-clear
            show-search
            url="/masterdata/v1/vehiclemodel"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="8"
      >
        <!-- 问题等级 -->
        <a-form-item :label="$t('issue.grade')">
          <net-select
            :transform="transformGrade"
            :filter-option="filterOption"
            :placeholder="$t('search.please_select') + $t('issue.grade')"
            v-decorator="['grade']"
            allow-clear
            show-search
            url="/sys/dict?dictType=issue_grade"
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="8"
      >
        <!-- 问题分类 -->
        <a-form-item :label="$t('issue.source')">
          <net-select
            :filter-option="filterOption"
            :cache="false"
            :delay="!record.source"
            :placeholder="$t('search.please_select') + $t('issue.source')"
            :transform="transformSource"
            v-decorator="['source']"
            allow-clear
            show-search
            url="/sys/dict?dictType=issue_source"
          />
        </a-form-item>
      </a-col>
      <!-- TODO: 目前需求暂时不需要，待定 -->
      <!-- <a-col
        :span="8"
      >
        <a-form-item label="$t('search.champion')">
          <a-input
            v-decorator="[
              'champion'
            ]"
            placeholder="$t('search.champion')"
          />
        </a-form-item>
      </a-col> -->
      <a-col
        :span="8"
        style="float: right;"
      >
        <a-form-item
          style="margin-top: 12px; margin-bottom: 16px;"
        >
          <span
            style="float: right; overflow: hidden;"
          >
            <a-button
              @click="submitSearch"
              type="primary"
              class="advance-action"
            >
              {{ $t('search.search_button') }}
            </a-button>
            <a-button
              @click="resetSearch"
              class="advance-action"
            >
              {{ $t('search.reset_button') }}
            </a-button>
            <a-button
              @click="cancelSearch"
              class="advance-action"
              type="link"
            >
              {{ $t('search.collapse_button') }} <a-icon type="up" />
            </a-button>
          </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { clone } from 'ramda';
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';
import { transform1, transform2 } from '~~/model.js';

export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue')
  },
  props: {
    hide: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: null,
      record: {}
    };
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
        'vehicleModelId', 'grade', 'source'
      ], 'record');
    },
    /**
     * 提交搜索内容
     */
    submitSearch () {
      this.cache = clone(this.record);
      this.$emit('change', this.record);
    },
    /**
     * 重置搜索内容
     */
    resetSearch () {
      this.$set(this, 'record', {});
      this.form.updateFields(this.mapPropsToFields());
      this.submitSearch();
    },
    /**
     * 取消搜索
     */
    cancelSearch () {
      this.resetSearch();
      this.$emit('hidden');
    },
    // 本地搜索通用函数
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    /**
     * 转换net-select获取的参数
     */
    transformField: transform1,
    transformGrade: transform2,
    transformSource: transform2
  }
};
</script>

<style lang="less" scoped>
  .advance-action {
    margin-left: 8px;
  }
</style>
