<template>
  <a-breadcrumb>
    <template v-for="(dir, index) in currentDirectory">
      <a-breadcrumb-item :key="index">
        <router-link
          v-if="(index < currentDirectory.length - 1 && index) || (index === 0 && dir.meta.link && currentDirectory.length > 1)"
          :to="dir.path"
        >
          {{ dir.meta.title }}
        </router-link>
        <span v-else>
          {{ dir.meta.title }}
        </span>
      </a-breadcrumb-item>
    </template>
  </a-breadcrumb>
</template>

<script>
import { uniqWith } from 'ramda';

export default {
  computed: {
    currentDirectory () {
      const { matched } = this.$route;
      const last = matched[matched.length - 1];
      if (last) {
        const splitList = last.path.split('/').reduce((arr, item) => {
          const len = arr.length;
          if (/^https?%3A%2F%2F/.test(item)) {
            if (arr._added_) {
              arr[len - 1] = `${arr[len - 1]}/${item}`;
            } else {
              arr.push(item);
              arr._added_ = true;
            }
          } else {
            arr.push(item);
          }
          return arr;
        }, []);
        let result = splitList.map((item, index, arr) => arr.slice(0, 1 + index).join('/')).slice(1);
        result = uniqWith((a, b) => a.meta.title === b.meta.title, result.map((item) => this.$router.matcher.match(item)));
        if (result.length === 1 && result[0].meta.title !== last.meta.title) {
          result.push(last);
        }
        return result.filter((item) => item.meta.title);
      }
      return [];
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-breadcrumb {
    span {
      font-size: 16px;
    }
    > span:last-child {
      color: @primary-color;
    }
  }
</style>
