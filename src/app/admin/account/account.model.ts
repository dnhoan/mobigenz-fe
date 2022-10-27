export interface Account{
  email?: string;
  password?: string;
  role?: Role;
  ctime?: Date;
  mtime?: Date;
  status?: string;
}

export interface Role{
  roleName?: string;
  ctime?: Date;
  mtime?: Date;
  note?: string;
}
