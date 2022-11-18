import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './account.model';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public apiAccount = `${environment.baseUrl}/`;
  constructor(private http: HttpClient) {
  }


  register(account: Account): Observable<any> {
    return this.http.post(this.apiAccount + "register", account);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiAccount + "admin/account/getAll");
  }

  addAccount(account: Account): Observable<any> {
    return this.http.post(this.apiAccount + "admin/account/addAccount", account);
  }


  getAccountById(id: any): Observable<any> {
    return this.http.get<any>(this.apiAccount + "admin/getAccountById?id=" + id);
  }

  getAccountByEmail(email: any): Observable<any> {
    return this.http.get<any>(this.apiAccount + "admin/account/getAccountByEmail?email=" + email);
  }

  public updateAccount(account: Account): Observable<any> {
    return this.http.put<any>(this.apiAccount + "admin/account/updateAccount", account);
  }

  public deleteAccount(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiAccount}` + "admin/account/delete/" + id);
  }

  public login(form: any): Observable<any> {
    return this.http.post<any>(this.apiAccount + "login", form);
  }

  public getPageTransfer(indexPage: any,
    descAsc: any, dto: any): Observable<any> {
    return this.http.put<any>(this.apiAccount + '/sortByKey?page=' + indexPage +
      '&descAsc=' + descAsc, dto);
  }

  sendOTP(email: any): Observable<any> {
    return this.http.get<any>(this.apiAccount + "forgot?email="+ email);
  }

  getOTP(email: any): Observable<any> {
    return this.http.get<any>(this.apiAccount + "getOTP?email="+ email);
  }

  getDecodedAccessToken(): any {
    const token = localStorage.getItem('auth-token');
    try {
      return jwt_decode(token!);
    } catch (Error) {
      return null;
    }
  }
}
