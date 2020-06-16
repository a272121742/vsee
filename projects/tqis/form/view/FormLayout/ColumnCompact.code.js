export default `<template>
  <div>
    <a-page-header
      sub-title="搜索表单无需校验时可采用紧凑模式缩减空间"
    >
      <template #title>
        紧凑模式
        <a-switch
          v-model="compact"
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
      ref="form"
      :model="record"
      layout="vertical"
      :hide-required-mark="compact"
      :class="{'form-column-split-compact': compact}"
    >
      <a-row :gutter="24">
        <!-- 问题标题 -->
        <a-col :span="formItemSpan * 4">
          <a-form-model-item
            prop="问题标题"
            :rules="[$v.required('不能为空')]"
            label="问题标题"
          >
            <a-input
              v-model="record['问题标题']"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属系统 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="所属系统"
            :rules="[$v.required('不能为空')]"
            label="所属系统"
          >
            <single-net-select
              v-model="record['所属系统']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/pfscategory?p_id=0&page=1&limit=20&order=&orderField=&ids=&cds=&code=&name=&q="
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属功能 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="所属功能"
            :rules="[$v.required('不能为空')]"
            label="所属功能"
          >
            <single-net-select
              v-model="record['所属功能']"
              :placeholder="$t('form.select')"
              :url="\`/masterdata/v1/pfscategory?p_id=\${record['所属系统']}\`"
              :delay="!record['所属系统']"
              :cache="false"
              :disabled="!record['所属系统']"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="故障代码"
            :rules="[$v.required('不能为空')]"
            label="故障代码"
          >
            <single-net-select
              v-model="record['故障代码']"
              :placeholder="$t('form.select')"
              :url="\`/masterdata/v1/pfsfault?psId=\${record['所属功能']}\`"
              :delay="!record['所属功能']"
              :cache="false"
              :disabled="!record['所属功能']"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 创建日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            prop="创建日期"
            :rules="[$v.required('不能为空')]"
            label="创建日期"
          >
            <a-date-picker
              v-model="record['创建日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题描述 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="问题描述"
            :rules="[$v.required('不能为空')]"
            label="问题描述"
          >
            <v-textarea
              v-model="record['问题描述']"
              :limit="1000"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题备注 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            prop="问题备注"
            label="问题备注"
          >
            <v-textarea
              v-model="record['问题备注']"
              :limit="1000"
              helper-out
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
  import { GET_MOMENT } from '@util/datetime-helper.js';
  import code from './ColumnCompact.code.js';

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
    // 验证表单
    validate (callback) {
      if (!this.compact) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            callback.call(this);
          }
          return valid;
        });
      } else {
        callback.call(this);
      }
    },
    // 提交数据
    commit () {
      this.validate(() => {
        const commitValue = this.record.valueOf();
        if (!this.action) {
          this.action = true;
          this.$message.loading(\`正在提交数据\${JSON.stringify(commitValue)}\`, 2, () => {
            this.action = false;
          });
        }
        console.log(commitValue);
      });
    },
    // 加载数据
    load () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const id = setTimeout(() => {
          this.record.load({
            问题标题: '车身锁系统开闭状态信号显示错误',
            所属系统: '100000000000000006',
            所属功能: '100000000000000060',
            故障代码: '100000000000000461',
            创建日期: GET_MOMENT(new Date()),
            问题描述: '车身锁系统开闭状态信号显示错误',
            问题备注: '希望改进',
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
