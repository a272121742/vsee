import { headers } from '@http/core';
import $ from '@http';

export default {
  data () {
    return Object.freeze({
      headers,
    });
  },
  methods: {
    static: $.static,
  },
};
