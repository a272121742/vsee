const path = require('path');

const cwd = process.cwd();
const resolve = (...dir) => path.join(cwd, ...dir);
const project = process.env.npm_config_project;

module.exports = (config) => {
  const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
  types.forEach((type) => addStyleResource(config.module.rule('less').oneOf(type)));
};

function addStyleResource (rule) {
  rule.use('style-resources-loader')
    .loader('style-resources-loader')
    .options({
      patterns: [
        resolve('projects', project, 'theme.less'),
      ],
      injector: 'append',
    });
}
