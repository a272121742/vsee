<template>
  <div>
    <a-page-header
      title="联想输入"
      sub-title="保留用户输入以提供外部列表模糊搜索功能"
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
            prop="查询选项"
            label="查询选项-供应商代码"
          >
            <net-auto-complete
              v-model="record['查询选项']"
              url="/masterdata/v1/part/partList"
              :placeholder="$t('form.input')"
              allow-clear
              dropdown-match-select-width
              value-by="name"
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
import code from './Complete.code.js';

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
            查询选项: '右装饰板总成',
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
