import mock from '@lib/mock.js';
import { Random } from 'mockjs';


mock.get('/auth/captcha', uuid => {
  console.log('发送图片', uuid);
  return Random.dataImage('128x38', Random.string('lower', 6));
});

mock.post('/auth/login', userInfo => {
  return mock.result({
    data: {
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMDY3MjQ2ODc1ODAwMDAwMDAxIiwiaWF0IjoxNTY3NDc1MjA3LCJleHAiOjE1NjgwODAwMDd9.rd7KSWHN1OTnGhTfeQHbqrJa-oZfg1JCC_LBf-HZpfr2Dyvjwr4pnzx7Q-xh1ot3fZSSfmP4cP5MyNZh1JDxSA',
      expire: 604800
    }
  });
});
