import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface StatisticIncome {
  thang: number;
  dt_store: number;
  dt_online: number;
  ngay: number;
}
@Injectable({
  providedIn: 'root',
})
export class StatisticIncomeService {
  baseUrl = `${environment.baseUrl}/admin`;
  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService
  ) {}
  getStatisticIncomeByYear(year: number): Observable<StatisticIncome[]> {
    return this.httpClient
      .get(`${this.baseUrl}/statisticIncome/year/${year}`)
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.statisticIncomes;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error báo cáo', false))
      );
  }
  getStatisticIncomeByDay(
    s_date: string,
    e_date: string
  ): Observable<StatisticIncome[]> {
    return this.httpClient
      .get(
        `${this.baseUrl}/statisticIncome/date?s_date=${s_date}&e_date=${e_date}`
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.statisticIncomes;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error báo cáo', false))
      );
  }
  statisticOrderStatus(s_date: string, e_date: string): Observable<number[]> {
    return this.httpClient
      .get(
        `${this.baseUrl}/statisticOrderStatus/?s_date=${s_date}&e_date=${e_date}`
      )
      .pipe(
        map((res: any) => {
          if (res.statusCode === 200) {
            return res.data.statisticOrderStatus;
          }
          return false;
        }),
        catchError(this.handleError<any>('Error báo cáo', false))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(operation);
      return of(result as T);
    };
  }
}
