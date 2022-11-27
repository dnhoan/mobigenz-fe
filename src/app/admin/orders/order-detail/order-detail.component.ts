import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { CommonService } from 'src/app/service/common.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input('order') currentOrder!: OrderDto;
  isShowConfirmCancelOrder = false;
  cancelNote: string = '';
  constructor(
    public commonService: CommonService,
    private orderService: OrdersService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {}

  onIndexChange(event: any) {
    if (
      (event == -1 && event != this.currentOrder.orderStatus) ||
      event > this.currentOrder.orderStatus
    ) {
      if (event == -1) {
        this.isShowConfirmCancelOrder = true;
      } else {
        this.updateStatus(this.currentOrder.id, event);
      }
    }
  }
  updateStatus(orderId: number, newStatus: number, note?: string) {
    this.orderService
      .updateOrderStatus(orderId, newStatus, note)
      .subscribe((res) => {
        if (res) {
          this.currentOrder.orderStatus = newStatus;
          this.currentOrder.cancelNote = this.cancelNote;
        }
      });
  }
  handleOk() {
    this.updateStatus(this.currentOrder.id, -1, this.cancelNote);
    this.isShowConfirmCancelOrder = false;
  }
  handleCancel() {
    this.isShowConfirmCancelOrder = false;
  }
}
