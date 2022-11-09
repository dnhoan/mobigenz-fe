import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './account.service';
import { Account, AccountDTO, Role } from './account.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  formAcc!: FormGroup;
  formSearch!: FormGroup;
  radioValue = 'A';
  account: Account = {};
  datas: AccountDTO[] = [];
  page: object = {};
  accountSearch: AccountDTO = {};
  accountDTO: AccountDTO = {};
  sortBy = 'email';
  descAsc = 'desc';
  idCustomer: any;
  indexPage = 0;
  isVisible = false;
  action = true;
  constructor(
    private readonly router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllAccount();
    this.initFormSearch();
  }

  showModal(): void {
    this.formAcc = this.fb.group({
      id:null,
      email: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})'),
        ],
      ],
      role: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    this.isVisible = true;
  }

  // showModalUpdate(id: any): void {
  //   this.fillValueForm()
  //   this.isVisible = true;
  // }

  handleOk(): void {
    console.log(this.account);
    this.saveAccount();
    this.isVisible = false;
  }

  saveAccount() {
    this.addValueAccount();
    this.accountService.addAccount(this.account).subscribe(
      (res) => {
        if(this.formAcc.value.id){
          this.toastr.success('Cập nhật tài khoản thành công!');
        }else{
          this.toastr.success('Tạo tài khoản thành công!');
        }

        this.getAllAccount();
      });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllAccount() {
    this.accountService.getAll().subscribe((res: any) => {
      this.datas = res.data.accounts.items;
      console.log(this.datas);
    });
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      emailSearch: ['', Validators.email],
    });
  }


  fillValueForm() {
    this.formAcc.patchValue({
      id: this.account.id,
      email: this.account.email,
      phoneNumber: this.account.phoneNumber,
      status: this.account.status,
      role: this.account.roleid?.id,
    });
  }

  getInfoAccount(id: any) {
    this.showModal();
    const accountByID = this.datas.find((value) => {
      return value.id == id;

    });
    if (accountByID) {
      this.account = accountByID;
    }
    this.fillValueForm();
  }

  addValueAccount() {
    this.account.id = this.formAcc.value.id;
    this.account.email = this.formAcc.value.email;
    this.account.password = this.formAcc.value.password;
    this.account.phoneNumber = this.formAcc.value.phoneNumber;
    this.account.roleid = { id: this.formAcc.value.role };
    if (this.formAcc.value.status == 1) {
      this.account.status = 1;
    } else {
      this.account.status = 0;
    }
  }

  // update() {
  //   this.addValueAccount();
  //   this.accountService.updateAccount(this.account).subscribe(
  //     (res) => {
  //       this.toastr.success('Cập nhật tài khoản thành công!');
  //       this.router.navigate(['/admin/account'])
  //     },
  //     (error) => {
  //       if (error.error.message === 'Cập nhật thất bại') {
  //         this.toastr.error(error.error.message);
  //     }
  //   }
  //   );
  // }

  deleteAccount(id: any) {
    this.accountService.deleteAccount(id).subscribe((res: any) =>
      this.datas.forEach((value) => {
        if (value.id == id) {
          value.status = 0;
        }
      })
    );
  }
}
