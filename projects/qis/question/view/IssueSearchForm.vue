<template>
  <a-form
    v-show="showForm"
    :form="form"
    layout="inline"
  >
    <a-row :gutter="24">
      <a-col
        :span="8"
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
        :span="8"
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
        </a-form-item>
      </a-col>
      <a-col
        :span="8"
      >
        <!-- 问题等级 -->
        <a-form-item :label="$t('issue.grade')">
          <net-select
            v-decorator="['grade']"
            mode="multiple"
            :transform="transformGrade"
            :max-tag-count="2"
            :placeholder="$t('search.please_select')"
            url="/sys/dict?dictType=issue_grade"
            delay
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <a-col
        :span="8"
      >
        <!-- 问题分类 -->
        <a-form-item :label="$t('issue.source')">
          <net-select
            v-decorator="['source']"
            mode="multiple"
            :max-tag-count="2"
            :placeholder="$t('search.please_select')"
            :transform="transformSource"
            url="/sys/dict?dictType=issue_source"
            delay
            allow-clear
            close-search
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
          style="margin-bottom: 16px;"
        >
          <span
            style="float: right; overflow: hidden;"
          >
            <a-button
              type="primary"
              class="advance-action"
              @click="submitSearch"
            >
              {{ $t('search.search_button') }}
            </a-button>
            <a-button
              class="advance-action"
              @click="resetSearch"
            >
              {{ $t('search.reset_button') }}
            </a-button>
            <a-button
              class="advance-action"
              type="link"
              @click="cancelSearch"
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
import { transform, treeTransform } from '@util/datahelper.js';
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';
import { transform1, transform2 } from '~~/model.js';
import moduleDynamicCache from '~~/module-dynamic-cache.js';


export default {
  components: {
    VInput: () => import('@comp/form/VInput.vue'),
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    NetSingleTreeSelect: () => import('@comp/form/NetSingleTreeSelect.vue'),
  },
  mixins: [moduleDynamicCache('question')],
  data () {
    return {
      form: null,
      record: {},
    };
  },
  computed: {
    showForm () {
      return this.advancePageConfig.showForm;
    },
  },
  created () {
    this.record = this.advancePageConfig.searchData;
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record'),
    });
  },
  methods: {
    /**
     * 字段映射函数
     */
    mapPropsToFields () {
      return createFormFields(this, [
        'code', 'vehicleModelId', 'grade', 'source',
      ], 'record');
    },
    /**
     * 提交搜索内容
     */
    submitSearch () {
      this.cache = clone(this.record);
      this.changeAdvancePageConfig({
        searchData: this.cache,
      });
      this.$emit('change', this.record);
    },
    /**
     * 重置搜索内容
     */
    resetSearch () {
      this.changeAdvancePageConfig({ searchData: {} });
      this.$set(this, 'record', {});
      this.form.updateFields(this.mapPropsToFields());
      this.submitSearch();
    },
    /**
     * 取消搜索
     */
    cancelSearch () {
      this.changeAdvancePageConfig({ showForm: false });
      this.resetSearch();
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
    transformSource: transform2,
    vehicleModelTreeTransform: treeTransform(transform({
      value: 'id', label: 'psNameZh', children: 'children', selectable: (item) => !(item.children && item.children.length),
    })),
  },
};
</script>

<style lang="less" scoped>
  /deep/ .ant-form-item {
    display: flex!important;
  }
  .advance-action {
    margin-left: 8px;
  }
</style>
