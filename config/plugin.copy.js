const path = require('path');

const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);

module.exports = (config) => {
  config
    .plugin('copy')
    .use(require.resolve('copy-webpack-plugin'), [[{
      from: resolve('/public/static'),
      to: resolve('/dist/static'),
      ignore: ['index.html'],
    }]]);
};
