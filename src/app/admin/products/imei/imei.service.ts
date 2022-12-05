import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Interface } from 'readline';
import { catchError, map, Observable, of } from 'rxjs';
import { ImeiDto } from 'src/app/DTOs/ImeiDto';
import { ProductDetailDto } from 'src/app/DTOs/ProductDetailDto';
import { environment } from 'src/environments/environment';
import { ImeiUpload } from './imei.component';

export interface ExchangeImei {
  newImeiId: number;
  oldImeiId: number;
  currentOrderDetailId: number;
}
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
  exchangeImeiTheSameOrderDetail(data: ExchangeImei): Observable<ImeiDto[]> {
    return this.httpClient
      .put(`${this.baseUrl}/exchangeImeiTheSameOrderDetail`, data)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Thành công');
            return res;
          }
          return false;
        }),
        catchError(this.handleError<any>('Lỗi đổi imei', false))
      );
  }
  getImeisInStockByProductDetailId(
    productDetailId: number
  ): Observable<ImeiDto[]> {
    return this.httpClient
      .get(`${this.baseUrl}/imeisInStock?product_detail_id=${productDetailId}`)
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
          this.message.success('Thành công');
          return res.data.imei;
        }
        return [];
      }),
      catchError(this.handleError<any>('Error create imei', []))
    );
  }
  batchSaveImei(
    productDetailId: number,
    imeiUploads: ImeiUpload[]
  ): Observable<ImeiDto[] | ImeiUpload[]> {
    return this.httpClient
      .post(`${this.baseUrl}/imeis/${productDetailId}`, imeiUploads)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Thành công');
          } else if (res.statusCode == 400) {
            this.message.success(
              'Data chưa hợp lên vui lòng tải file về và kiểm tra lại'
            );
          }
          return res;
        }),
        catchError(this.handleError<any>('Error upload file', false))
      );
  }
  addImeisToOrderDetail(
    order_detail_id: number,
    product_detail_id: number,
    imeiDtos: ImeiDto[]
  ): Observable<ImeiDto[]> {
    return this.httpClient
      .post(
        `${this.baseUrl}/addImeisToOrderDetail/${order_detail_id}/${product_detail_id}`,
        imeiDtos
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 201) {
            this.message.success('Thành Công');
            return res.data.imeis;
          }
          return [];
        }),
        catchError(this.handleError<any>('Error add imei', []))
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
  deleteOrderDetailToImei(idImei: number): Observable<boolean> {
    return this.httpClient
      .delete(`${this.baseUrl}/deleteOrderDetailToImei/${idImei}`)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            this.message.success('Success');
            return true;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error Delete Imei', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }
}
