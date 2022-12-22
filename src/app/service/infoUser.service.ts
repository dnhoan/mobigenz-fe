import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { BehaviorSubject, lastValueFrom, Subject } from 'rxjs';
import { CustomerService } from '../admin/customer/customer.service';
import { AccountService } from '../admin/account/account.service';
import { EmployeeDTO } from '../admin/employee/employee.model';
import { EmployeeService } from '../admin/employee/employee.service';
import { HttpClient } from '@angular/common/http';
import { profileStore } from '../admin/profile/profile.repository';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  employee$ = new Subject<EmployeeDTO>();
  currentEmployee!: EmployeeDTO;
  constructor(
    private http: HttpClient
    ,
    private employeeService: EmployeeService,
    private accountService: AccountService
  ) {}

  setEmployee(employeeUrl: any) {
    this.employee$.next(employeeUrl);
  }

  async getEmployee() {
    let decode = this.accountService.getDecodedAccessToken();
    console.log(decode.sub);
    if (decode) {
      let value = await lastValueFrom(
        this.employeeService.getEmployeeByEmail(decode.sub)
      );
      console.log(value);

      profileStore.update(() => ({
        employee: value.data.employee,
      }));
      this.currentEmployee = value.data.employee;
      this.employee$.next(value.data.employee);
      console.log(this.employee$);

    }
  }
}
