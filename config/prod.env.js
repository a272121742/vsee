const moment = require('moment');
const buildDate = moment().format('YYYY/MM/DD HH:mm:ss');
console.log(buildDate);
module.exports = {
  NODE_ENV: '"production"',
  buildDate: JSON.stringify(buildDate)
  // base: '/webppt/vfront/'
};
