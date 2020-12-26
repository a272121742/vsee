<template>
  <iframe
    ref="frame"
    class="app-iframe"
    name="frameOther"
    :src="src"
    width="100%"
    frameborder="0"
    allowfullscreen
    :style="{ opacity, 'overflow-x': 'hidden', 'overflow-y': 'auto', }"
    @load="changeFrameHeight"
  ></iframe>
</template>

<script>
import { debounce } from 'lodash';

export default {
  props: {
    auth: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      height: 100,
      opacity: 0,
      loaded: false,
    };
  },
  computed: {
    src () {
      return decodeURIComponent(this.loaded ? this.url : (this.auth || this.url));
    },
  },
  watch: {
    $route () {
      this.loaded = false;
      this.opacity = 0;
    },
  },
  mounted () {
    window.onresize = debounce(this.changeFrameHeight, 500);
  },
  methods: {
    changeFrameHeight () {
      if (!this.loaded) {
        this.$nextTick(() => {
          this.loaded = true;
          const id = setTimeout(() => {
            clearTimeout(id);
            this.opacity = 1;
          }, 200);
        });
      }
      // this.height = document.documentElement.clientHeight;
    },
  },
};
</script>
