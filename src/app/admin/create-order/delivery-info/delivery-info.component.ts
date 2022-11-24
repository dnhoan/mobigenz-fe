import { Component, Input, OnInit } from '@angular/core';
import { orderStore } from '../order.repository';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.scss'],
})
export class DeliveryInfoComponent implements OnInit {
  @Input('address') address: string = '';
  @Input('delivery') delivery: number = 0;
  constructor() {}

  ngOnInit(): void {}
  changeDelivery() {
    orderStore.update((state: any) => {
      return {
        orderDto: { ...state.orderDto, delivery: this.delivery },
      };
    });
  }
}
