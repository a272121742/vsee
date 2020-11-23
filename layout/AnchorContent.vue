<template>
  <main>
    <template v-for="(block, index) in blocks">
      <a-row
        v-if="block.path && block.component"
        :id="block.path"
        :key="index"
        class="content-child-view-item"
      >
        <div>
          <vue-lazy-component :timeout="index * 2000">
            <template
              v-if="scope.loading"
              slot-scope="scope"
            >
              <keep-alive>
                <component
                  :is="block.component"
                  v-if="block.props"
                  v-bind="Object.keys(block.props).length ? block.props : void 0"
                />
              </keep-alive>
            </template>
            <a-spin
              slot="skeleton"
              style="width: 100%; min-height: calc(100vh - 48px); text-align: center;"
            />
          </vue-lazy-component>
        </div>
      </a-row>
    </template>
  </main>
</template>

<script>
import { tree2list } from '@util/data-helper.js';

export default {
  components: {
    VueLazyComponent: () => import('@xunlei/vue-lazy-component').then((res) => res.component),
  },
  computed: {
    blocks () {
      return tree2list(this.$store.state.routers.map((item) => ({ ...item })));
    },
  },
};
</script>
