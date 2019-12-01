import $ from '@http';

export default {
  getOrderList: () => $.get('/order/list'),
  getOrder: id => $.get(`/order/${id}`),
  orderAdd: data => $.post(`/order/add/`, data),
  orderEdit: data => $.post(`/order/edit/`, data),
  orderDel: id => $.get(`/order/del/${id}`),
};
