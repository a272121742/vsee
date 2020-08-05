import Vue from 'vue';
import { ICON, DATETIME } from '@lib/config.js';

import('@dir/v-water-mark.js');

import('@layout/components/AIcon.js').then((res) => {
  const { prefix, url } = ICON;
  const AIcon = res.default;
  Vue.use(AIcon, { prefix, url });
});

if (DATETIME.enable === true) {
  import('@util/datetime-helper.js').then((res) => {
    Vue.use(res.default);
  });
}
