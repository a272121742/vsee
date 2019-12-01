import { tapclone } from '@util/fnhelper.js';
/**
 * 日志模块
 * @param {*} axios
 */
export default (axios) => {
  axios.interceptors.response.use(tapclone((res) => {
    const req = res.config;
    console.group(`%c${req.method} ${req.url}`, 'color: #4CAF50; font-weight: bolder; font-size: 14px;');
    console.log('%c请求', 'color: #062141; font-weight: bold', req);
    console.log('%c响应', 'color: #062141; font-weight: bold', res);
    console.groupEnd();
  }));
};

export const proxy = true;
