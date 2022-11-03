export interface Account{
  id?: number;
  email?: string;
  password?: string;
  role?: Role;
  ctime?: Date;
  mtime?: Date;
  status?: number;
}

export interface AccountDTO{
  id?: number;
  email?: string;
  password?: string;
  role?: Role;
  ctime?: Date;
  mtime?: Date;
  status?: number;
}

export interface Role{
  id?: number;
  roleName?: string;
  ctime?: Date;
  mtime?: Date;
  note?: string;
}
