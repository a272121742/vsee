import mock from '@lib/mock.js';

mock.get('/sys/user/info', () => {
  return mock.result({
    data: {}
  })
});
mock.get('/sys/menu/permissions', () => {
  return mock.result({
    data: ['qis:list:create']
  });
})
