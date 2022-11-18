export interface Account{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  roles?: Role[];
  status?: number;
}

export interface AccountDTO{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  roles?: Role[];
  status?: number;
}

export interface Role{
  id?: number;
  roleName?: string;
  ctime?: Date;
  mtime?: Date;
  note?: string;
}

export interface Permission{
  id?: number;
  account_id?: Account;
  role_id?: Role;
}
