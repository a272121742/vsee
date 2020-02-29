import config from '~/config.js';

const { EXCLUDE_MODULES } = config;

(function mockExport () {
  // 匹配模块下的`./module-name/mock/mock-name.js`文件
  const req = require.context('~', true, /^\.\/[a-zA-Z][a-zA-Z_-]*\/mock\/\w+\.js$/);
  req.keys().filter((path) => !~EXCLUDE_MODULES.indexOf(path.split('/')[1])).map(req);
}());
