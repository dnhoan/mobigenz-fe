export interface Account{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  roleid?: Role;
  status?: number;
}

export interface AccountDTO{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  roleid?: Role;
  status?: number;
}

export interface Role{
  id?: number;
  roleName?: string;
  ctime?: Date;
  mtime?: Date;
  note?: string;
}
