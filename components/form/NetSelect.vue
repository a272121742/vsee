<template>
  <a-select
    v-bind="$attrs"
    :value="value"
    :options="data"
    v-on="$listeners"
    @dropdownVisibleChange="dropdownVisibleChange"
    @search="onTextChange"
  >
    <a-spin
      v-if="fetching"
      slot="notFoundContent"
      size="small"
    >
      <a-icon
        slot="indicator"
        type="loading"
        spin
      />
    </a-spin>
  </a-select>
</template>

<script>
import fetch from '@mix/fetch.js';
import { debounce } from 'lodash';


export default {
  mixins: [fetch],
  props: {
    value: {
      type: [Number, String, Array],
      default: undefined
    },
    /**
     * 搜索关键字所对应服务端的键
     */
    wordKey: {
      type: String,
      default: 'name'
    },
    /**
     * 是否缓存
     */
    cache: {
      type: Boolean,
      default: true
    },
    /**
     * 是否延时，即在点击之后加载
     */
    delay: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const vm = this;
    return {
      /**
       * 数据项
       */
      data: [],
      // 回显状态
      reshown: vm.value !== undefined,
      // 判断是否输入法打字中，为true的时候表示正在打字
      composing: false
    };
  },
  computed: {
    // 输入框
    input () {
      return this.$el.querySelector('input');
    }
  },
  watch: {
    delay (value) {
      !value && this.init();
    },
    value (value) {
      if (value !== void 0) {
        this.url && this.fetch({ id: value }).then(list => {
          this.data = list;
        });
      }
    }
  },
  created () {
    // 生成截流函数
    this.onTextChange = debounce(this.onTextChange, 200);
    this.init();
  },
  mounted () {
    // 挂载时
    if (this.input) {
      this.input.addEventListener('compositionstart', () => {
        this.composing = true;
      });
      this.input.addEventListener('compositionend', (e) => {
        const word = e.target.value;
        this.composing = false;
        this.onTextChange(word);
      });
    }
  },
  methods: {
    init () {
      this.data = this.$attrs.options || [];
      const { url, delay, value } = this;
      // 如果有value值，则获取该value值的显示label
      if (value !== void 0) {
        url && this.fetch({ id: value }).then(list => {
          this.data = list;
        });
      }
      // 非延时，或回显时，立刻获取数据;
      url && !delay && this.fetch().then(data => {
        this.data = data || [];
      });
    },
    dropdownVisibleChange (visible) {
      // 如果是展开状态，并且未获得数据时，加载数据
      if (visible && (!this.data.length || this.data.length === 1 || !this.cache)) {
        this.data = [];
        this.fetch().then(data => {
          this.data = data || [];
        });
      }
    },
    onTextChange (word) {
      // 如果有单词，并且配置了`word-key`
      if (!this.composing && !this.$attrs['filter-option']) {
        const config = {};
        if (this.wordKey) {
          config[this.wordKey] = word;
        }
        // 这里要做节流处理
        this.fetch(config).then(data => {
          this.data = data;
        });
      }
    }
  }
};
</script>
