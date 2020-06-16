<template>
  <div>
    <a-page-header
      title="取值映射"
      sub-title="将表单值映射成可提交数据"
    >
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
      layout="vertical"
    >
      <a-row :gutter="24">
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="创建时间"
            :rules="[$v.required('不能为空')]"
            label="创建时间"
          >
            <a-date-picker
              v-model="record['创建时间']"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="时间段"
            :rules="[$v.required('不能为空')]"
            label="时间段"
          >
            <a-range-picker
              v-model="record['时间段']"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import formRecord, { map2Datetime, split2DatetimeRange, deleteField } from '@mix/form-model-record.js';
import { GET_MOMENT } from '@util/datetime-helper.js';
import { seq } from '@util/fnhelper.js';
import code from './MapTo.code.js';

// 提交映射
const recordMapTo = seq(
  // 将创建时间转换成Datetime的字符串
  map2Datetime('创建时间'),
  // 切割时间段为两个Datetime字段
  split2DatetimeRange('时间段'),
  // 删除时间段字段
  deleteField('时间段'),
);

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
      formItemSpan: 6,
    };
  },
  methods: {
    // 提交数据
    commit () {
      const commitValue = this.record.valueOf(recordMapTo);
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
          this.record.set({
            创建时间: GET_MOMENT('2019-6-6'),
            时间段: [GET_MOMENT('2019-01-01'), GET_MOMENT('2020-12-31')],
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
