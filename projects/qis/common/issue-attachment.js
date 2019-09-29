export default {
  computed: {
    headers () {
      return {
        authorization: 'authorization-text',
        token: this.$store.getters.getToken()
      };
    }
  },
  methods: {
    downFile (info) {
      // 获取下载地址前缀，下载地址前缀根据不同环境会不同
      const locationUrl = this.$store.getters.getUrl();
      const a = document.createElement('a');
      a.download = info.name;
      if (info.url !== undefined) {
        const url = locationUrl + '/oss/ossFile/download?path=' + encodeURIComponent(info.url) + '&originalFilename=' + encodeURIComponent(info.name) + '&token=' + this.$store.getters.getToken();
        a.href = decodeURI(url);
      } else {
        const dataFile = info.response.data;
        const url = locationUrl + '/oss/ossFile/download?path=' + encodeURIComponent(dataFile.path) + '&originalFilename=' + encodeURIComponent(dataFile.originalFilename) + '&token=' + this.$store.getters.getToken();
        a.href = decodeURI(url);
      }
      a.click();
      this.$nextTick(() => {
        a.remove();
      });
      return false;
    },
    downloadHref (path, name) {
      const locationUrl = this.$store.getters.getUrl();
      const url = locationUrl + '/oss/ossFile/download?path=' + encodeURIComponent(path) + '&originalFilename=' + encodeURIComponent(name) + '&token=' + this.$store.getters.getToken();
      return url;
    }
  }
};