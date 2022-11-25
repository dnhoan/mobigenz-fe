import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './account.service';
import { Account, AccountDTO, Permission, Role } from './account.model';
import { SearchDTO } from 'src/app/DTOs/searchDTO';

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
  accountSearch: AccountDTO = {};
  accountDTO: AccountDTO = {};
  sortBy = 'email';
  descAsc = 'desc';
  idCustomer: any;
  offset = 0;
  limit = 1;
  Page: any;
  isVisible = false;
  action = true;
  searchDTO: SearchDTO ={};
  constructor(
    private readonly router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.getAllAccount();
    this.initFormSearch();
    this.pagination(this.offset);
  }

  showModal(): void {
    this.formAcc = this.fb.group({
      id: null,
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

  handleOk(): void {
    this.saveAccount();
    this.isVisible = false;
  }

  saveAccount() {
    this.addValueAccount();
    if (this.formAcc.value.id) {
      this.accountService.updateAccount(this.account).subscribe((res) => {
        this.toastr.success('Cập nhật tài khoản thành công!');
        this.getAllAccount();
      });
    }
    if(!this.formAcc.value.id){
        this.accountService
          .addAccount(this.account)
          .subscribe((res) => this.toastr.success('Tạo tài khoản thành công!'));
          this.getAllAccount();
    }

  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllAccount() {
    this.accountService.getAll(this.offset, this.limit).subscribe((res: any) => {
      console.log(res);

      this.datas = res.data.accounts.items;
    });
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      valueSearch: [''],
    });
  }

  FillValueSearch() {
    const formSearchValue = this.formSearch.value;
    this.searchDTO.valueSearch = formSearchValue.valueSearch;
  }

  fillValueForm() {
    this.formAcc.patchValue({
      id: this.account.id,
      email: this.account.email,
      phoneNumber: this.account.phoneNumber,
      password:this.account.password,
      status: this.account.status,
      role: this.account.roles![0].id,
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
    this.account.roles = [{ id: this.formAcc.value.role }];
    if (this.formAcc.value.status == 1) {
      this.account.status = 1;
    } else {
      this.account.status = 0;
    }
  }

  update() {
    this.addValueAccount();
    this.accountService.updateAccount(this.account).subscribe(
      (res) => {
        this.toastr.success('Cập nhật tài khoản thành công!');
      },
      (error) => {
        if (error.error.message === 'Cập nhật thất bại') {
          this.toastr.error(error.error.message);
        }
      }
    );
  }

  deleteAccount(id: any) {
    this.accountService.deleteAccount(id).subscribe((res: any) =>
      this.datas.forEach((value) => {
        if (value.id == id) {
          value.status = 0;
        }
      })
    );
  }


  pagination(page: any) {
    if (page < 0) page = 0;
    this.offset = page
    this.accountService.getAll(this.offset, this.limit)
      .subscribe(res => {
        this.datas = res.data.accounts.items;
        this.Page = res.data.accounts;
      },)

  }

  pageItem(pageItems: any){
    this.limit =  pageItems;
    this.pagination(this.offset);
  }


  preNextPage(selector: string) {
    if (selector == 'pre') --this.offset
    if (selector == 'next') ++this.offset;
    this.pagination(this.offset);
  }

  searchWithPage(page: any) {
    if (page < 0) page = 0;
    this.offset = page
    this.accountService.getPageAccount(this.offset, this.limit, this.searchDTO)
      .subscribe(res => {
        this.datas = res.data.accounts.content;
        this.Page = res.data.accounts;
      },)

  }

  timkiem(){
    this.FillValueSearch();
    this.searchWithPage(0);
    this.initFormSearch();
  }

}
