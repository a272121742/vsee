import config from '~/config.js';

const { EXCLUDE_MODULES } = config;
// 加载模块国际化
// 匹配模块下的`./module-name/locale/*.json`文件
const req = require.context('~', true, /^\.\/[A-Za-z][A-Za-z0-9_-]*\/locales\/[A-Za-z][A-Za-z0-9_-]*\.json$/);
const modules = [];
req
  .keys()
  .filter((path) => !~EXCLUDE_MODULES.indexOf(path.split('/')[1]))
  .forEach((key) => {
    const matched = key.match(/([A-Za-z]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      // messages[locale] = { ...messages[locale], ...req(key) };
      modules.push({
        [locale]: req(key),
      });
    }
  });

export default modules;
