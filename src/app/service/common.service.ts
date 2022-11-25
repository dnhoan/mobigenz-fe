import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

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
}
