import $ from '@http';

export default {
  data () {
    return {
      headers: Object.freeze($.getHeaders()),
    };
  },
  methods: {
    static: $.static,
  },
};
