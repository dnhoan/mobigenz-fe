import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    let statusName = '';
    switch (value) {
      case -1:
        statusName = 'Đã hủy';
        break;
      case 0:
        statusName = 'Đang chờ';
        break;
      case 1:
        statusName = 'Đã xác nhận';
        break;
      case 2:
        statusName = 'Đang đóng gói';
        break;
      case 3:
        statusName = 'Đã đóng gói';
        break;
      case 4:
        statusName = 'Đang vận chuyển';
        break;
      case 5:
        statusName = 'Hoàn thành';
        break;
    }
    return statusName;
  }
}
