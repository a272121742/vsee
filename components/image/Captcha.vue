<template>
  <a-spin :spinning="spinning">
    <img
      :src="src"
      @click="$emit('click')"
    >
  </a-spin>
</template>

<script>
import $ from '@lib/ajax.js';
import fetch from '@mix/fetch.js';

export default {
  mixins: [fetch],
  props: {
    // 请求地址
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 地址
      src: '',
      // 加载状态
      spinning: false
    };
  },
  watch: {
    url () {
      this.loadCaptche();
    }
  },
  created () {
    this.loadCaptche();
  },
  methods: {
    loadCaptche (first) {
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
  .ant-spin-nested-loading {
    display: inline-table;
  }
</style>
