import { tapclone } from '@util/fn-helper.js';
import { HTTP } from '@lib/config.js';

const {
  MOCK_LOG,
} = HTTP;
/**
 * 日志模块
 * @param {*} axios
 */
export default !MOCK_LOG ? void 0 : (axios) => {
  axios.interceptors.response.use(tapclone((res) => {
    const req = res.config;
    console.group(`%c${req.method} ${req.url}`, 'color: #4CAF50; font-weight: bolder; font-size: 14px;');
    console.log('%c请求', 'color: #062141; font-weight: bold', req);
    console.log('%c响应', 'color: #062141; font-weight: bold', res);
    console.groupEnd();
  }));
};

export const proxy = true;
