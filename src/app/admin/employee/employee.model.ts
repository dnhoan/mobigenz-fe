import { Account, Role } from '../account/account.model';

export interface Employee {
    id?: number;
    employeeName?: string;
    employeeCode?: string;
    account?: Account;
    phoneNumber?: string;
    address?: string;
    birthday?: Date;
    gender?: number;
    email?: string;
    cmnd?: number;
    salary?: string;
    timeOnboard?: Date;
    dayOff?: Date;
    note?: string;
    status?: number;
}

export interface EmployeeDTO {
  id?: number;
  employeeName?: string;
  employeeCode?: string;
  phoneNumber?: string;
  address?: string;
  birthday?: Date;
  gender?: number;
  email?: string;
  cmnd?: number;
  salary?: string;
  timeOnboard?: Date;
  dayOff?: Date;
  note?: string;
  status?: number;
}
