import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {}

  onIndexChange(event: any) {
    let currentStatus = this.currentOrder.orderStatus;
    switch (true) {
      case event == -2 && currentStatus == 4:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == -1:
        this.isShowConfirmCancelOrder = true;
        break;
      case event == 1 && currentStatus == 0:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 2 && currentStatus == 1:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 3 && currentStatus == 2:
        this.updateStatus(this.currentOrder.id, event);
        break;
      case event == 4 &&
        (currentStatus == 3 ||
          (currentStatus == 1 && this.currentOrder.delivery == 0)):
        this.updateStatus(this.currentOrder.id, event);
        break;
      default:
        this.message.error('Không thể chuyển trạng thái');
        break;
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
