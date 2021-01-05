import Axios from 'axios';
import message from '@layout/components/Message.js';

const axios = Axios.create({
  name: 'http',
});

// 业务数据判断, link a {}
const isBzBody = () => true;
const isImage = () => true;
const isFile = () => true;

const isAxiosError = () => true;
const isResponseError = () => true;
const isBzError = () => true;

export default (() => ({
  /**
     * resSuccess: { config, data, headers, request, status, statusText }
     * resFail:
     *  1. client error { config, isAxiosErro, request, response, toJSON, message, stack} instanceof Error
     */
  get (url, params, conf = {}) {
    const { CancelToken } = Axios;
    const source = CancelToken.source();
    /**
       * 返回结果为Array:
       * [
       *   业务数据对象,
       *   错误对象，
       *   req/res(如果正确，返回req，反之返回res)
       * ]
       */
    const result = axios
      .get(url, { ...conf, params, cancelToken: source.token })
      .then((res) => {
        result.fetching = false;
        // 成功，基于原来的模式进行追加resolve
        /**
           * 进入到这里，说明客户端和服务端已经进行了一次完整通信，接着我们要做的事：
           * 1. 判断 `res.data` 的返回值类型，对特定类型做出特定行为，包含：
           *  a - 二进制流 / /^data:image/类型的，属于图片格式；
           *  b - 文件或者Blob类型，进行下载行为；
           * 2. 业务验证，如果以上特定类型都不满足，追加 `res.data` 的结果是其他类型时的具体行为
           *  形如对象 { code, data, msg }，对code进行业务解析
           * 3. 如果`res.data === undefined / null`， 直接返回成功
           */
        const body = res.data;
        if (isBzBody(body)) {
          return [body, void 0, res];
        }
        if (isImage(body)) {
          return [body, void 0, res];
        }
        if (isFile(body)) {
          return [body, void 0, res];
        }
        console.log('success');
        return [res, void 0, res];
      })
      .catch((err) => {
        message.show({
          type: 'error',
          duration: 3,
          content: '请求失败',
        });
        // 失败，基于原来的模式进行追加reject
        /**
           * 进入到这里，有三种情况
           * 1. Error 对象
           * 2. Response 对象
           * 3. 上面业务验证不通过时的对象 { code, data, msg }
           */
        console.log('fail');
        /**
         * 官网逻辑
         * if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
         */
        if (isAxiosError(err)) {
          return [void 0, err];
        }
        if (isResponseError(err)) {
          return [void 0, err];
        }
        if (isBzError(err)) {
          return [void 0, err];
        }
        console.dir(err);
        return [void 0, err];
      });
    result.fetching = true;
    result.cancel = source.cancel;
    return result;
  },
}))();
