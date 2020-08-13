/* eslint-disable prefer-promise-reject-errors */
import { message } from 'ant-design-vue';
import i18n from '@i18n';
import config from '~/config.js';

const { GLOBAL_API_LIST = {} } = config;
const globalApiList = Object.values(GLOBAL_API_LIST).map((item) => item[0]);

function showHttpCode (code) {
  if (code >= 300 && code < 600) {
    message.error({
      duration: 5,
      content: i18n.t(`request.${code}`),
    });
  }
}

export default (err) => {
  if (!err) {
    return Promise.reject(`request.undefined`);
  }
  // 服务器正确返回
  if (err && err.data && err.data.code) {
    if (err.data.code === 302) {
      if (err.data.data) {
        window.location.replace(err.data.data);
      } else {
        throw new Error('重定向地址错误');
      }
    }
    if (['get', 'post', 'put', 'patch', 'delete'].includes(err.config.method) && !globalApiList.includes(err.config.url)) {
      showHttpCode(err.data.code);
    }
    if (err.data.msg) {
      message.error({
        duration: 5,
        content: err.data.msg,
      });
      return Promise.reject(err.data.msg);
    }
    return Promise.reject(`request.${err.data.code}`);
  }
  // 服务器未正确返回
  if (err && err.request && err.request.status) {
    if (!~['get', 'options', 'head'].indexOf(err.config.method)) {
      showHttpCode(err.request.status);
    }
    if (err.request.status < 300 && (!Object.prototype.hasOwnProperty.call(err.data, 'data') || !Object.prototype.hasOwnProperty.call(err.data, 'code'))) {
      message.error({
        duration: 5,
        content: i18n.t(`request.RESPONSE_DATA_ERROR`),
      });
      return Promise.reject(`request.RESPONSE_DATA_ERROR`);
    }
    return Promise.reject(`request.${err.request.status}`);
  }
  if (err && err.code) {
    message.error({
      duration: 5,
      content: i18n.t(`request.${err.code}`),
    });
    return Promise.reject(`request.${err.code}`);
  }
  if (err && err.message) {
    message.error({
      duration: 5,
      content: i18n.t(`request.${err.message}`),
    });
    return Promise.reject(`request.${err.message}`);
  }
  return Promise.reject(err);
};
