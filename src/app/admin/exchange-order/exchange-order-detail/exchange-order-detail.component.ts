import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { orderStore } from '../../create-order/order.repository';
import { OrdersService } from '../../orders/orders.service';
import { ExchangeProductComponent } from './exchange-product/exchange-product.component';

@Component({
  selector: 'app-exchange-order-detail',
  templateUrl: './exchange-order-detail.component.html',
  styleUrls: ['./exchange-order-detail.component.scss'],
})
export class ExchangeOrderDetailComponent implements OnInit {
  order!: OrderDto;
  subOrder!: Subscription;
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}
  ngOnDestroy() {
    this.subOrder.unsubscribe();
  }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderById(id).subscribe((orderDto) => {
      orderStore.update(() => ({
        orderDto,
      }));
    });
    this.subOrder = orderStore.subscribe((state) => {
      this.order = state.orderDto;
    });
  }
  save() {}
  openChangeProduct(orderDetail: OrderDetailDto, imei: ImeiDto) {
    const modal = this.modal.create({
      nzTitle: 'Chọn Imei',
      nzContent: ExchangeProductComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        currentOrderDetail: orderDetail,
        currentImei: imei,
      },
      nzWidth: '800px',
      nzFooter: [],
    });
    const instance = modal.getContentComponent();
  }
}
