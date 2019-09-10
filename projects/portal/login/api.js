import $ from '@lib/ajax.js';

export default {
  login: (loginInfo) => $.post('/auth/login', loginInfo),
}