export default (err) => {
  if (err && err.code) {
    if (err.msg) {
      return Promise.reject(err.msg);
    }
    return Promise.reject(`SERVER.ERROR.${err.code}`);
  }
  if (err && err.request && err.request.status) {
    return Promise.reject(`SERVER.ERROR.${err.request.status}`);
  }
  return Promise.reject(err);
};
