import $ from '@lib/ajax.js';

export default {
  getPermissions: () => $.get('/sys/menu/permissions')
}