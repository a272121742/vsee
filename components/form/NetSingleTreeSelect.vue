<template>
  <a-tree-select
    ref="tree-select"
    v-bind="$attrs"
    label-in-value
    allow-clear
    :value="labelValue"
    :tree-data="options"
    :show-search="true"
    :disabled="$attrs.disabled || rending"
    :filter-tree-node="filterTreeNode"
    :dropdown-style="{ 'max-height': '300px', 'min-height': 'auto' }"
    dropdown-match-select-width
    show-arrow
    @change="handlerChange"
  >
    <template #suffixIcon>
      <a-icon :type="suffixType" />
    </template>
    <template #notFoundContent>
      <a-spin
        v-if="fetching"
        size="small"
      >
        <a-icon
          slot="indicator"
          type="loading"
          spin
        />
      </a-spin>
      <a-empty
        v-else
      />
    </template>
  </a-tree-select>
</template>

<script>
import { treeFind } from '@util/datahelper.js';
import $ from '@http';

// function hasProp (instance, selfProp) {
//   const $options = instance.$options || {};
//   const propsData = $options.propsData || {};
//   return selfProp in propsData;
// }
function transformQuery (query) {
  const transQuery = {};
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (typeof (value) === 'string' && (~value.indexOf('${search}') || ~value.indexOf('${value}'))) {
      delete transQuery[key];
    } else {
      transQuery[key] = value;
    }
  });
  return transQuery;
}

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    // 下拉列表的值，或单对象，或数组，该属性由`v-decorator`控制
    value: {
      type: [Number, String, Array],
      default: void 0,
    },
    // 是否关闭搜索
    closeSearch: {
      type: Boolean,
      default: false,
    },
    /**
     * 形式为：
     * {
     *   id: '${value}', // 绑定值查询
     *   name: '${search}', // 绑定搜索查询
     *   something: 'something'
     * }
     */
    query: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否缓存
     */
    cache: {
      type: Boolean,
      default: true,
    },
    // 链接地址
    url: {
      type: String,
      default: '',
    },
    // 数据转换函数
    transform: {
      type: Function,
      default: (id) => id,
    },
  },
  data () {
    return {
      /**
       * 数据集，每一项的格式为 { value, label, children, [disabled, disableCheckbox, selectable] }
       */
      options: [],
      /**
       * `{ value, label }`格式的值
       */
      labelValue: void 0,
      /**
       * 判断是否输入法打字中，`true`表示正在打字中
       */
      composing: false,
      /**
       * 是否正在请求中，`true`表示网络请求完成
       */
      fetching: false,
      /**
       * 组件值加载状态，`true`表示值渲染完成
       */
      rending: false,

    };
  },
  computed: {
    /**
     * 后缀样式
     */
    suffixType () {
      return this.rending ? 'loading' : 'down';
    },
    wordKey () {
      const index = Object.values(this.query).indexOf('${search}');
      return Object.keys(this.query)[index];
    },
    valueKey () {
      const index = Object.values(this.query).indexOf('${value}');
      return Object.keys(this.query)[index];
    },
    /**
     * 输入框元素
     */
    input () {
      return this.$el.querySelector('input');
    },
  },
  watch: {
    value: {
      immediate: true,
      handler (value) {
        // 如果为undefined，则表示创建或者没值，否则表示回显
        if (value !== void 0 && value !== null) {
          // 通过网络回显
          if (!this.labelValue || !this.labelValue.label) {
            const config = {};
            const { valueKey } = this;
            if (valueKey) {
              config[valueKey] = value;
            }
            this.rending = true;
            this.fetch(config).then((list) => {
              this.labelValue = treeFind((item) => item.value === value, list);
            }).finally(() => {
              this.rending = false;
            });
          }
        } else {
          this.labelValue = value;
        }
      },
    },
  },
  created () {
    this.init();
  },
  methods: {
    fetch (config) {
      const { url, transform } = this;
      const query = transformQuery(this.query);
      return new Promise((resolve) => {
        if (config) {
          url && $.get(url, { ...query, ...config }).then((res = []) => {
            resolve(transform(res));
          }).catch(() => {
            resolve([]);
          });
        } else {
          resolve([]);
        }
      });
    },
    init () {
      this.fetching = true;
      const { url } = this;
      // 非延时，或回显时，立刻获取数据;
      url && this.fetch({}).then((list) => {
        this.options = list;
      }).finally(() => {
        this.fetching = false;
      });
    },
    handlerChange (labelValue, label, extra) {
      this.labelValue = labelValue;
      if (labelValue === void 0 || labelValue === null) {
        this.$emit('change', null, null);
      } else {
        this.$emit('change', labelValue.key || labelValue.value || null, extra.triggerNode.label || null);
      }
    },
    filterTreeNode (input = '', treeNode) {
      const label = treeNode.componentOptions.propsData.label || '';
      return ~label.toLowerCase().indexOf(input.toLowerCase());
    },
  },
};
</script>

<style lang="less" scoped>

</style>
