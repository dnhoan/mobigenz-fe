import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { CommonService } from 'src/app/service/common.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.ordersService.getOrders('').subscribe((res) => {
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
    this.router.navigate([`/admin/order/${id}`]);
  }
}
