/* eslint-disable prefer-promise-reject-errors */
import message from '@comp/alert/SingleMessage.js';
import i18n from '@i18n';

function showHttpCode (code) {
  if (code >= 300 && code < 600) {
    message.show({
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
    if (!~['get', 'options', 'head'].indexOf(err.config.method)) {
      showHttpCode(err.data.code);
    }
    if (err.data.msg) {
      return Promise.reject(err.data.msg);
    }
    return Promise.reject(`request.${err.data.code}`);
  }
  // 服务器未正确返回
  if (err && err.request && err.request.status) {
    if (!~['get', 'options', 'head'].indexOf(err.config.method)) {
      showHttpCode(err.request.status);
    }
    return Promise.reject(`request.${err.request.status}`);
  }
  return Promise.reject(err);
};
