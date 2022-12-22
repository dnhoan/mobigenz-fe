import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { InfoService } from 'src/app/service/infoUser.service';
import { Customer, CustomerDTO } from '../customer/customer.model';
import { CustomerService } from '../customer/customer.service';
import { Employee, EmployeeDTO } from '../employee/employee.model';
import { EmployeeService } from '../employee/employee.service';
import { profileStore } from './profile.repository';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  formProfile!: FormGroup;
  employee: EmployeeDTO = {};
  subEmployee!: Subscription;
  submit = false;
  offset = 0;
  limit = 5;
  disable = true;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    readonly router: Router,
    private toastr: ToastrService,
    private infoService: InfoService
  ) {}

  ngOnDestroy() {
    this.subEmployee.unsubscribe();
  }

  ngOnInit() {
    this.employeeService.getAllEmp();
    this.initForm();
    console.log(profileStore);

    this.subEmployee = profileStore.subscribe((res: any) => {
      console.log(res);

      if (res.employee) {
        this.employee = res.employee as EmployeeDTO;
        this.fillValueForm();
      }
    });
  }

  initForm() {
    this.formProfile = this.fb.group({
      id: null,
      employeeName: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      birthday: ['', [Validators.required]],
      email: ['', [Validators.required]],
      gender: [''],
      cmnd: ['', [Validators.pattern('^[0-9]{12}$')]],
      status: [''],
    });
  }

  fillValueForm() {
    let bd;
    if (this.employee.birthday) bd = this.formatDate(this.employee.birthday);
    else bd = null;
    this.formProfile.patchValue({
      id: this.employee.id,
      employeeName: this.employee.employeeName,
      employeeCode: this.employee.employeeCode,
      birthday: bd,
      phoneNumber: this.employee.phoneNumber,
      address: this.employee.address,
      gender: this.employee.gender,
      email: this.employee.email,
      cmnd: this.employee.cmnd,
      salary: this.employee.salary,
      status: this.employee.status,
    });
  }

  update() {
    this.submit = true;
    if (this.formProfile.valid) {
      this.addValueProfile();
      this.employeeService.updateEmployee(this.employee).subscribe(
        (res) => {
          this.toastr.success('Cập nhật khách hàng thành công!');
          this.employeeService.getAll(this.offset, this.limit);
          return;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  addValueProfile() {
    this.employee.id = this.formProfile.value.id;
    this.employee.employeeName = this.formProfile.value.employeeName;
    this.employee.employeeCode = this.formProfile.value.employeeCode;
    this.employee.birthday = this.formProfile.value.birthday;
    this.employee.address = this.formProfile.value.address;
    this.employee.gender = this.formProfile.value.gender;
    this.employee.email = this.formProfile.value.email;
    this.employee.cmnd = this.formProfile.value.cmnd;
    this.employee.phoneNumber = this.formProfile.value.phoneNumber;
    this.employee.status = this.formProfile.value.status;
  }

  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  reFormatDate(date: Date) {
    var d = new Date(date),
      month = '' + d.getMonth(),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
