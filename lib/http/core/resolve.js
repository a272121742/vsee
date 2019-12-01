import Cookies from 'js-cookie';
import { hasOwnProperty } from '@util/datahelper.js';
import {
  TOKEN_KEY,
} from '~/config.js';

const isProd = process.env.NODE_ENV === 'production';

export default (res) => {
  if (res.data instanceof Blob) {
    const url = URL.createObjectURL(res.data);
    const headers = res.headers['content-disposition'] || '';
    const name = window.decodeURI(headers.split(';')[1].split('=')[1]);
    return { url, name };
  }
  // 二进制文件
  if (res.data instanceof ArrayBuffer || /^data:image/.test(res.data)) {
    return res.data;
  }
  // 如果服务端未传入code
  if (!hasOwnProperty(res.data, 'code')) {
    return Promise.reject('SERVER.ERROR.undefined');
  }
  // 如果服务端传入code不为`0`
  if (res.data.code) {
    // 除去auth操作，其余的没有权限在生产模式下跳转到首页
    if (~[401].indexOf(res.data.code) && !~res.config.url.indexOf('auth')) {
      if (isProd) {
        Cookies.remove(TOKEN_KEY);
        window.location.href = '/';
        return void 0;
      }
    }
    if (res.data.msg) {
      return Promise.reject(res.data.msg);
    }
    return Promise.reject(`SERVER.ERROR.${res.data.code}`);
  }
  // 如果服务端传回数据包含`data`
  if (Object.prototype.hasOwnProperty.call(res.data, 'data')) {
    return res.data.data;
  }
  return res.data;
};
