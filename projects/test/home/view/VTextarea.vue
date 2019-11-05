<template>
  <div class="v-textarea">
    <a-textarea
      :value="text"
      v-bind="$attrs"
      v-on="exclude(['change'], $listeners)"
      @change="handleChange"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />
    <div
      v-if="showHelper"
      :class="[helperOut ? 'v-input-helper-out' : 'v-input-helper']"
    >
      <span
        v-show="allowClear"
        class="v-input-suffix"
      >
        <a-icon
          v-show="text"
          slot="suffix"
          type="close-circle"
          theme="filled"
          @click="triggerChange()"
        />
      </span>
      <span
        v-if="limit"
        :style="{ 'margin-right': text && allowClear ? 0 : '18px'}"
        class="v-input-limit"
      >{{ length }} / {{ limit }}</span>
    </div>
  </div>
</template>

<script>
import { omit } from 'ramda';

function hasProp (instance, selfProp) {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return selfProp in propsData;
}
function getLength (text = '', isZh = false) {
  const transValue = text.replace(/[^\x00-\xff]/g, isZh ? '**' : '*');
  return transValue.length;
}
function zhSubString (text = '', length = 0) {
  let len = 0;
  let limit = 0;
  for (const c of text) {
    const charCode = c.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {  
      len++;
    } else {
      len += 2;
    }
    if (len > length) {
      break;
    } else if (len === length) {
      limit++;
      break;
    } else {
      limit++;
    }
  }
  return text.substr(0, limit || void 0);
}

export default {
  props: {
    /**
     * textarea的值
     */
    value: {
      type: String,
      default: undefined
    },
    /**
     * 长度限制
     */
    limit: {
      type: Number,
      default: 0
    },
    /**
     * 是否启用中文模式（中文模式下一个中文字符长度为2）
     */
    zh: {
      type: Boolean,
      default: false
    },
    /**
     * 是否支持清除
     */
    allowClear: {
      type: Boolean,
      default: false
    },
    /**
     * 外部辅助（文字长度显示和清除按钮会在外部）
     */
    helperOut: {
      type: Boolean,
      default: false
    },
  },
  data () {
    const value = this.value;
    return {
      text: value,
      exclude: omit,
      composing: false
    };
  },
  computed: {
    /**
     * 文本长度
     */
    length () {
      return getLength(this.composing ? this.cacheText : this.text, this.zh);
    },
    /**
     * 文本中文字树
     */
    zlength () {
      const value = this.text || '';
      return this.length - value.length;
    },
    /**
     * 是否显示helper，配置了allowClear或者limit的时候启用
     */
    showHelper () {
      return this.allowClear || !!this.limit;
    },
    /**
     * 输入框元素
     */
    input () {
      return this.$el.querySelector('textarea');
    }
  },
  watch: {
    value (value) {
      this.text = value;
    }
  },
  methods: {
    handleCompositionStart (e) {
      this.composing = true;
      this.cacheText = e.target.value;
    },
    handleCompositionEnd (e) {
      if (this.composing) {
        this.composing = false;
        this.handleChange(e);
      }
    },
    handleChange (e) {
      const value = e.target.value || '';
      const limitValue = this.zh ? zhSubString(value, this.limit) : value.substr(0, this.limit || void 0);
      const changedValue = this.composing ? e.target.value : limitValue;
      this.triggerChange(changedValue);
    },
    triggerChange (changedValue) {
      if (!hasProp(this, 'value')) {
        this.text = changedValue;
      }
      this.$emit('change', changedValue);
    },
  }
};
</script>
<style lang="less" scoped>
  .v-textarea {
    position: relative;
    .ant-input {
      padding-bottom: 14px;
    }
    .v-input-helper {
      position: absolute;
      display: inline-block;
      background-color: white;
      bottom: 5px;
      right: 17px;
      height: 14px;
      line-height: 100%;
      width: calc(100% - 19px);
      span {
        float: right;
        color: rgba(0, 0, 0, .45);
      }
    }
    .v-input-helper-out {
      height: 14px;
      line-height: 150%;
      width: 100%;
      span {
        float: right;
        color: rgba(0, 0, 0, .45);
      }
    }
    &:hover {
      .v-input-suffix {
        opacity: 0.3;
      }
    }
    .v-input-suffix {
      margin: 0 2px;
      opacity: 0;
      &:hover {
        opacity: .6;
      }
    }
  }
</style>