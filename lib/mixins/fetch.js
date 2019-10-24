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
     * 请求参数（get参数，对象格式）
     */
    query: {
      type: Object,
      default: () => ({})
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
    };
  },
  methods: {
    fetch (config) {
      const { url, query, transform } = this;
      return new Promise((resolve) => {
        if (!this.fetching || config) {
          this.fetching = true;
          url && $.get(url, { ...query, ...config }).then(res => {
            const data = transform(res);
            this.$emit('fetch', data);
            resolve(data);
          }).finally(() => {
            this.$nextTick(() => {
              this.fetching = false;
            });
          });
        }
      });
    }
  }
};
