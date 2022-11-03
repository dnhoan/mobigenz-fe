import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public apiAccount = "http://localhost:8080/api/";
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiAccount + "account");
  }

  addAccount(account: Account): Observable<any> {
    return this.http.post(this.apiAccount + "account", account);
  }

  getAccountById(id: any): Observable<any> {
    return this.http.get<any>(this.apiAccount + "account/" + id);
  }

  public updateAccountr(account: Account): Observable<any> {
    return this.http.put<any>(this.apiAccount + "account/", account);
  }

  public deleteAccount(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiAccount}` + "account/" + id);
  }

  public getPageTransfer(indexPage: any,
    descAsc: any, dto: any): Observable<any> {
    return this.http.put<any>(this.apiAccount + '/sortByKey?page=' + indexPage +
      '&descAsc=' + descAsc, dto);
  }

}
