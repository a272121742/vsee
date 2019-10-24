<template>
  <a-dropdown>
    <a-button shape="circle">
      {{ lang }}
    </a-button>
    <a-menu slot="overlay">
      <a-menu-item
        v-for="item in langs"
        :key="item.lang"
        @click="(menu) => changeLanguage(menu, item)"
      >
        {{ item.text }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import mixin from './mixin.js';

export default {
  mixins: [mixin]
};
</script>
