<template>
  <a-select
    v-bind="$options.exclude(['mode', 'options', 'label-in-value'], $attrs)"
    label-in-value
    mode="multiple"
    :value="labelValue"
    :default-active-first-option="false"
    :options="options"
    :show-search="!closeSearch"
    :filter-option="$attrs['filter-option'] || filterOption"
    :disabled="$attrs.disabled || rending"
    :get-popup-container="el => el.parentNode"
    show-arrow
    v-on="$options.exclude(['change'], $listeners)"
    @dropdownVisibleChange="dropdownVisibleChange"
    @search="onTextChange"
    @change="onChange"
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
  </a-select>
</template>

<script>
import { omit, prop, uniqWith } from 'ramda';
import { debounce } from 'lodash';
import { renameKey } from '@util/datahelper.js';
import $ from '@http';

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 20;
const ORDER_DEFAULT = '';
const ORDER_FIELD_DEFAULT = '';
const CODE_DEFAULT = '';
const NAME_DEFAULT = '';
// const Q_DEFAULT = '';


const key2value = renameKey('key', 'value');
// const value2key = renameKey('value', 'key');
const uniqOption = uniqWith((a, b) => (a.value || a.key) === (b.value || b.key));

function hasProp (instance, selfProp) {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return selfProp in propsData;
}
// function transformQuery (query) {
//   const transQuery = {};
//   for (const i in query) {
//     const value = query[i];
//     if (typeof (value) === 'string' && (~value.indexOf('${search}') || ~value.indexOf('${value}'))) {
//       delete transQuery[i];
//     } else {
//       transQuery[i] = value;
//     }
//   }
//   return transQuery;
// }

export default {
  props: {
    // 基于网络的下拉列表，url的配置是必须
    url: {
      type: String,
      required: true,
    },
    // 显示值
    labelOf: {
      type: [String, Function],
      required: true,
    },
    // 传递值
    valueBy: {
      type: String,
      required: true,
    },
    // 查询值
    searchBy: {
      type: String,
      default: '',
      validator (value) {
        return ['code', 'name', 'all', ''].includes(value);
      },
    },
    // 排序字段
    orderField: {
      type: String,
      default: '',
    },
    // 排序方式
    order: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: void 0,
    },
    // 是否强制关闭搜索
    closeSearch: {
      type: Boolean,
      default: false,
    },
    /**
     * 形式为{}，会写入到q中
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
    /**
     * 是否延时，即在点击之后加载，默认不延时
     */
    delay: {
      type: Boolean,
      default: true,
    },
  },
  // 排除可能影响内部组件的外部参数
  exclude: omit,
  data () {
    return {
      /**
       * 数据集，每一项的格式为 { value, label }
       */
      options: [],
      /**
       * `{ value, label }`格式的值
       */
      labelValue: void 0,
      /**
       * 判断是否输入法打字中，`true`表示正在打字中
       */
      // composing: false,
      /**
       * 是否正在请求中，`true`表示网络请求完成
       */
      fetching: false,
      /**
       * 组件值加载状态，`true`表示值渲染完成
       */
      rending: false,
      searchWord: void 0,
    };
  },
  computed: {
    params () {
      const query = this.query || {};
      const page = query.page > 0 ? (Math.floor(query.page) || PAGE_DEFAULT) : PAGE_DEFAULT;
      const limit = query.limit > 0 ? (Math.floor(query.limit) || LIMIT_DEFAULT) : LIMIT_DEFAULT;
      const order = this.order || ORDER_DEFAULT;
      const orderField = this.orderField || ORDER_FIELD_DEFAULT;
      let ids = [];
      let cds = [];
      if (this.valueBy === 'id') {
        ids = this.value ? [...this.value] : [];
      }
      if (this.valueBy === 'code') {
        cds = this.value ? [...this.value] : [];
      }
      const q = JSON.stringify(this.query || {});
      let code = CODE_DEFAULT;
      let name = NAME_DEFAULT;
      if (this.searchBy === 'code') {
        code = this.searchWord || '';
      } else if (this.searchBy === 'name') {
        name = this.searchWord || '';
      } else if (this.searchBy === 'all') {
        code = this.searchWord || '';
        name = this.searchWord || '';
      }
      return {
        page,
        limit,
        order,
        orderField,
        ids,
        cds,
        code,
        name,
        q,
      };
    },
    /**
     * 后缀样式
     */
    suffixType () {
      return this.rending ? 'loading' : 'down';
    },
    /**
     * 搜索模式，如果上层组件配置了`filter-option`，则按照上层组件进行本地搜索，否则查看是否配置了关键字搜索，有关键字搜索时才进行关键字搜索，否则仍然进行原生的本地搜索
     */
    filterOption () {
      return this.$attrs['filter-option'] || this.searchBy ? false : (input = '', option) => {
        const label = option.componentOptions.children[0].text || '';
        return ~label.toLowerCase().indexOf(input.toLowerCase());
      };
    },
    // wordKey () {
    //   const index = Object.values(this.query).indexOf('${search}');
    //   return Object.keys(this.query)[index];
    // },
    // valueKey () {
    //   const index = Object.values(this.query).indexOf('${value}');
    //   return Object.keys(this.query)[index];
    // },
    /**
     * 输入框元素
     */
    input () {
      return this.$el.querySelector('input');
    },
  },
  watch: {
    /**
     * 监听`delay`的更改，在两个**select**关联时有用，
     * `delay`被修改为`false`时，立刻获取数据
     */
    delay (value) {
      !value && this.init();
    },
    /**
     * 监听上层组件`value`值的修改
     * 外部`value`发生变化时，检查lableValue是否完整，如果不完整，表明是回显状态
     */
    value: {
      immediate: true,
      handler (value) {
        // 如果值不为空数组
        if (value && value.length) {
          this.rending = true;
          const labelValue = this.options.filter((opt) => ~value.indexOf(opt.value)).map((item) => ({ key: item.value, label: item.label }));
          if (labelValue && labelValue.length) {
            this.labelValue = labelValue;
            this.rending = false;
          } else {
            const config = {};
            // const { valueKey } = this;
            // if (valueKey) {
            //   config[valueKey] = value;
            // }
            this.fetch(config).then((list) => {
              this.labelValue = list.filter((item) => ~value.indexOf(item.value)).map((item) => ({ key: item.value, label: item.label }));
              this.options = list;
            }).finally(() => {
              this.rending = false;
            });
          }
        } else {
          this.labelValue = void 0;
        }
      },
    },
  },
  created () {
    this.init();
  },
  mounted () {
    if (this.input) {
      this.input.readOnly = this.closeSearch;
      if (this.closeSearch) {
        this.$el.querySelector('.ant-select-selection').style.cursor = 'pointer';
      }
    }
  },
  methods: {
    init () {
      const { url, delay } = this;
      // 非延时，或回显时，立刻获取数据;
      url && !delay && this.fetch({}).then((list) => {
        const selectValue = [];
        const options = uniqOption([...selectValue.map(key2value), ...list]);
        this.options = options;
      });
    },
    /**
     * 点击下拉时获取数据，以下情况满足时获取进行网络拉取
     * 1. 下拉展开时，
     */
    dropdownVisibleChange (visible) {
      this.searchWord = '';
      if (visible) {
        this.options = [];
        this.fetching = true;
        this.fetch({}).then((list) => {
          this.options = list;
        }).finally(() => {
          this.fetching = false;
        });
      }
    },
    /**
     * 文本搜索，如果配置了本地搜索则不走网络
     */
    onTextChange: debounce(function onTextChange (word = '') {
      // 如果有单词，并且配置了`word-key`
      if (!this.filterOption) {
        this.searchWord = word;
        this.fetching = true;
        this.fetch({}).then((list) => {
          this.options = list;
        }).finally(() => {
          this.fetching = false;
        });
      }
    }, 200),
    /**
     * 发起网络请求，可携带额外的参数`config`
     * 注意：`fetch`函数不应该防抖
     */
    fetch (config) {
      const {
        url, labelOf, valueBy, params,
      } = this;
      // const query = transformQuery(this.query);
      return new Promise((resolve) => {
        if (config) {
          url && $.get(url, { ...params, ...config }).then((res = []) => {
            const list = res.map((item) => ({
              label: typeof labelOf === 'function' ? labelOf(item) : item[labelOf],
              value: item[valueBy],
            }));
            resolve(uniqOption(list));
          }).catch(() => {
            resolve([]);
          });
        } else {
          resolve([]);
        }
      });
    },
    /**
     * 必要的onChange事件，将`{ value, label }`类型值转换为`value`
     */
    onChange (labelValue, VNode) {
      if (!hasProp(this, 'value')) {
        this.labelValue = labelValue;
      }
      this.labelValue = labelValue;
      if (labelValue && labelValue.length) {
        this.$emit('change', labelValue.map(prop('key')), labelValue.map(prop('label')), VNode);
      } else {
        this.$emit('change', void 0, void 0, VNode);
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-select {
    /deep/ .ant-select-selection--multiple {
      padding-bottom: 0;
    }
  }
</style>
