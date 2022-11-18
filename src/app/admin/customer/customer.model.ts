import { Account } from '../account/account.model';

export interface Customer {
  id?: number;
  customerName?: string;
  phoneNumber?: string;
  birthday?: String;
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
  customerName?: string;
  phoneNumber?: string;
  birthday?: string;
  gender?: number;
  email?: string;
  customerType?: number;
  citizenIdentifyCart?: string;
  ctime?: Date;
  status?: number;
}
