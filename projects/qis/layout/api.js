import $ from '@lib/ajax.js';

export default {
  getPermissions: () => $.get('/sys/menu/permissions'),
  getUserInfo: () => $.get('/sys/user/info')
}