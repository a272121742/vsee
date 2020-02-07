<template>
  <div>
    <downloader
      url="http://106.75.63.69:8091/issue/v1/issue/exportTemplate?id=1181473135338196994"
      type="primary"
    >
      下载按钮
    </downloader>
    <a-button @click="download">
      下载按钮
    </a-button>
  </div>
</template>

<script>
import $ from '@http';
import download from '@http/download.js';

export default {
  components: {
    Downloader: () => import('../view/Download.vue'),
  },
  methods: {
    download () {
      // $.get(window.encodeURI('/oss/ossFile/download?path=d://VBS大写改小写.vbs&originalFilename=VBS大写改小写.vbs')).then((res) => {
      //   // console.log(res.name);
      // });
      // $.get('/oss/ossFile/download', {
      //   path: 'd://VBS大写改小写.vbs',
      //   originalFilename: 'VBS大写改小写.vbs',
      // }).then((res) => {
      //   // console.log(res.name);
      // });
      download(window.encodeURI('http://192.168.3.60:18088/oss/ossFile/download?path=d://VBS大写改小写.vbs&originalFilename=VBS大写改小写.vbs'), '', true);
    },
  },
};
</script>
