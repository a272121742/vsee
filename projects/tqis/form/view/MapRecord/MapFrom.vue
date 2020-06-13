<template>
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
            prop="祸首件ID"
            :rules="[$v.required('不能为空')]"
            label="祸首件代码"
          >
            <single-net-select
              v-model="record['祸首件ID']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/part/partList"
              value-by="id"
              label-of="code"
              allow-clear
            >
            </single-net-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="祸首件ID"
            :rules="[$v.required('不能为空')]"
            label="祸首件名称"
          >
            <single-net-select
              v-model="record['祸首件ID']"
              :placeholder="$t('form.select')"
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
import formRecord from '@mix/form-record.js';
// import { GET_MOMENT } from '@util/datetime-helper.js';
import code from './MapFrom.code.js';

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
            祸首件ID: '1001100000000000007',
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
