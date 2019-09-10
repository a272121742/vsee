import mock from '@lib/mock.js';

mock.get('/sys/menu/permissions', () => {
  return mock.result({
    data: ['portal:home:save']
  });
}, {timeout: 2000})