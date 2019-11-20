<template>
  <a-button
    ref="button"
    v-bind="$attrs"
    :type="$attrs.type || (downloading ? 'default' : $attrs.type)"
    :ghost="$attrs.ghost || (downloading ? true : $attrs.ghost)"
    :disabled="$attrs.disabled || downloading"
    :loading="loading"
    @click="download"
  >
    <a-progress
      :percent="percent"
      :show-info="false"
      :status="status"
    >
    </a-progress>
    <slot></slot>
  </a-button>
</template>

<script>
import $ from '@lib/ajax.js';

export default {
  props: {
    url: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      downloading: false,
      loading: false,
      total: 0,
      size: 0,
      status: 'active'
    };
  },
  computed: {
    button () {
      return this.$refs.button;
    },
    percent () {
      return (this.size && this.total) ? (this.size / this.total * 100) : 0;
    }
  },
  created () {
    console.log(this.$attrs);
  },
  mounted () {
    if (this.button) {
      const span = this.button.$el.querySelector('span');
      const cpSpan = document.createElement('span');
      cpSpan.innerHTML = span.innerHTML;
      cpSpan.style.display = 'block';
      cpSpan.style.margin = 'auto 16px';
      cpSpan.style.color = 'transparent';
      this.button.$el.appendChild(cpSpan);
    }
  },
  methods: {
    download () {
      const vm = this;
      if (this.url) {
        if (!/^http(s)?:\/\//i.test(this.url)) {
          const link = document.createElement('a');
          if ('download' in link) {
            link.style.display = 'none';
            link.setAttribute('href', this.url);
            link.setAttribute('download', void 0);
            document.body.appendChild(link);
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            link.onload = function load () {
              console.log('已经架子啊');
            };
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          } else {
            console.log('使用iframe');
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = this.url;
            document.body.appendChild(iframe);
            const timer = setInterval(() => {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
              if (iframeDoc.readyState == 'complete' || iframeDoc.readyState == 'interactive') {
                clearInterval(timer);
                document.body.removeChild(iframe);
                return;
              }
            }, 400);
          }
        } else {
          this.useApi();
        }
      }
    },
    useLink () {

    },
    useApi () {
      const vm = this;
      this.downloading = true;
      this.loading = true;
      this.status = 'normal';
      this.total = 0;
      this.size = 0;
      $.get(this.url, void 0, {
        responseType: 'blob',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': '*',
        },
        xsrfCookieName: 'csrftoken_testtest',
        xsrfHeaderName: 'X-CSRFToken',
        onDownloadProgress (e) {
          console.log(e);
          vm.status = 'active';
          if (e.currentTarget && e.currentTarget.response) {
            vm.total = e.currentTarget.response.size || 0;
          }
          vm.size = e.loaded || 0;
          if (vm.total === 0) {
            vm.total = vm.size * 2;
          }
        }
      }).then(res => {
        this.total = 100;
        this.size = 100;
        this.status = 'success';
        setTimeout(() => {
          this.downloading = false;
          this.loading = false;
        }, 1000);
      }).catch(err => {
        this.status = 'exception';
        setTimeout(() => {
          this.downloading = false;
          this.loading = false;
        }, 1000);
      });
    },
    useXhr () {

    }
  }
};
</script>

<style lang="less" scoped>
    .ant-btn {
      padding: 0;
      /deep/ .ant-progress {
        position: absolute;
        left: -1px;
        top: -1px;
        height: calc(100% + 2px);
        width: calc(100% + 2px);
      }
      /deep/ span:first-of-type {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: auto;
        transform: translate(-50%; -50%);
      }
      /deep/ div {
        height: 100%;
      }
      /deep/ .ant-progress-bg {
        height: 100%!important;
        border-radius: 4px!important;
      }
      /deep/ .ant-progress-inner {
        border-radius: 4px!important;
        background: transparent!important;
      }
      /deep/ .ant-progress-bg::before {
        border-radius: 4px!important;
      }
      /deep/ .anticon-loading {
        position: relative;
        z-index: 1;
        margin-left: calc(-100% - 24px)!important;
        margin-top: 7px;
      }
    }
</style>