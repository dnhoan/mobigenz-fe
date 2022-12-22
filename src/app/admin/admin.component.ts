import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { InfoService } from '../service/infoUser.service';
import { SessionService } from '../service/session.service';
import { Account } from './account/account.model';
import { AccountService } from './account/account.service';
import { profileStore } from './profile/profile.repository';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isCollapsed = false;
  account: Account | null = null;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private accountService: AccountService,
    private sessionService: SessionService,
    private infoService: InfoService
  ) {}

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    const jwtDecode = this.accountService.getDecodedAccessToken();
    const email = this.sessionService.getItemUser('auth-user');
    this.accountService.getAccountByEmail(jwtDecode.sub);
  }

  logout() {
    window.localStorage.removeItem('auth-token');
    window.localStorage.removeItem('auth-user');
    window.localStorage.removeItem('id-account');
    this.router.navigate(['login']);
    this.toast.success('Đăng xuất thành công!');
    this.infoService.setEmployee(null);
    profileStore.reset();
    this.account = null;
  }
}
