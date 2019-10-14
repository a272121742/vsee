import { tap } from 'ramda';
/**
 * 上传文件包含：
 * 1. 展示文件列表，用户展示，必须是antd的file格式；
 * clientFile - {
 *   uid,  // 必要
 *   name, // 必要
 *   url,  // 必要
 *   status, // 必要 （done/uploading/error）
 *   type, // 文件类型
 *   size, // 文件大小（byte）
 *   percent, // 上传百分比
 *   response, // 上传后的返回信息，
 *   lastModified,
 *   lastModifiedDate,
 *   originFileObj
 * }
 * 2. 上传文件列表，用户服务端存储，如下：
 * serverFile - {
 *   id, // 文件id
 *   originalFilename, // 原文件名
 *   path, // 上传路径（服务器相对路径）
 *   recId, // 数据Id（附件属于哪条数据）
 *   recType, // 数据类型
 *   size, // 文件大小（byte）
 * }
 */

/**
  * 客户端文件格式转服务端文件格式
  * @param {*} clientFile
  */
const file2server = (clientFile = {}) => {
  const serverFile = {};
  if (clientFile.response) {
    serverFile.id = clientFile.response.data.id;
  }
  serverFile.originalFilename = clientFile.name;
  // 如果上传成功
  if (!clientFile.response.code && clientFile.response.data) {
    const responseFile = clientFile.response.data;
    serverFile.path = responseFile.path;
    serverFile.recId = responseFile.recId;
    serverFile.recType = responseFile.recType;
    serverFile.size = responseFile.size;
  }
  return serverFile;
};
/**
 * 服务端文件格式转客户端
 * @param {*} serverFile
 */
const file2client = (serverFile = {}) => {
  const clientFile = {};
  clientFile.id = serverFile.id;
  clientFile.uid = serverFile.id;
  clientFile.name = serverFile.originalFilename;
  clientFile.url = serverFile.path;
  clientFile.status = serverFile.id ? 'done' : 'error';
  clientFile.size = serverFile.size;
  return clientFile;
};

export default {
  data () {
    const { $store } = this;
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
  filters: {
    file2client
  },
  methods: {
    file2client,
    file2server,
    /**
     * 获取下载链接
     * @param {*} url - 下载地址（相对）
     * @param {*} name - 文件名称
     */
    getDownloadURL (url, name) {
      // 获取下载地址前缀，下载地址前缀根据不同环境会不同
      const preUrl = this.$store.getters.getUrl();
      const encodePath = window.encodeURIComponent(url);
      const encodeFileName = window.encodeURIComponent(name);
      const token = this.headers.token;
      return window.decodeURI(`${preUrl}/oss/ossFile/download?path=${encodePath}&originalFilename=${encodeFileName}&token=${token}`);
    },
    /**
     * 下载文件
     * @param {*} file
     */
    download (file) {
      // 创建`<a>`标签，后面步骤会删除
      const a = document.createElement('a');
      a.href = this.getDownloadURL(file.url || file.response.data.path, file.name);
      a.click();
      a.remove();
      return false;
    },
    /**
     * 上传成功后，将客户端文件转换为服务端文件
     * @param {*} records 保存的数据文件（服务端文件）
     * @param {*} previews 预览文件（客户端文件）
     */
    changeFileList: (records = [], previews = []) => info => {
      // 处理预览显示
      previews.splice(0, previews.length, ...info.fileList.map(tap(file => {
        if (file.response) {
          if (!file.response.code && file.response.data) {
            file.url = file.response.data.path;
            file.id = file.response.data.id;
          } else {
            file.status = 'error';
          }
        }
      })));
      /**
       * 添加文件 (需要将客户端文件转换为服务端文件)，其添加条件为：
       * 1. 客户端为完成状态
       * 2. 服务端状态码为0
       */
      if (info.file.status === 'done' && !info.file.response.code) {
        records.push(file2server(info.file));
      }
    },
    /**
     * 删除文件
     * @param {*} pre 保存的数据文件（服务端文件）
     */
    removeFile: records => file => {
      const index = records.findIndex(item => item.id === file.id);
      if (index !== -1) {
        records.splice(index, 1);
      }
      return index !== -1;
    }
  }
};
