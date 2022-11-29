import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { InfoService } from '../service/infoUser.service';
import { SessionService } from '../service/session.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isCollapsed = false;

  constructor(private accountService: AccountService,
    private sessionService: SessionService,
    private infoService: InfoService) {}

  ngOnInit(): void {
    this.getInfo();
  }

getInfo(){
  const jwtDecode = this.accountService.getDecodedAccessToken();
  const email = this.sessionService.getItemUser('auth-user');
          this.accountService
            .getAccountByEmail(jwtDecode.sub)
}

  logout() {}
}
