<template>
  <a-input
    ref="input"
    v-bind="$attrs"
    :value="text"
    class="clear-input"
    v-on="$listeners"
    @change="e => text = e.target.value"
  >
    <!-- slot继承 -->
    <template
      v-for="(_, slot) of $scopedSlots"
      v-slot:[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
    <template v-if="allowClear">
      <a-icon
        v-show="text"
        slot="suffix"
        class="allow-clear"
        type="close-circle"
        theme="filled"
        @click="clear"
      />
    </template>
    <a-spin
      slot="suffix"
      :spinning="spinning"
      class="captcha"
    >
      <img
        :src="src"
        @click="$emit('click-captcha')"
      />
    </a-spin>
  </a-input>
</template>

<script>
import fetch from '@mix/fetch.js';

export default {
  mixins: [fetch],
  props: {
    /**
     * 请求地址
     */
    url: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: undefined
    },
    /**
     * 是否允许自动清除
     */
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const value = this.value || '';
    return {
      text: value,
      // 地址
      src: '',
      // 加载状态
      spinning: false
    };
  },
  watch: {
    value (value) {
      this.text = value;
    },
    url () {
      this.loadCaptche();
    }
  },
  created () {
    this.loadCaptche();
  },
  methods: {
    clear () {
      this.$emit('change', { target: { value: null } });
      this.text = null;
    },
    loadCaptche () {
      if (!this.spinning) {
        this.spinning = true;
        if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(this.url)) {
          this.src = this.url;
          this.spinning = false;
          // !first && this.$emit('click');
        } else {
          this.fetch({ responseType: 'arraybuffer' }).then(res => {
            if (/^data:image\/(png|jpe?g|gif|svg);base64,/.test(res)) {
              this.src = res;
            } else if (res instanceof ArrayBuffer) {
              this.src = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            }
            this.spinning = false;
            // !first && this.$emit('change');
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .clear-input {
    /deep/ .allow-clear {
      opacity: 0;
    }
    &:hover {
      /deep/ .allow-clear {
          opacity: .3;
        &:hover {
          opacity: .8;
        }
      }
    }
  }
  .ant-input-affix-wrapper, .ant-input-affix-wrapper-lg, .ant-input-affix-wrapper-sm {
    /deep/ .captcha {
      margin-left: 12px;
      min-width: 40px;
      img {
        cursor: pointer;
        border: 1px solid transparent!important;
        border-radius: 0 4px 4px 0;
      }
    }
  }
  .ant-input-affix-wrapper .captcha img{
    height: 32px;
  }
  .ant-input-affix-wrapper-lg .captcha img{
    height: 40px;
  }
  .ant-input-affix-wrapper-sm .captcha img{
    height: 24px;
  }
  /deep/ .ant-input-suffix {
    right: 0;
    align-items: center;
    display: inline-flex;
  }

</style>
