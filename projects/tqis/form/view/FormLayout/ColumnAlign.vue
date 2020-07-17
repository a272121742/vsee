<template>
  <div>
    <a-page-header
      sub-title="用于将表单进行整齐划一"
    >
      <template #title>
        列对齐
        <a-switch
          v-model="align"
          size="small"
        />
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
      :model="record"
      :hide-required-mark="false"
      layout="inline"
      :class="{'form-column-align': align}"
    >
      <a-row :gutter="0">
        <!-- 问题标题 -->
        <a-col :span="formItemSpan * 4">
          <a-form-model-item
            prop="问题标题"
            :rules="[$v.required('不能为空')]"
            label="问题标题"
          >
            <a-input
              v-model="record['问题标题']"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题责任详细描述 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="问题责任详细描述"
            :rules="[$v.required('不能为空')]"
            label="问题责任详细描述"
          >
            <v-textarea
              v-model="record['问题责任详细描述']"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题备注 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="问题备注"
            :rules="[$v.required('不能为空')]"
            label="问题备注"
          >
            <v-textarea
              v-model="record['问题备注']"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 发布日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="发布日期"
            :rules="[$v.required('不能为空')]"
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
            prop="生产日期"
            :rules="[$v.required('不能为空')]"
            label="生产日期"
          >
            <a-date-picker
              v-model="record['生产日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 维修日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="维修日期"
            :rules="[$v.required('不能为空')]"
            label="维修日期"
          >
            <a-date-picker
              v-model="record['维修日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 最后更新时间 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="最后更新时间"
            :rules="[$v.required('不能为空')]"
            label="最后更新时间"
          >
            <a-date-picker
              v-model="record['最后更新时间']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 车型 -->
        <a-col :span="formItemSpan * 3">
          <a-form-model-item
            prop="车型"
            :rules="[$v.required('不能为空')]"
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
            prop="车型代码"
            :rules="[$v.required('不能为空')]"
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
            prop="车型名称"
            :rules="[$v.required('不能为空')]"
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
        <a-col :span="formItemSpan * 3">
          <a-form-model-item
            prop="供应商名称"
            :rules="[$v.required('不能为空')]"
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
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import formRecord from '@mix/form-model-record.js';
import { GET_MOMENT } from '@util/datetime-helper.js';
import code from './ColumnAlign.code.js';

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
      align: true,
      formItemSpan: 6,
    };
  },
  methods: {
    // 提交数据
    commit () {
      const commitValue = this.record.valueOf();
      if (!this.action) {
        this.action = true;
        this.$message.loading(`正在提交数据${JSON.stringify(commitValue)}`, 2, () => {
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
            问题标题: '车身锁系统开闭状态信号显示错误',
            问题责任详细描述: '车身锁系统开闭状态信号显示错误',
            问题备注: '希望改进',
            发布日期: GET_MOMENT('2020-01-01'),
            生产日期: GET_MOMENT('2020-01-01'),
            维修日期: GET_MOMENT('2020-04-01'),
            最后更新日期: GET_MOMENT(new Date()),
            车型: ['EC180', 'EC280', 'C11CB'],
            车型代码: '131RHVCK3003',
            车型名称: '威旺307EV系列2015款舒适型5座（光宇）PDU无防滑／有电缆',
            供应商名称: '河南省西峡汽车水泵股份有限公司',
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
</script>
