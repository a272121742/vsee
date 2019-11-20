<template>
  <iframe
    v-if="path"
    name="frameOther"
    :src="path"
    width="100%"
    :height="height"
    frameborder="0"
    scrolling="false"
    @load="changeFrameHeight"
  ></iframe>
  <a-empty
    v-else
    style="margin-top: 128px;"
  ></a-empty>
</template>
<script>
import { debounce } from 'lodash';

export default {
  data () {
    return {
      path: '',
      height: 100
    };
  },
  created () {
    console.log(this.$route.name);
    const prefix = '/question/report?path=';
    const index = this.$route.fullPath.indexOf(prefix);
    this.path = encodeURI(decodeURIComponent(this.$route.fullPath.slice(index + prefix.length)));
  },
  mounted () {
    window.onresize = debounce(this.changeFrameHeight, 400);
  },
  methods: {
    changeFrameHeight () {
      this.height = document.documentElement.clientHeight - 64;
    }
  }
};
</script>


