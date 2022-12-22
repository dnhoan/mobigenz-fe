import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from './customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  public apiCustomer = `${environment.baseUrl}/`;
  constructor(private http: HttpClient) {}

  getAll(offset: any, limit: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer +
        'admin/customers/getAll?offset=' +
        offset +
        '&limit=' +
        limit
    );
  }

  public getByStatus(
    offset: number,
    limit: number,
    status: number
  ): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer +
        'admin/customers/findByStatus?offset=' +
        offset +
        '&limit=' +
        limit +
        '&status=' +
        status
    );
  }

  public getPageCustomer(
    offset: number,
    limit: number,
    searchDTO: any
  ): Observable<any> {
    return this.http.put<any>(
      this.apiCustomer +
        'admin/customers/findByKey?offset=' +
        offset +
        '&limit=' +
        limit,
      searchDTO
    );
  }

  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.apiCustomer + 'admin/customers', customer);
  }

  getCustomerById(id: any): Observable<any> {
    return this.http.get<any>(this.apiCustomer + 'admin/customers/' + id);
  }

  getCustomerByAccountId(accountId: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'admin/getCustomerByAccountId?accountId=' + accountId
    );
  }

  getCustomerByCusName(customerName: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer +
        'admin/customers/customerName?customerName=' +
        customerName
    );
  }

  getCustomerByEmail(email: any): Observable<any> {
    return this.http.get<any>(
      this.apiCustomer + 'admin/customers/email?email=' + email
    );
  }

  public updateCustomer(customer: Customer): Observable<any> {
    return this.http.put<any>(this.apiCustomer + 'admin/customers', customer);
  }

  public deleteCustomer(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiCustomer}` + 'admin/customers/' + id
    );
  }
}
