import Cookies from 'js-cookie';
import { hasOwnProperty } from '@util/logic-helper.js';
// import download from '../downloader/download.js';
import config from '~/config.js';

const {
  TOKEN_KEY = 'login_token',
  PORTAL_PATH = '/',
} = config;

const isProd = process.env.NODE_ENV === 'production';

export default (res) => {
  if (res.data instanceof Blob) {
    console.error('不再提供拦截下载功能，请使用$.download接口');
    // const disposition = res.headers['content-disposition'];
    // let fileName = '';
    // if (disposition) {
    //   fileName = disposition.substring(disposition.indexOf('filename=') + 9, disposition.length);
    //   // iso8859-1的字符转换成中文
    //   fileName = window.decodeURI(window.escape(fileName));
    //   // 去掉双引号
    //   fileName = fileName.replace(/"/g, '');
    //   download(res.data, window.decodeURIComponent(fileName));
    // }
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
    // return { name: fileName };
    return res.data;
  }
  // 二进制文件
  if (res.data instanceof ArrayBuffer || /^data:image/.test(res.data)) {
    return res.data;
  }
  // 如果服务端未传入code
  if (!hasOwnProperty('code', res.data)) {
    return Promise.reject(res);
  }
  // 如果服务端传入code不为`0`
  if (res.data.code) {
    // 除去auth操作，其余的没有权限在生产模式下跳转到首页
    if ([401].includes(res.data.code) && !~res.config.url.indexOf('auth')) {
      if (isProd) {
        Cookies.remove(TOKEN_KEY);
        window.location.replace(PORTAL_PATH);
        return null;
      }
    }
    return Promise.reject(res);
  }
  // 如果服务端传回数据包含`data`
  if (hasOwnProperty('data', res.data)) {
    return res.data.data;
  }
  return res.data;
};
