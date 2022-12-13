import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public apiEmployee = `${environment.baseUrl}/`;
  constructor(private http: HttpClient) {}

  getAll(offset: any, limit: any): Observable<any> {
    return this.http.get<any>(
      this.apiEmployee +
        'admin/employee/getAll?offset=' +
        offset +
        '&limit=' +
        limit
    );
  }

  public getPageEmployee(
    offset: number,
    limit: number,
    searchDTO: any
  ): Observable<any> {
    return this.http.put<any>(
      this.apiEmployee +
        'admin/employee/findByKey?offset=' +
        offset +
        '&limit=' +
        limit,
      searchDTO
    );
  }

  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.apiEmployee + 'admin/employee', employee);
  }

  getEmployeeById(id: any): Observable<any> {
    return this.http.get<any>(this.apiEmployee + 'admin/employee/' + id);
  }

  getEmployeeByAccountId(accountId: any): Observable<any> {
    return this.http.get<any>(
      this.apiEmployee + 'admin/getEmployeeByAccountId?accountId=' + accountId
    );
  }

  getEmployeeByEmpName(employeeName: any): Observable<any> {
    return this.http.get<any>(
      this.apiEmployee +
        'admin/employee/employeeName?employeeName=' +
        employeeName
    );
  }

  getEmployeeByEmail(email: any): Observable<any> {
    return this.http.get<any>(
      this.apiEmployee + 'admin/employee/email?email=' + email
    );
  }

  public updateEmployee(employee: Employee): Observable<any> {
    return this.http.put<any>(this.apiEmployee + 'admin/employee', employee);
  }

  public deleteEmployee(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiEmployee}` + 'admin/employee/' + id
    );
  }
}
