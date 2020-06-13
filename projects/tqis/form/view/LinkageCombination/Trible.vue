<template>
  <div>
    <a-page-header
      title="级联联动"
      sub-title="具备上下级别的联动组合"
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
      ref="form"
      :model="record"
      layout="vertical"
    >
      <a-row :gutter="24">
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="所属系统"
            :rules="[$v.required('不能为空')]"
            label="所属系统"
          >
            <single-net-select
              v-model="record['所属系统']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/pfscategory?p_id=0"
              value-by="id"
              label-of="name"
              seary-by="name"
              allow-clear
              @change="changeSystem"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="所属功能"
            :rules="[$v.required('不能为空')]"
            label="所属功能"
          >
            <single-net-select
              v-model="record['所属功能']"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfscategory?p_id=${record['所属系统']}`"
              :delay="!record['所属系统']"
              :cache="false"
              :disabled="!record['所属系统']"
              value-by="id"
              label-of="name"
              allow-clear
              @change="changeFeatures"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="故障代码"
            :rules="[$v.required('不能为空')]"
            label="故障代码"
          >
            <single-net-select
              v-model="record['故障代码']"
              :placeholder="$t('form.select')"
              :url="`/masterdata/v1/pfsfault?psId=${record['所属功能']}`"
              :delay="!record['所属功能']"
              :cache="false"
              :disabled="!record['所属功能']"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import formRecord from '@mix/form-record.js';
import code from './Trible.code.js';

import('./Trible.vue').then((res) => {
  console.log(res);
});


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
    // 所属系统切换事件
    changeSystem () {
      // 方法一，清空法
      this.record.clear(['所属功能', '故障代码']);
      // 方法二，赋值法
      // this.record.set({ 所属功能: null, 故障代码: null });
      // 方法三，代理赋值法
      // this.$set(this.record, '所属功能', null);
      // this.$set(this.record, '故障代码', null);
    },
    // 所属功能切换事件
    changeFeatures () {
      // 方法一，清空法
      this.record.clear(['故障代码']);
      // 方法二，赋值法
      // this.record.set({ 故障代码: null });
      // 方法三，代理赋值法
      // this.$set(this.record, '故障代码', null);
    },
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
            所属系统: '100000000000000002',
            所属功能: '100000000000000026',
            故障代码: '100000000000000097',
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
