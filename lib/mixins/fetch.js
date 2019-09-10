import $ from '@lib/ajax.js';

export default {
  props: {
    /**
     * 请求接口的地址
     */
    url: {
      type: String,
      default: undefined
    },
    /**
     * 转换函数
     */
    transform: {
      type: Function,
      default: id => id
    }
  },
  data () {
    return {
      /**
       * 加载中
       */
      fetching: false
    }
  },
  methods: {
    fetch (config) {
      return new Promise((resolve, reject) => {
        const { url, transform } = this;
        if (!this.fetching) {
          this.fetching = true;
          url && $.get(url, undefined, config).then(res => {
            const data = transform(res || []);
            this.$emit('fetch', data);
            resolve(data);
          }).finally(() => {
            this.$nextTick(() => {
              this.fetching = false;
            })
          })
        }
      });
    }
  }
}
