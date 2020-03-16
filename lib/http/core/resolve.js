import download from '@http/download.js';
import Cookies from 'js-cookie';
import { hasOwnProperty } from '@util/datahelper.js';
import config from '~/config.js';

const {
  TOKEN_KEY = 'login_token',
  PORTAL_APTH = '/',
} = config;

const isProd = process.env.NODE_ENV === 'production';

export default (res) => {
  if (res.data instanceof Blob) {
    const headers = res.headers['content-disposition'] || '';
    const name = window.decodeURI(headers.split(';')[1].split('=')[1]);
    // if (/^"\S+"$/.test(name)) {
    //   name = name.slice(1, -1);
    // }
    download(res.data, window.decodeURIComponent(name));
    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //   window.navigator.msSaveOrOpenBlob(res.data, name);
    // } else {
    //   const isIE = !!(document.all && typeof (document.all) === 'object');
    //   const e = document.createEvent(isIE ? 'HTMLEvents' : 'MouseEvent');
    //   const a = document.createElement('a');
    //   a.setAttribute('href', URL.createObjectURL(res.data));
    //   a.setAttribute('download', name);
    //   e.initEvent('click', true, true);
    //   a.dispatchEvent(e);
    //   a.remove();
    // }
    return { name: window.decodeURIComponent(name) };
  }
  // 二进制文件
  if (res.data instanceof ArrayBuffer || /^data:image/.test(res.data)) {
    return res.data;
  }
  // 如果服务端未传入code
  if (!hasOwnProperty(res.data, 'code')) {
    return Promise.reject(res);
  }
  // 如果服务端传入code不为`0`
  if (res.data.code) {
    // 除去auth操作，其余的没有权限在生产模式下跳转到首页
    if (~[401].includes(res.data.code) && !~res.config.url.indexOf('auth')) {
      if (isProd) {
        Cookies.remove(TOKEN_KEY);
        window.location.replace(PORTAL_APTH);
        return null;
      }
    }
    return Promise.reject(res);
  }
  // 如果服务端传回数据包含`data`
  if (Object.prototype.hasOwnProperty.call(res.data, 'data')) {
    return res.data.data;
  }
  return res.data;
};
