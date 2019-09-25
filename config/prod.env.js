const moment = require('moment');
const buildDate = moment().format('YYYY/MM/DD HH:mm:ss');

module.exports = {
  NODE_ENV: '"production"',
  buildDate: JSON.stringify(buildDate),
  api: JSON.stringify('http://106.75.63.69:8091/mojo-gateway')
  // base: '/webppt/vfront/'
};
