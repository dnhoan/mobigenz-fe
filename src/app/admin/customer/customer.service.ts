import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public apiCustomer = `${environment.baseUrl}/admin/`;
  constructor(private http: HttpClient) {}

  getAll(offset: any, limit: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'customers?offset=' + offset + '&limit=' + limit
    );
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.apiCustomer + 'customers', customer);
  }

  getCustomerById(id: any): Observable<any> {
    return this.http.get<any>(this.apiCustomer + 'customers/' + id);
  }

  getCustomerByAccountId(accountId: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'getCustomerByAccountId?accountId=' + accountId
    );
  }

  getCustomerByCusName(customerName: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'customers/customerName?customerName=' + customerName
    );
  }

  getCustomerByEmail(email: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'customers/email?email=' + email
    );
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.http.put<any>(this.apiCustomer + 'customers/', customer);
  }

  public deleteCustomer(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiCustomer}` + 'customers/' + id);
  }

  public getPageTransfer(
    indexPage: any,
    descAsc: any,
    dto: any
  ): Observable<any> {
    return this.http.put<any>(
      this.apiCustomer + '/sortByKey?page=' + indexPage + '&descAsc=' + descAsc,
      dto
    );
  }
}
