import { Account } from '../account/account.model';

export interface Customer {
  id?: number;
  customerName?: string;
  phoneNumber?: string;
  birthday?: Date;
  image?: string;
  gender?: number;
  email?: string;
  customerType?: number;
  citizenIdentifyCart?: string;
  ctime?: Date;
  mtime?: Date;
  status?: number;
  account?: Account;
}

export interface CustomerDTO {
  id?: number;
  customerName?: string;
  phoneNumber?: string;
  birthday?: Date;
  gender?: number;
  email?: string;
  customerType?: number;
  citizenIdentifyCart?: string;
  ctime?: Date;
  status?: number;
}
