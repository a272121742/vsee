import config from '~/config.js';

const { WATER_MARK = {} } = config;

if (WATER_MARK.enable === true) {
  import('@dir/v-water-mark.js');
}
