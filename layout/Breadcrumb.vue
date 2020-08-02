<template>
  <a-breadcrumb>
    <a-breadcrumb-item
      v-if="home"
      key="home"
    >
      <router-link to="/">
        {{ $t('app.home') }}
      </router-link>
    </a-breadcrumb-item>
    <template v-for="(dir, index) in currentDirectory">
      <a-breadcrumb-item :key="dir.id">
        <!-- <router-link
          v-if="(index < currentDirectory.length - 1 && index) || (index === 0 && dir.meta.link && currentDirectory.length > 1)"
          :to="dir.path"
        >
          {{ dir.meta.title }}
        </router-link>
        <span v-else>
          {{ dir.meta.title }}
        </span> -->
        <router-link
          v-if="index < currentDirectory.length - 1 && ![true, void 0].includes(dir.dir)"
          :to="dir.fullPath"
        >
          {{ dir.name }}
        </router-link>
        <span v-else>
          {{ dir.name }}
        </span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
import config from '~/config.js';

const { ROUTER = {} } = config;
const { HOME_COMP } = ROUTER;


export default {
  props: {
    currentDirectory: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      home: !!HOME_COMP,
    };
  },
};
</script>
