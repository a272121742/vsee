import $ from '@http';

export default {
  // getTodoPage: (params) => $.get('/sys/todo/page', params),
  getTodoPage: (params) => $.get('/issue/v1/issue/page', params),
};
