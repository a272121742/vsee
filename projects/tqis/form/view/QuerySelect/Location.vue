<template>
  <div>
    <a-page-header
      title="本地搜索"
      sub-title="少量数据启用本地搜索模式"
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
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="下拉单选"
            label="下拉单选-祸首件"
          >
            <single-net-select
              v-model="record['下拉单选']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/part/partList"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="下拉多选"
            label="下拉多选-祸首件"
          >
            <multiple-net-select
              v-model="record['下拉多选']"
              :placeholder="$t('form.select')"
              :max-tag-count="2"
              url="/masterdata/v1/part/partList"
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
import formRecord from '@mix/form-model-record.js';
import code from './Location.code.js';

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
            下拉单选: '1001100000000000002',
            下拉多选: ['1001100000000000003', '1001100000000000005', '1001100000000000007'],
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
