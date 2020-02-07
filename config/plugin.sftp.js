const needFTP = !!process.env.npm_config_ftp;

module.exports = (config) => {
  needFTP
  && config.plugin('sftp').use(require.resolve('webpack-sftp-client'), [{
    port: 22,
    host: '106.75.63.69',
    username: 'root',
    password: '7kf4s?8At[k(',
    path: 'dist',
    remotePath: `/data/btqis-dev/nginx/html`,
    verbose: false,
  }]);
};
