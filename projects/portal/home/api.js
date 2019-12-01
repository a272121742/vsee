import $ from '@http';

export default {
  getTodoPage: params => $.get('/sys/todo/page', params),
};
