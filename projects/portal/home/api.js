import $ from '@lib/ajax.js';

export default {
  getTodoPage: (params) => $.get('/sys/todo/page', params)
};
