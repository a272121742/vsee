import Vue from 'vue';
import config from '~/config.js';

import('@dir/v-water-mark.js');

import('@layout/components/AIcon.js').then((res) => {
  const { ICON = {} } = config;
  const { prefix = 'icon-', url = [] } = ICON;
  const AIcon = res.default;
  Vue.use(AIcon, { prefix, url });
});
