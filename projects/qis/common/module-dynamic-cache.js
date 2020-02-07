import { createNamespacedHelpers } from 'vuex';

export default (moduleName = 'question') => {
  const { mapState, mapMutations } = createNamespacedHelpers(moduleName);
  return {
    computed: {
      ...mapState({
        advancePageConfig: (state) => state,
      }),
    },
    methods: {
      ...mapMutations({
        changeAdvancePageConfig: 'setState',
      }),
    },
  };
};
