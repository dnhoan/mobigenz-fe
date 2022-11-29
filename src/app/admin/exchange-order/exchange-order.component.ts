import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ORDER_STATUS } from 'src/app/constants';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { CommonService } from 'src/app/service/common.service';
import { OrderDetailComponent } from '../orders/order-detail/order-detail.component';
import { OrdersService } from '../orders/orders.service';

@Component({
  selector: 'app-exchange-order',
  templateUrl: './exchange-order.component.html',
  styleUrls: ['./exchange-order.component.scss'],
})
export class ExchangeOrderComponent implements OnInit {
  orders: OrderDto[] = [];
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    public commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.ordersService.getOrders(ORDER_STATUS.EXCHANGE).subscribe((res) => {
      this.orders = res;
    });
  }
  showOrderDetail(order: OrderDto) {
    const modal = this.modal.create({
      nzTitle: 'Chi tiết đơn hàng',
      nzContent: OrderDetailComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        currentOrder: order,
      },
      nzWidth: '1000px',
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [],
    });
  }
  openEditOrder(id: number) {
    this.router.navigate([`/admin/exchangeOrder/${id}`]);
  }
}
