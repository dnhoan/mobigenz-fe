import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderStatus } from '../DTOs/OrderStatus';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}

  getAddresses(order_status?: any) {
    return this.httpClient
      .get(`${environment.baseUrl}/admin/orders/?orderStatus=${order_status}`)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.orders;
          }
          return [];
        }),
        catchError(this.handleError<any>('Lỗi gọi danh sách đơn hàng', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }

  orderStatuses: OrderStatus[] = [
    {
      status: 0,
      statusName: 'Đang chờ',
      color: 'default',
      icon: 'loading',
    },
    {
      status: 1,
      statusName: 'Xác nhận',
      color: 'processing',
      icon: 'check',
    },

    {
      status: 2,
      statusName: 'Đã đóng gói',
      color: 'orange',
      icon: 'dropbox',
    },
    {
      status: 3,
      statusName: 'Đang vận chuyển',
      color: 'lime',
      icon: 'car',
    },
    {
      status: 4,
      statusName: 'Hoàn thành',
      color: 'success',
      icon: 'check-circle',
    },
    {
      status: -1,
      statusName: 'Hủy',
      color: 'error',
      icon: 'stop',
    },
  ];
}
