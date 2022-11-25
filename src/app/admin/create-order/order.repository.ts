import { createStore, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { ORDER_STATUS } from 'src/app/constants';
interface OrderProps {
  orderDto: OrderDto;
}
export const orderInit = {
  id: 0,
  recipientEmail: '',
  recipientName: '',
  recipientPhone: '',
  address: '',
  goodsValue: 0,
  quantity: 0,
  totalMoney: 0,
  shipFee: 0,
  carrier: '',
  delivery: 0,
  checkout: 0,
  payStatus: 0,
  orderStatus: ORDER_STATUS.CONFIRMED,
  customerDTO: {},
  orderDetailDtos: [],
  note: '',
};
export const orderStore = createStore(
  { name: 'order' },
  withProps<OrderProps>({
    orderDto: orderInit,
  })
);

@Injectable({ providedIn: 'root' })
export class OrderRepository {}
