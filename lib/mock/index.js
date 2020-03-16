import pathTo from 'path-to-regexp';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import proxy from '@http/core/proxy.js';
import url from 'url';
import qs from 'qs';

const AdapterMock = new MockAdapter(proxy);
// const mock = Mock.mock;
const mock = (json, count = 1) => {
  const key = 'key';
  const convertJSON = {};
  convertJSON[`${key}|${count}`] = [json];
  return Mock.mock(convertJSON)[key];
};
const httpMethods = ['get', 'post', 'patch', 'put', 'delete', 'head', 'options'];

httpMethods.forEach((type) => {
  const mockMethod = `on${type.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`;
  mock[type] = (urlReqExpString, callback, {
    code = 200,
    timeout = 0,
  } = {}) => {
    // 将url匹配表达式进行转换， 例如： /path/:id
    const rurl = pathTo(urlReqExpString, [], {
      // 不忽略大小写
      sensitive: true,
      strict: true,
    });
    // 对get请求进行甄别，因为get请求有`?`参数
    if (type === 'get' || type === 'delete') {
      // 将url正则两边的`/`去掉，并追加`?`参数的正则校验
      const urlString = rurl
        .toString()
        .slice(2, -1)
        .replace('$', '\\/{0,1}(\\?{0}|\\?{1}((\\S+\\={1})(\\S+)\\&{0,1})*)$');
      // 重新编译正则规则
      rurl.compile(urlString);
    } else {
      // 将url正则两边的`/`去掉，并追加`?`参数的正则校验
      const urlString = rurl
        .toString()
        .slice(2, -1);
      // 重新编译正则规则
      rurl.compile(urlString);
    }
    AdapterMock[mockMethod](rurl).reply(async (config) => {
      // 将请求地址转换为URL结构对象`schema`；
      // eslint-disable-next-line node/no-deprecated-api
      const urlSchema = url.parse(config.url);
      // 拦截的占位符参数，去除`?`校验所带的四组括号，以及第一项url
      const argsArr = rurl.exec(urlSchema.pathname) || [];
      const args = argsArr.slice(1, type === 'get' ? argsArr.length - 4 : argsArr.length);
      // get 提交参数
      const params = { ...config.params || {}, ...qs.parse(urlSchema.query) };
      // post 提交参数
      let datas;
      try {
        // 对报文进行JSON转换，如果转换失败，说明不是JSON格式，直接返回
        datas = JSON.parse(config.data);
      } catch (e) {
        datas = config.data;
      }
      args.push(~['get', 'head'].indexOf(type) ? params : datas);
      const result = Mock.mock(await callback.call(config, ...args));
      // return result === undefined ? {} : result;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([code, result]);
        }, timeout);
      });
    });
  };
});

/**
 * 响应数据的模版
 * @description
 * @param { Number } code 服务端错误代码，默认`0`代表成功，其他均代表错误信息
 * @param { Object } data 服务端传回信息，为`JSON`格式
 * @param { String } msg 服务端错误消息，默认`''`
 */
mock.result = ({
  data = null, code = 0, msg = '',
}) => ({ data, code, msg });

/**
 * 响应`WebSocket`数据
 */
mock.ws = (function ws () {
  const wsConnectPool = new Map();
  /**
   * @param {String} path `WebSocket订阅地址`，默认值`/`
   * @param {Function | Object} fn 如果为函数，表示`Mock`映射的函数，用于处理参数生成值；如果为对象，表示传入的参数，用于提交服务端；
   * @param {Function | Undefined} callback 用于返回数据的回调函数，应用于`Mock`中，使用`this.callback`获得此函数
   */
  return (path = '/', fn = {}, cb) => {
    if (fn instanceof Function) {
      wsConnectPool.set(path, fn);
    }
    if (cb instanceof Function) {
      const params = fn; // headers
      return wsConnectPool.get(path).call({ cb }, params);
    }
    const message = cb;
    wsConnectPool.get(path).call({ headers: fn }, message);
    return false;
  };
}());

export default mock;
