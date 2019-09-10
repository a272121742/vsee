import $ from '@lib/ajax.js';

export default {
  getPermission: () => $.get('/sys/menu/permissions')
}