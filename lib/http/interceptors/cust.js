import { tapclone } from '@util/fnhelper.js';
import { HTTP } from '@lib/config.js';

const { INTERCEPTORS } = HTTP;
const { request, response } = INTERCEPTORS;
/**
 * 自定义注入
 * @param {*} axios
 */
export default (axios) => {
  request && axios.interceptors.request.use(tapclone((req) => {
    request(req);
    // Promise
    //   .all([import('@store'), import('@router'), import('@i18n'), import('js-cookie')])
    //   .then(([{ default: store }, { default: router }, { default: i18n }, { default: Cookies }]) => {
    //     request({
    //       request: req, store, router, i18n, Cookies,
    //     });
    //   });
  }));
  response && axios.interceptors.response.use(tapclone((res) => {
    response(res);
    // Promise
    //   .all([import('@store'), import('@router'), import('@i18n'), import('js-cookie')])
    //   .then(([{ default: store }, { default: router }, { default: i18n }, { default: Cookies }]) => {
    //     response({
    //       response: res, store, router, i18n, Cookies,
    //     });
    //   });
  }));
};
