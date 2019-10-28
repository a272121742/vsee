export default {
  state: {
    workflows: []
  },
  getters: {
    getWorkflows: state => () => state.getWorkflows,
    hasWorkflow: state => _ => !!~state.workflows.indexOf(_)
  },
  mutations: {
    setWorkflows (state, workflows = []) {
      state.workflows = workflows;
    }
  }
};