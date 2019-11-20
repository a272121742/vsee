<template>
  <downloader
    url="http://106.75.63.69:8091/issue/v1/issue/exportTemplate?id=1181473135338196994"
    type="primary"
  >
    下载按钮下载按钮下载按钮下载按钮
  </downloader>
</template>

<script>
export default {
  components: {
    Downloader: () => import('../view/Download.vue')
  }
};
</script>