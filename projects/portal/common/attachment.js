export default {
  data () {
    const {
      $store
    } = this;
    return {
      /**
       * 请求头信息
       */
      headers: {
        authorization: 'authorization-text',
        token: $store.state.token
      }
    };
  },
  methods: {
    /**
     * 下载/static路径下文件
     * @param {*} file
     */
    downloadFromStatic (fileName) {
      const a = document.createElement('a');
      a.setAttribute('href', '/static/' + fileName);
      a.setAttribute('download', fileName);
      // a.click在火狐下无法被触发，必须通过这种方式下载
      a.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      a.remove();
    },
  }
};
