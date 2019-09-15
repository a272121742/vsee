import mock from '@lib/mock.js';

mock.get('/sys/menu/permissions', () => {
  return mock.result({
    data: [
      'issue:owner:daiban',
      'issue:owner:daifa',
      'issue:owner:yiban',
      'issue:owner:yifa',
      'issue:owner:search',
      'issue:owner:create',
      'issue:owner:detail',
      'issue:advance:search',
      'issue:advance:detail'
    ]
  });
}, { timeout: 2000 })
