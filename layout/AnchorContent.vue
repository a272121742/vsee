<template>
  <main>
    <template v-for="(block, index) in blocks">
      <a-row
        v-if="block.componentPath || (block.component && block.report)"
        :id="block.fullPath"
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
                <async-component
                  v-if="block.componentPath"
                  :path="block.componentPath"
                />
                <component
                  :is="block.component"
                  v-else-if="block.report"
                  v-bind="block.props"
                ></component>
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
import { tree2list } from '@util/datahelper.js';

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
