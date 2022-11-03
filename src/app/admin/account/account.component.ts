import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { Account , AccountDTO } from './account.model';

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
  constructor(
    private readonly router: Router,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllAccount();
    this.initFormSearch();
  }

  showModal(): void {
    if (this.account && this.account.id != 0) {
      this.account.id = 0;
    }

    this.formAcc = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['', [Validators.required]],
      rollName: ['',[Validators.required]],
    });
    this.isVisible = true;
  }

  // showModalUpdate(id: any): void {
  //   this.fillValueForm()
  //   this.isVisible = true;
  // }

  handleOk(): void {
    console.log(this.account);
    this.saveAccount(this.account);
    this.isVisible = false;
  }

  saveAccount(account: Account) {
    this.accountService
      .addAccount(account)
      .subscribe((res: any) => this.getAllAccount());
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllAccount() {
    this.accountService.getAll().subscribe((res: any) => {
      this.datas = res.data.accounts.items;
    });
  }

  initFormSearch() {
    this.formSearch! = this.fb.group({
      email: '',
    });
  }

}
