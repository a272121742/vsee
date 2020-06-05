<template>
  <a-upload
    :class="{'only-download-list': !$slots.default}"
    :file-list="previews"
    v-bind="$options.exclude(['file-list'], $attrs)"
    v-on="$options.exclude(['change', 'preview'], $listeners)"
    @change="handleChange"
    @preview="downloadFile"
  >
    <slot></slot>
  </a-upload>
</template>

<script>
import $ from '@http';
import { omit } from 'ramda';

/**
  * 客户端文件格式转服务端文件格式
  * @param {*} clientFile
  */
const file2server = (clientFile = {}) => {
  const serverFile = {};
  serverFile.id = clientFile.uid;
  serverFile.fileName = clientFile.name;
  serverFile.filePath = clientFile.url;
  serverFile.recId = clientFile.recId;
  serverFile.recType = clientFile.recType;
  serverFile.fileSize = clientFile.size;
  if (clientFile.response && typeof clientFile.response !== 'string') {
    if (!clientFile.response.code && clientFile.response.data) {
      const responseFile = clientFile.response.data;
      serverFile.id = responseFile.id;
      serverFile.fileName = responseFile.fileName;
      serverFile.filePath = responseFile.filePath;
      serverFile.recId = responseFile.recId;
      serverFile.recType = responseFile.recType;
      serverFile.fileSize = responseFile.fileSize;
    } else {
      serverFile.id = null;
    }
  }
  return serverFile;
};
/**
 * 服务端文件格式转客户端
 * @param {*} serverFile
 */
const file2client = (serverFile = {}) => {
  const clientFile = {};
  clientFile.uid = serverFile.id;
  clientFile.name = serverFile.fileName;
  clientFile.url = serverFile.filePath;
  clientFile.status = serverFile.id ? 'done' : 'error';
  clientFile.size = serverFile.fileSize;
  clientFile.response = serverFile.response || serverFile.fileName;
  clientFile.id = serverFile.id;
  clientFile.recId = serverFile.recId;
  clientFile.recType = serverFile.recType;
  return clientFile;
};

export default {
  exclude: omit,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    /**
     * 已上传文件列表，作为表单值可直接使用
     */
    value: {
      type: Array,
      default: () => [],
    },
    /**
     * 下载地址
     */
    download: {
      type: String,
      default: '',
    },
  },
  data () {
    // const previews = this.value.map(file2client);
    return {
      previews: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler (files) {
        this.previews = files.map(file2client);
      },
    },
  },
  methods: {
    formatClientFile (file) {
      if (file.error) {
        file.response = file.error.status ? this.$t(`request.${file.error.status}`) : file.error.message;
      } else if (file.response && typeof file.response !== 'string') {
        if (!file.response.code && file.response.data) {
          file.url = file.response.data.filePath;
          file.id = file.response.data.id;
        } else {
          file.status = 'error';
          const { code } = file.response;
          file.response = code ? this.$t(`request.${code}`) : file.response;
        }
      } else {
        file.response = file.name;
      }
      return file;
    },
    handleChange (info) {
      const { fileList } = info;
      this.previews = fileList.map(this.formatClientFile);
      if (fileList.every((file) => ['error', 'done'].includes(file.status))) {
        const doneFileList = this.previews.filter((file) => file.status === 'done');
        if (doneFileList.length) {
          this.$emit('change', doneFileList.map(file2server));
        } else {
          this.$emit('change', null);
        }
      }
    },
    downloadFile (file) {
      if (this.$listeners.preview) {
        this.$listeners.preview.call(this, file);
      } else if (this.download && file.status === 'done') {
        $.get(this.download, {
          path: file.url,
          originalFilename: file.name,
        }, { responseType: 'blob' });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.only-download-list {
  /deep/ .ant-upload-list .ant-upload-list-item {
    &:first-child {
      margin-top: 4px;
    }
    .anticon-paper-clip {
      top: 3px;
    }
    .anticon-close {
      display: none;
    }
  }
}
</style>
