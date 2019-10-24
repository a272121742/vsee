import $ from '@lib/ajax.js';

// TODO: 要传入appCode
export default {
  getPermissions: () => $.get('/sys/menu/permissions'),
  getUserInfo: () => $.get('/sys/user/info'),
  getMenus: () => $.get('/sys/menu/nav'),
  logout: () => $.post('/auth/logout')
};
