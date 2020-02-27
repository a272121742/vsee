import { createNamespacedHelpers } from 'vuex';

const moduleMap = {};

export default ({
  name = '', state = {}, getter = {}, mutation = {}, action = {},
} = {}) => {
  const module = moduleMap[name] || createNamespacedHelpers(name);
  moduleMap[name] = module;
  const {
    mapState, mapGetters, mapMutations, mapActions,
  } = module;
  return {
    computed: {
      ...mapState(state),
      ...mapGetters(getter),
    },
    methods: {
      ...mapMutations(mutation),
      ...mapActions(action),
    },
  };
};
