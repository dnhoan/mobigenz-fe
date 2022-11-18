import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { BehaviorSubject } from 'rxjs';
import { CustomerService } from '../admin/customer/customer.service';
import { AccountService } from '../admin/account/account.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  public user = new BehaviorSubject<any>(null);

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService
  ) {}

  setUser(cusUrl: any) {
    this.user.next(cusUrl);
  }

  getUser() {
    let decode = this.accountService.getDecodedAccessToken();
    if (decode) {
      this.accountService.getAccountByEmail(decode.sub).subscribe(
        (value) => {
          this.user.next(value.data.account);
        },
        (Error) => {
          this.user.next(null);
        }
      );
    }
  }
}
