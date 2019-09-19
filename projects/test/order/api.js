import $ from '@lib/ajax.js';

export default {
  getOrderList: () => $.get('/order/list')
}
