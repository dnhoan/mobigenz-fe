import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchDTO } from 'src/app/DTOs/SearchDTO';
import { Employee, EmployeeDTO } from './employee.model';
import { EmployeeService } from './employee.service';
@Component({
  selector: 'app-Employee',
  templateUrl: './Employee.component.html',
  styleUrls: ['./Employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  formEmployee!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  employee: Employee = {};
  datas: Employee[] = [];
  offset = 0;
  limit = 5;
  Page: any;
  employeeSearch: EmployeeDTO = {};
  employeeDTO: EmployeeDTO = {};
  searchDTO: SearchDTO = {};
  idEmployee: any;
  indexPage = 0;
  isVisible = false;
  submit = false;

  constructor(
    private readonly router: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.getAllEmployee();
    this.initForm();
  }


  showModal(): void {
    this.submit = false;
    this.initFormEmployee();
    this.isVisible = true;
  }

initFormEmployee(){
  this.formEmployee = this.fb.group({
    id: null,
    employeeName: ['', [Validators.required]],
    employeeCode: ['', [Validators.required]],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
      ],
    ],
    address: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    gender: [''],
    email: ['', [Validators.required, Validators.email]],
    cmnd: [''],
    salary: [''],
    timeOnboard: [''],
    dayOff: [''],
    note: [''],
    status: [1],
  });
}


  handleOk(): void {
    this.submit = true;
    if (this.formEmployee.valid) {
      this.saveEmployee();
      this.isVisible = false;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  saveEmployee() {
    if (this.employee.id) {
      this.update();
      return;
    }
    this.addEmployee(this.employee);
  }

  addEmployee(employee: Employee) {
    if (this.formEmployee.valid) {
      this.addValueEmployee();
      this.employeeService.addEmployee(employee).subscribe(
        (res) => {
          this.getAllEmployee();
          this.toastr.success('Thêm nhân viên thành công!');
          this.isVisible = false;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
    this.isVisible = true;
    return;
  }

  getAllEmployee() {
    this.employeeService
      .getAll(this.offset, this.limit)
      .subscribe((res: any) => {
        console.log(res);
        this.datas = res.data.employee.items;
      });
  }

  getInfoEmployee(id: any) {
    this.showModal();
    const employeeByID = this.datas.find((value) => {
      console.log(value);

      return value.id == id;
    });
    if (employeeByID) {
      this.employee = employeeByID;
    }
    this.fillValueForm();
  }

  initForm() {
    this.initFormEmployee();
    this.initFormSearch();
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: '',
    });
  }

  fillValueForm() {
    let birthdays;
    let timeOnboards;
    let dayOffs;
    if (this.employee.birthday) birthdays = this.formatDate(this.employee.birthday);
    else birthdays = null;
    if (this.employee.birthday) timeOnboards = this.formatDate(this.employee.birthday);
    else timeOnboards = null;
    if (this.employee.birthday) dayOffs = this.formatDate(this.employee.birthday);
    else dayOffs = null;
    this.formEmployee.patchValue({
      id: this.employee.id,
      employeeCode: this.employee.employeeCode,
      employeeName: this.employee.employeeName,
      phoneNumber: this.employee.phoneNumber,
      address: this.employee.address,
      birthday: birthdays,
      gender: this.employee.gender,
      email: this.employee.email,
      cmnd: this.employee.cmnd,
      salary: this.employee.salary,
      timeOnboard: timeOnboards,
      dayOff: dayOffs,
      note: this.employee.note,
      status: this.employee.status,
    });
  }

  update() {
    if (this.formEmployee.valid) {
      this.addValueEmployee();
      this.employeeService.updateEmployee(this.employee).subscribe(
        (res) => {
          this.getAllEmployee();
          this.toastr.success('Cập nhật thông tin nhân viên thành công!');
          return;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
    this.isVisible = true;
    return;
  }

  addValueEmployee() {
    // let bd;
    // if (this.Employee.birthday) bd = this.reFormatDate(this.Employee.birthday);
    // else bd = null;
    this.employee.id = this.formEmployee.value.id;
    this.employee.employeeCode = this.formEmployee.value.employeeCode;
    this.employee.employeeName = this.formEmployee.value.employeeName;
    this.employee.phoneNumber = this.formEmployee.value.phoneNumber;
    this.employee.address = this.formEmployee.value.address;
    this.employee.birthday = this.formEmployee.value.birthday;
    this.employee.gender = this.formEmployee.value.gender;
    this.employee.email = this.formEmployee.value.email;
    this.employee.cmnd = this.formEmployee.value.cmnd;
    this.employee.salary = this.formEmployee.value.salary;
    this.employee.timeOnboard = this.formEmployee.value.timeOnboard;
    this.employee.dayOff = this.formEmployee.value.dayOff;
    this.employee.note = this.formEmployee.value.note;
    this.employee.status = this.formEmployee.value.status;
  }

  deleteEmployee(id: any) {
    this.employeeService.deleteEmployee(id).subscribe(
      (res) => {
        this.datas.forEach((value) => {
          if (value.id == id) {
            value.status = 0;
            this.toastr.success('Xóa nhân viên thành công!');
            return;
          }
        });
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.employeeService.getAll(this.offset, this.limit).subscribe((res) => {
      this.datas = res.data.employee.items;
      console.log(this.datas);

      this.Page = res.data.employee;
    });
  }

  changePage(page: number) {}

  pageItem(pageItems: any) {
    this.limit = pageItems;
    this.pagination(this.offset);
  }

  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset;
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page;
    this.employeeService
      .getPageEmployee(this.offset, this.limit, this.searchDTO)
      .subscribe((res) => {
        this.datas = res.data.employee.content;
        this.Page = res.data.employee;
      });
  }
  FillValueSearch() {
    const formSearchValue = this.formSearch.value;
    this.searchDTO.valueSearch = formSearchValue.valueSearch;
  }

  timkiem() {
    this.FillValueSearch();
    this.searchWithPage(0);
    this.initFormSearch();
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
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day, ].join('-');
  }

}
