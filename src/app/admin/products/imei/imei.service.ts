import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, Observable, of } from 'rxjs';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImeiService {
  baseUrl = `${environment.baseUrl}/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}

  getImeisByProductDetailId(productDetailId: number): Observable<ImeiDto[]> {
    return this.httpClient
      .get(`${this.baseUrl}/imeis?product_detail_id=${productDetailId}`)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.imeis;
          }
          return [];
        }),
        catchError(this.handleError<any>('Error get imei', []))
      );
  }
  save(imeiDto: ImeiDto): Observable<ImeiDto[]> {
    return this.httpClient.post(`${this.baseUrl}/imei`, imeiDto).pipe(
      map((res: any) => {
        if (res.statusCode === 201) {
          this.message.success('Success');
          return res.data.imei;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error create imei', []))
    );
  }
  deleteImei(idImei?: number): Observable<boolean> {
    return this.httpClient.delete(`${this.baseUrl}/imei/${idImei}`).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          this.message.success('Success');
          return true;
        }
        return false;
      }),
      catchError(this.handleError<any>('Error delete imei', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }
}
