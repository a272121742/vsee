/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/**
 * 相关参考： https://www.kancloud.cn/yunye/axios/234845
 * 引入的Axios为整个程序主要的ajax实例，开发环境下拦截这个实例
 */
import { message } from 'ant-design-vue';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@@/config.js';
const tap = fn => res => (fn(res), res);
const isProd = process.env.NODE_ENV === 'production'

if (!isProd) {
  axiosLog(Axios);
} else {
  // @TODO: 这里预留，在生产模式中，增加httpRetry(Axios)的功能和配置
  console.log(process.env);
  Axios.defaults.baseURL = process.env.VUE_APP_GATEWAY || '/';
}

// 是否为开发代理测试模式（开发模式会连接测试服务器）
const isDevProxyTesting = process.env.VUE_APP_TESTING === 'true';
// 基础路径，如果时走代理，要加上代理的前缀路径
const baseURL = (isDevProxyTesting ? process.env.VUE_APP_PIXAPI : '/') || '/';
// 构建一个代理专用Axios实例，该实例不会被mock模块拦截
const proxyAxios = Axios.create({
  baseURL
});
// 构建基础组件
const resolve = res => {
  // 二进制文件
  if (res.data instanceof ArrayBuffer) {
    return res.data;
  }
  // 如果服务端未传入code
  if (!Object.prototype.hasOwnProperty.call(res.data, 'code')) {
    return Promise.reject('SERVER.ERROR.undefined');
  }
  // 如果服务端传入code不为`0`
  if (res.data.code) {
    if (~[401].indexOf(res.data.code)) {
      if (isProd) {
        Cookies.remove(TOKEN_KEY);
        window.location.href = '/';
        return;
      }
    }
    return Promise.reject(`SERVER.ERROR.${res.data.code}`);
  }
  // 如果服务端传回数据包含`data`
  if (Object.prototype.hasOwnProperty.call(res.data, 'data')) {
    return res.data.data;
  }
  return res.data;
};
const reject = err => Promise.reject(err);

console.info('当前模式', isDevProxyTesting ? '联调开发模式：' + process.env.VUE_APP_PIXAPI : '离线开发模式：/');
const axios = isDevProxyTesting ? proxyAxios : Axios;
axios.defaults.headers.token = Cookies.get(TOKEN_KEY);

afterLogin(axios);
// blockError(axios);
export default {
  get: (url, params, config = {}) => {
    return axios.get(url, { ...config, params }).then(resolve).catch(reject);
  },
  delete: (url, params, config = {}) => {
    return axios.delete(url, { ...config, params }).then(resolve).catch(reject);
  },
  head: (url, params, config = {}) => {
    return axios.head(url, { ...config, params }).then(resolve).catch(reject);
  },
  post: (url, data, config = {}) => {
    return axios.post(url, data, { ...config }).then(resolve).catch(reject);
  },
  put: (url, data, config = {}) => {
    return axios.put(url, data, { ...config }).then(resolve).catch(reject);
  },
  patch: (url, data, config = {}) => {
    return axios.patch(url, data, { ...config }).then(resolve).catch(reject);
  },
  instance: axios
};
/**
 * 登陆之后
 * 1. 所有的`response`将更新`token`；
 * @param {*} axios
 */
function afterLogin (axios) {
  // 1. 登录后的`response`将更新`token`；
  axios.interceptors.response.use(tap(res => {
    // 登陆业务中会获取服务端的`token`信息;
    if (~res.config.url.indexOf('login')) {
      const token = (res.data && res.data.data && res.data.data.token);
      // const expires = (res.data && res.data.data && res.data.data.expire) || 7;
      if (token) {
        Cookies.remove(TOKEN_KEY);
        Cookies.set(TOKEN_KEY, token);
        axios.defaults.headers.token = token;
      }
    }
  }));
  axios.interceptors.request.use(tap(req => {
    // 如果请求时没有token，则跳出系统进行登陆；
    if (!~req.url.indexOf('auth') && isProd) {
      if (!Cookies.get(TOKEN_KEY)) {
        Cookies.remove(TOKEN_KEY);
        window.location.href = '/';
      }
    }
  }));
}
/**
 * 拦截错误信息
 * @param {*} axios
 */
function blockError (axios) {
  axios.interceptors.response.use(tap(res => {
    if (res.data.code) {
      message.error(`error_code: ${res.data.code}\r\nerror_message: ${res.data.msg}`);
    }
  }));
}
/**
 * 服务器重连
 * @param {*} axios
 */
function httpRetry (axios) {
  // 设置备用地址（若加上此备用地址列表，最坏情况下，会连接三次：默认连接、备用1、备用2）
  // 以下备用地址从配置文件中获取
  const netlist = ['https://easy-mock.com/mock/5b03c10305e00e7fd3cb3d68/example', 'http://rap2api.taobao.org/app/mock/116'];
  // 设置重连次数
  axios.defaults.retry = netlist.length;
  // 设置重连间隔事件
  axios.defaults.retryDelay = 400;
  // 注入重连钩子
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
    // 获取连接配置
    var config = err.config;
    // 如果不存在重连，reject
    if (!config || !config.retry) {
      return Promise.reject(err)
    }
    // 设置重连次数，初始化为0
    config.__retryCount = config.__retryCount || 0;
    // 若没有填写baseURL，则备份api路径
    if (!config.baseURL) {
      config.__url = config.url;
    }
    // 如果超过重复次数，reject
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(err);
    }
    // 计数器
    config.__retryCount += 1;
    config.baseURL = netlist[config.__retryCount - 1];
    config.url = config.__url;
    // 创造新的Promise来重连
    var backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    });
    // 返回重连信息
    return backoff.then(function () {
      return axios(config);
    });
  });
}
/**
 * 日志模块
 * @param {*} axios
 */
function axiosLog (axios) {
  axios.interceptors.response.use(tap(res => {
    const req = res.config;
    console.group(`%c${req.method} ${req.url}`, 'color: #4CAF50; font-weight: bolder; font-size: 14px;');
    console.log('%c请求', 'color: #062141; font-weight: bold', req);
    console.log('%c响应', 'color: #062141; font-weight: bold', res);
    console.groupEnd();
  }));
}
export const instance = axios;
