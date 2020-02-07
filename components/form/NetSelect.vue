<template>
  <a-select
    v-bind="exclude(['options', 'label-in-value'], $attrs)"
    label-in-value
    :value="labelValue"
    :default-active-first-option="false"
    :options="options"
    :show-search="!closeSearch"
    :filter-option="$attrs['filter-option'] || filterOption"
    :disabled="$attrs.disabled || rending"
    :max-tag-count="$attrs['max-tag-count'] || 0"
    :get-popup-container="el => el.parentNode"
    v-on="exclude(['change'], $listeners)"
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
import { debounce, isArray } from 'lodash';
import { renameKey } from '@util/datahelper.js';
import $ from '@http';

const key2value = renameKey('key', 'value');
// const value2key = renameKey('value', 'key');
const uniqOption = uniqWith((a, b) => (a.value || a.key) === (b.value || b.key));

function hasProp (instance, selfProp) {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return selfProp in propsData;
}
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
  props: {
    value: {
      type: [Number, String, Array],
      default: undefined,
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
    /**
     * 是否延时，即在点击之后加载，默认不延时
     */
    delay: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: undefined,
    },
    transform: {
      type: Function,
      default: (id) => id,
    },
  },
  data () {
    return {
      /**
       * 排除可能影响内部组件的外部参数
       */
      exclude: omit,
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
    /**
     * 搜索模式，如果上层组件配置了`filter-option`，则按照上层组件进行本地搜索，否则查看是否配置了关键字搜索，有关键字搜索时才进行关键字搜索，否则仍然进行原生的本地搜索
     */
    filterOption () {
      return this.$attrs['filter-option'] || this.wordKey ? false : (input = '', option) => {
        const label = option.componentOptions.children[0].text || '';
        return ~label.toLowerCase().indexOf(input.toLowerCase());
      };
    },
    wordKey () {
      const index = Object.values(this.query).indexOf('${search}');
      return Object.keys(this.query)[index];
    },
    valueKey () {
      const index = Object.values(this.query).indexOf('${value}');
      return Object.keys(this.query)[index];
    },
    isMultiple () {
      return this.$attrs.mode === 'multiple';
    },
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
        // 如果为undefined，则表示创建或者没值，否则表示回显
        if (value !== void 0 && value !== null) {
          if (isArray(value)) {
            // this.labelValue = value.map(item => ({ value: item, label: void 0 }));
            this.rending = true;
            const labelValue = this.options.filter((opt) => ~value.indexOf(opt.value)).map((item) => ({ key: item.value, label: item.label }));
            if (labelValue && labelValue.length) {
              this.labelValue = labelValue;
              this.rending = false;
            } else {
              const config = {};
              const { valueKey } = this;
              if (valueKey) {
                config[valueKey] = value;
              }
              this.fetch(config).then((list) => {
                this.labelValue = list.filter((item) => ~value.indexOf(item.value)).map((item) => ({ key: item.value, label: item.label }));
                this.options.unshift(...list);
                this.options = uniqOption(this.options);
              }).finally(() => {
                this.rending = false;
              });
            }
          } else {
            this.labelValue = {
              value,
              label: void 0,
            };
            this.rending = true;
            // 从options中查找label
            const labelValue = this.options.find((item) => item.value === value);
            // 如果存在，则表示已经加载过，
            if (labelValue) {
              this.labelValue = labelValue;
              this.rending = false;
            } else {
            // 否则从网络获取
              const config = {};
              const { valueKey } = this;
              if (valueKey) {
                config[valueKey] = value;
              }
              this.fetch(config).then((list) => {
                this.labelValue = list.find((item) => item.value === value);
              }).finally(() => {
                this.rending = false;
              });
            }
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
      this.compositionstart = this.input.addEventListener('compositionstart', () => {
        this.composing = true;
      });
      this.compositionend = this.input.addEventListener('compositionend', (e) => {
        const word = e.target.value;
        this.composing = false;
        this.onTextChange(word);
      });
      this.input.readOnly = this.closeSearch;
      if (this.closeSearch) {
        this.$el.querySelector('.ant-select-selection').style.cursor = 'pointer';
      }
    }
  },
  destroyed () {
    if (this.input) {
      this.input.removeEventListener('compositionstart', this.compositionstart);
      this.input.removeEventListener('compositionend', this.compositionend);
    }
  },
  methods: {
    init () {
      const { url, delay } = this;
      // 非延时，或回显时，立刻获取数据;
      url && !delay && this.fetch({}).then((list) => {
        const selectValue = this.isMultiple ? (this.labelValue || []) : [];
        const options = uniqOption([...selectValue.map(key2value), ...list]);
        this.options = options;
      });
    },
    /**
     * 点击下拉时获取数据，以下情况满足时获取进行网络拉取
     * 1. 下拉展开时，
     * 2. 下拉列表为空时，或设置了不缓存数据时，或者多选模式下没有刷新数据时
     */
    dropdownVisibleChange (visible) {
      if (visible && (!this.options.length || (this.labelValue && this.options.length <= this.labelValue.length) || !this.cache)) {
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
      if (!this.composing && !this.filterOption) {
        const config = {};
        if (this.wordKey && word) {
          config[this.wordKey] = word;
        }
        this.fetching = true;
        this.fetch(config).then((list) => {
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
      const { url, transform } = this;
      const query = transformQuery(this.query);
      const selectValue = this.isMultiple ? (this.labelValue || []) : [];
      return new Promise((resolve) => {
        if (config) {
          url && $.get(url, { ...query, ...config }).then((res = []) => {
            const list = transform(res);
            resolve([...selectValue.map(key2value), ...list]);
          }).catch(() => {
            resolve([...selectValue.map(key2value)]);
          });
        } else {
          resolve(selectValue);
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
      if (isArray(labelValue)) {
        this.labelValue = labelValue;
        if (labelValue && labelValue.length) {
          this.$emit('change', labelValue.map(prop('key')), VNode);
        } else {
          this.$emit('change', void 0, VNode);
        }
      } else if (labelValue) {
        this.$emit('change', labelValue.key, VNode);
      } else {
        this.$emit('change', void 0, VNode);
      }
    },
  },
};
</script>

<style lang="less" scoped>
  // 多选标签样式修改
  /deep/ .ant-select-selection--multiple {
    padding-bottom: 2px !important;
    .ant-select-selection__choice {
      max-width: 40%;
    }
    .ant-select-search--inline {
      max-width: 60%;
    }
  }
</style>
