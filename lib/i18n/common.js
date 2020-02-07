// 加载全局国际化
// 匹配模块下的`./locale/*.json`文件
const req = require.context('./', true, /^\.\/locales\/[A-Za-z]+\.json$/);
const messages = {};
req
  .keys()
  .forEach((key) => {
    const matched = key.match(/([A-Za-z]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = { ...messages[locale], ...req(key) };
    }
  });

export default messages;
