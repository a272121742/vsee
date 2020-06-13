export default `<template>
  <div>
    <a-page-header
      title="远程搜索"
      sub-title="通过向服务端发送请求获取新的搜索结果"
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
          <a-form-item label="远程搜索-单选-车型">
            <single-net-select
              v-model="record['下拉单选']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicleseries/seriesCodeList"
              value-by="vhclSeriesCode"
              label-of="vhclSeriesCode"
              search-by="name"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="formItemSpan * 2">
          <a-form-item label="远程搜索-多选-车型">
            <multiple-net-select
              v-model="record['下拉多选']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/vehicleseries/seriesCodeList"
              value-by="vhclSeriesCode"
              label-of="vhclSeriesCode"
              search-by="name"
              allow-clear
              :max-tag-count="2"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
  </template>

  <script>
  import formRecord from '@mix/form-record.js';
  import code from './Remote.code.js';

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
            下拉单选: 'C11',
            下拉多选: ['EL150', 'EU180', 'EC180'],
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
