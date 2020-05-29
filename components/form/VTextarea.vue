<template>
  <span class="v-textarea ant-input-affix-wrapper">
    <a-textarea
      :value="text"
      v-bind="$attrs"
      v-on="exclude(['change'], $listeners)"
      @change="handleChange"
    />
    <div
      v-if="showHelper"
      :class="[helperOut ? 'v-input-helper-out' : 'v-input-helper']"
    >
      <span
        v-show="allowClear"
        class="v-input-suffix"
        @click="triggerChange"
      >
        <a-icon
          v-show="text"
          slot="suffix"
          type="close-circle"
          theme="filled"
        />
      </span>
      <span
        v-if="limit"
        :style="{ 'margin-right': text && allowClear ? 0 : '21px'}"
        class="v-input-limit"
      >{{ length }} / {{ limit }}</span>
    </div>
  </span>
</template>

<script>
import { omit } from 'ramda';

function hasProp (instance, selfProp) {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return selfProp in propsData;
}
function getLength (t = '', isZh = false) {
  const text = t || '';
  const transValue = text.replace(/[^\x00-\xff]/g, isZh ? '**' : '*');
  return transValue.length;
}
function zhSubString (t = '', length = 0) {
  const text = t || '';
  let len = 0;
  let limit = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const charCode = c.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      len += 1;
    } else {
      len += 2;
    }
    if (len > length) {
      break;
    } else if (len === length) {
      limit += 1;
      break;
    } else {
      limit += 1;
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
      default: undefined,
    },
    /**
     * 长度限制
     */
    limit: {
      type: Number,
      default: 0,
    },
    /**
     * 是否启用中文模式（中文模式下一个中文字符长度为2）
     */
    zh: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否支持清除
     */
    allowClear: {
      type: Boolean,
      default: false,
    },
    /**
     * 外部辅助（文字长度显示和清除按钮会在外部）
     */
    helperOut: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    const value = this.value || '';
    const limitValue = this.zh ? zhSubString(value, this.limit) : value.substr(0, this.limit || void 0);
    return {
      text: value === undefined ? value : limitValue,
      exclude: omit,
    };
  },
  computed: {
    /**
     * 文本长度
     */
    length () {
      return getLength(this.text, this.zh);
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
    },
  },
  watch: {
    value (value) {
      this.text = value;
    },
  },
  methods: {
    handleChange (e) {
      const value = e.target.value || '';
      const limitValue = this.zh ? zhSubString(value, this.limit) : value.substr(0, this.limit || void 0);
      if (this.text !== limitValue) {
        this.triggerChange(limitValue);
      }
    },
    triggerChange (changedValue) {
      if (!hasProp(this, 'value')) {
        this.text = changedValue;
      }
      this.$emit('change', changedValue);
    },
  },
};
</script>
<style lang="less" scoped>
  .v-textarea {
    .v-input-helper {
      position: absolute;
      display: inline-block;
      background-color: white;
      bottom: 6px;
      right: 14px;
      height: 14px;
      line-height: 100%;
      width: calc(100% - 15px);
      span {
        float: right;
        color: rgba(0, 0, 0, .45);
      }
    }
    .v-input-helper-out {
      margin-top: -2px;
      height: 14px;
      line-height: 100%;
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
      cursor: pointer;
      margin: 0 2px 0 7px;
      opacity: 0;
      font-size: 12px;
      &:hover {
        opacity: .6;
      }
    }
  }
</style>
