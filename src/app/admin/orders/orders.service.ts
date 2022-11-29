import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, Observable, of } from 'rxjs';
import { OrderDetailDto } from 'src/app/DTOs/OrderDetailDto';
import { OrderDto } from 'src/app/DTOs/OrderDto';
import { StatusUpdate } from 'src/app/DTOs/StatusUpdate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}

  saveOrder(orderDto: OrderDto) {
    return this.httpClient
      .post(`${environment.baseUrl}/admin/order`, orderDto)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Thành công');
            return res.data.order;
          }
          return [];
        }),
        catchError(this.handleError<any>('Lỗi hệ thống', []))
      );
  }
  createOrderDetailWhenExchangeImei(
    orderId: number,
    oldImeiId: number,
    orderDetailDto: OrderDetailDto
  ) {
    return this.httpClient
      .post(
        `${environment.baseUrl}/admin/createOrderDetailWhenExchangeImei/${orderId}/${oldImeiId}`,
        orderDetailDto
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Thành công');
            return res.data.orderDetail;
          }
          return [];
        }),
        catchError(this.handleError<any>('Lỗi hệ thống', false))
      );
  }
  changeOrderDetail(
    orderId: number,
    currentOrderDetailId: number,
    orderDetailDto: OrderDetailDto
  ) {
    return this.httpClient
      .post(
        `${environment.baseUrl}/admin/changeOrderDetail/${orderId}/${currentOrderDetailId}`,
        orderDetailDto
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Thành công');
            return res.data.orderDetail;
          }
          return [];
        }),
        catchError(this.handleError<any>('Lỗi hệ thống', false))
      );
  }
  createOrderDetailToOrder(order_id: number, orderDetailDto: OrderDetailDto) {
    return this.httpClient
      .post(
        `${environment.baseUrl}/admin/addOrderDetailToOrder/${order_id}`,
        orderDetailDto
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Thành công');
            return res.data.orderDetail;
          }
          return [];
        }),
        catchError(this.handleError<any>('Lỗi hệ thống', []))
      );
  }
  deleteOrderDetail(orderDetailId: number) {
    return this.httpClient
      .delete(`${environment.baseUrl}/admin/deleteOrderDetail/${orderDetailId}`)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Thành công');
            return res.data.res;
          }
          return false;
        }),
        catchError(this.handleError<any>('Lỗi hệ thống', false))
      );
  }
  cancelOrder(order_id: number, note: string) {
    return this.httpClient
      .put(`${environment.baseUrl}/admin/cancelOrder/${order_id}`, note)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Đơn hàng đã được hủy');
            return res.data.result;
          }
          return false;
        }),
        catchError(this.handleError<any>('Lỗi hủy đơn hàng', false))
      );
  }
  updateOrderStatus(order_id: number, newStatus: number, cancelNote?: string) {
    let data: StatusUpdate = {
      orderId: order_id,
      newStatus,
      note: cancelNote ? cancelNote : '',
    };
    return this.httpClient
      .put(`${environment.baseUrl}/admin/updateOrderStatus`, data)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Cập nhật trạng thái đơn hàng thành công');
            return true;
          }
          return false;
        }),
        catchError(this.handleError<any>('Lỗi cập nhật đơn hàng', false))
      );
  }
  getOrders(order_status?: any) {
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
  getOrderById(id: any) {
    return this.httpClient.get(`${environment.baseUrl}/admin/order/${id}`).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          return res.data.order;
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
}
