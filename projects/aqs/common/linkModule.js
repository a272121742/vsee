import { createNamespacedHelpers } from 'vuex';

export default (moduleName = 'layout') => {
  const { mapState, mapMutations } = createNamespacedHelpers(moduleName);
  return {
    computed: {
      ...mapState({
        state: (state) => state,
      }),
    },
    methods: {
      ...mapMutations([
        'setState',
      ]),
    },
  };
};
