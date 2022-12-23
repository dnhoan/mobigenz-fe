import { Component, Input, OnInit } from '@angular/core';
import { OrdersService } from '../../orders/orders.service';
import { orderStore } from '../order.repository';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['./delivery-info.component.scss'],
})
export class DeliveryInfoComponent implements OnInit {
  @Input('address') address: string = '';
  @Input('delivery') delivery: number = 0;
  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {}
  changeDelivery() {
    if (this.delivery == 1) {
      this.getShipFee();
    } else {
      orderStore.update((state: any) => {
        return {
          orderDto: {
            ...state.orderDto,
            delivery: this.delivery,
            shipFee: 0,
          },
        };
      });
    }
  }
  getShipFee() {
    this.orderService.getFeeShip(this.address).subscribe((res) => {
      if (res) {
        orderStore.update((state: any) => {
          return {
            orderDto: {
              ...state.orderDto,
              delivery: this.delivery,
              shipFee: res,
            },
          };
        });
      }
    });
  }
}
