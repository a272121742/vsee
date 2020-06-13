export default `<template>
  <div>
    <a-page-header

      sub-title="常见就是三列或四列布局"
    >
      <template #title>
        分列布局
        <a-radio-group
          v-model="formItemSpan"
          size="small"
          button-style="solid"
        >
          <a-radio-button :value="6">
            四列
          </a-radio-button>
          <a-radio-button :value="8">
            三列
          </a-radio-button>
        </a-radio-group>
      </template>
      <template slot="extra">
        <a-modal
          v-model="showSource"
          centered
          width="80%"
        >
          <SourceCodeView :code="code"></SourceCodeView>
        </a-modal>
        <a-button-group>
          <a-button @click="() => showSource = !showSource">
            源码
          </a-button>
          <a-button
            :disabled="action"
            @click="commit"
          >
            提交
          </a-button>
          <a-button
            :disabled="action"
            @click="load"
          >
            加载
          </a-button>
          <a-button
            :disabled="action"
            @click="reset"
          >
            重置
          </a-button>
          <a-button
            :disabled="action"
            @click="clear"
          >
            清空
          </a-button>
          <a-button
            :disabled="action"
            @click="cache"
          >
            缓存
          </a-button>
        </a-button-group>
      </template>
    </a-page-header>
    <a-form-model
      :model="form"
      :hide-required-mark="true"
      layout="vertical"
    >
      <a-row :gutter="formItemSpan * 2">
        <!-- 车型 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="车型"
          >
            <multiple-net-select
              v-model="record['车型']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicleseries/seriesCodeList"
              value-by="vhclSeriesCode"
              label-of="vhclSeriesCode"
              allow-clear
              search-by="name"
              :max-tag-count="1"
            />
          </a-form-model-item>
        </a-col>
        <!-- 车型代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="车型代码"
          >
            <single-net-select
              v-model="record['车型代码']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicle/modelAndCode"
              value-by="vhclModelCode"
              label-of="vhclModelCode"
              allow-clear
              search-by="code"
            />
          </a-form-model-item>
        </a-col>
        <!-- 车型名称 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="车型名称"
          >
            <single-net-select
              v-model="record['车型名称']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicle/modelAndCode"
              value-by="vhclModelName"
              label-of="vhclModelName"
              allow-clear
              search-by="name"
            />
          </a-form-model-item>
        </a-col>
        <!-- 供应商名称 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="供应商名称"
          >
            <net-auto-complete
              v-model="record['供应商名称']"
              url="/masterdata/v1/supplier/supplierList"
              :placeholder="$t('form.input')"
              allow-clear
              :get-popup-container="el => el.parentNode"
              dropdown-match-select-width
              value-by="supplierName"
              search-by="name"
            />
          </a-form-model-item>
        </a-col>
        <!-- 单据状态 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="单据状态"
          >
            <multiple-net-select
              v-model="record['单据状态']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=claim_order_status"
              value-by="dictValue"
              label-of="dictName"
              allow-clear
              search-by="name"
              :max-tag-count="1"
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="故障代码"
          >
            <single-net-select
              v-model="record['故障代码']"
              :placeholder="$t('form.select')"
              url="/field-q/v1/claimorder/faultCode"
              value-by="faultSignCode"
              label-of="faultSignCode"
              allow-clear
              search-by="code"
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障现象 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="故障现象"
          >
            <single-net-select
              v-model="record['故障现象']"
              :placeholder="$t('form.select')"
              url="/field-q/v1/claimorder/faultReason"
              value-by="faultSignAnalysis"
              label-of="faultSignAnalysis"
              allow-clear
              search-by="name"
            />
          </a-form-model-item>
        </a-col>
        <!-- 下线工厂 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="下线工厂"
          >
            <single-net-select
              v-model="record['下线工厂']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=factory_code"
              value-by="dictName"
              label-of="dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题级别 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="问题级别"
          >
            <single-net-select
              v-model="record['问题级别']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=issue_grade"
              value-by="dictValue"
              label-of="dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 是否再发 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="是否再发"
          >
            <single-net-select
              v-model="record['是否再发']"
              :placeholder="$t('form.select')"
              url="/sys/dict?dictType=is_recur"
              value-by="dictValue"
              label-of="dictName"
              allow-clear
              close-search
            />
          </a-form-model-item>
        </a-col>
        <!-- 发布日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="发布日期"
          >
            <a-date-picker
              v-model="record['发布日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 生产日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            required
            label="生产日期"
          >
            <a-date-picker
              v-model="record['生产日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
  </template>

  <script>
  import formRecord from '@mix/form-record.js';
  import { GET_MOMENT } from '@util/datetime-helper.js';
  import code from './ColumnSplit.code.js';

  export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    formRecord(),
  ],
  data () {
    return {
      showSource: false,
      code,
      action: false,
      compact: true,
      formItemSpan: 6,
    };
  },
  methods: {
    // 提交数据
    commit () {
      const commitValue = this.record.valueOf();
      if (!this.action) {
        this.action = true;
        this.$message.loading(\`正在提交数据\${JSON.stringify(commitValue)}\`, 2, () => {
          this.action = false;
        });
      }
      console.log(commitValue);
    },
    // 加载数据
    load () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const id = setTimeout(() => {
          this.record.load({
            车型: ['C11CB'],
            车型代码: '131RFVCD1015',
            车型名称: '威旺307EV系列2015款舒适型2座（光宇）PDU带防滑／有电缆',
            供应商名称: '中航光电',
            单据状态: ['Q'],
            故障代码: '01010104',
            故障现象: '低压电器系统-保护系统-安全带--难开/无法打开',
            下线工厂: '广分工厂',
            问题级别: 'd',
            是否再发: '0',
            发布日期: GET_MOMENT(new Date()),
            生产日期: GET_MOMENT('2017-01-01'),
          });
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    // 重置数据
    reset () {
      this.record.reset();
    },
    // 清空数据
    clear () {
      this.record.clear();
    },
    // 缓存数据
    cache () {
      this.record.cache();
    },
  },
};
</script>`;
