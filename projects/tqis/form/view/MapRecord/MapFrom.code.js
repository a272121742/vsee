export default `<template>
  <div>
    <a-page-header
      title="赋值映射"
      sub-title="将一组原始值通过映射设置到表单中"
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
  import formRecord, {
  map2Moment, zip2MomentRange, deleteField,
  } from '@mix/form-model-record.js';
  import { seq } from '@util/fnhelper.js';
  import code from './MapFrom.code.js';

  // 回显映射
  const recordMapForm = seq(
  // 将创建日期，转换成Moment格式
  map2Moment('创建时间'),
  // 将（时间段Start, 时间段End）合并成时间段的Moment数组格式
  zip2MomentRange('时间段'),
  deleteField(['时间段Start', '时间段End']),
  );

  export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    formRecord({
      map: recordMapForm,
    }),
  ],
  data () {
    return {
      showSource: false,
      code,
      action: false,
      formItemSpan: 6,
      // record: {
      //   创建时间: '2019-6-6',
      //   时间段Start: '2019-01-01',
      //   时间段End: '2020-12-31',
      // },
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
          this.record.set({
            创建时间: '2019-6-6',
            时间段Start: '2019-01-01',
            时间段End: '2020-12-31',
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
