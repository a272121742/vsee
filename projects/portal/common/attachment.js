import download from '@http/download.js';

export default {
  data () {
    const {
      $store,
    } = this;
    return {
      /**
       * 请求头信息
       */
      headers: {
        authorization: 'authorization-text',
        token: $store.state.token,
      },
    };
  },
  methods: {
    /**
     * 下载/static路径下文件
     * @param {*} file
     */
    downloadFromStatic (fileName) {
      download(`/static/${fileName}`);
    },
  },
};
