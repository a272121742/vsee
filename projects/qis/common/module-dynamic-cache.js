import { MODULE_DYNAMIC_CACHE } from '~/config.js';
import { createNamespacedHelpers } from 'vuex';

export default (moduleName = 'home') => {
  const { mapState, mapMutations } = createNamespacedHelpers(moduleName);
  return {
    computed: {
      ...mapState({
        advancePageConfig: MODULE_DYNAMIC_CACHE
      })
    },
    methods: {
      ...mapMutations({
        changeAdvancePageConfig: MODULE_DYNAMIC_CACHE
      })
    }
  };
};
