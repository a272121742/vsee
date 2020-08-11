const cwd = process.cwd();
const fs = require('fs');
const cp = require('child_process');
const moment = require('moment');
const branch = require('git-branch');


const pkg = fs.readFileSync(`${cwd}/package.json`, {
  encoding: 'utf8',
});

const project = process.env.npm_config_project;
const isProd = process.env.NODE_ENV === 'production';


/**
 * 是否代理（test: true - 代理模式； false - 本地模拟）
 * 1. 生产模式下，如果配置了test，则连接模拟数据，反之连接代理
 * 2. 开发模式下，如果配置了test，则连接代理，反之连接模式数据
 */
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);

module.exports = (config) => {
  config.plugin('define')
    .tap((args) => {
      args[0]['process.env'].proxy = proxy;
      args[0]['process.env'].project = JSON.stringify(project);
      args[0]['process.env'].buildDate = JSON.stringify(moment().format('YYYY/MM/DD HH:mm:ss'));
      args[0]['process.env'].branch = JSON.stringify(branch.sync());
      args[0]['process.env'].package = pkg;
      try {
        const execConfig = { encoding: 'utf8', cwd };
        const detailString = cp.execSync(`git show --format='%H%n%cn%n%ce%n%cI%n%an%n%ae%n%aI%n%s' -q --encoding=UTF-8`, execConfig);
        const [sha, committer, committerEmail, committerDate, author, authorEmail, authorDate, commitMessage] = detailString.split('\n');
        args[0]['process.env'].git = JSON.stringify({
          sha,
          committer,
          committerEmail,
          committerDate,
          author,
          authorEmail,
          authorDate,
          commitMessage,
          branch: branch.sync(),
        });
      } catch (e) {
        console.log(e);
      }
      return args;
    });
};
