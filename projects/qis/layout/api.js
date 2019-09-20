import $ from '@lib/ajax.js';

// TODO: 要传入appCode
export default {
  getPermissions: () => $.get('/sys/menu/permissions', { appCode: 'ISSUE' }),
  getUserInfo: () => $.get('/sys/user/info'),
  getMenus: () => $.get('/sys/menu/nav', { appCode: 'ADMIN' }),
  logout: () => $.post('/auth/logout')
}
