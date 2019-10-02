import { excludeModules } from '~/config.js';

(function mockExport () {
  // 匹配模块下的`./module-name/mock/mock-name.js`文件
  const req = require.context('~', true, /^\.\/[a-zA-Z][a-zA-Z_]*\/mock\/\w+\.js$/);
  req.keys().filter(path => {
    return !~excludeModules.indexOf(path.split('/')[1]);
  }).map(req);
}());
