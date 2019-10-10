<template>
  <a-select
    ref="select"
    v-bind="$attrs"
    :value="value"
    :options="data"
    v-on="$listeners"
    @dropdownVisibleChange="dropdownVisibleChange"
  >
    <a-spin
      slot="notFoundContent"
      v-if="fetching"
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

export default {
  mixins: [fetch],
  props: {
    value: {
      type: [Number, String, Array],
      default: undefined
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
    return {
      /**
       * 数据项
       */
      data: []
    };
  },
  watch: {
    delay (value) {
      !value && this.init();
    }
  },
  created () {
    this.init();
  },
  activated () {
    this.init();
  },
  methods: {
    init () {
      const { url, delay } = this;
      url && !delay && this.fetch().then(data => {
        this.data = data || [];
      });
      this.data = this.$attrs.options || [];
    },
    dropdownVisibleChange (visible) {
      // 如果是展开状态，并且未获得数据时，加载数据
      if (visible && (!this.data.length || !this.cache)) {
        this.data = [];
        this.fetch().then(data => {
          this.data = data || [];
        });
      }
    }
  }
};
</script>
