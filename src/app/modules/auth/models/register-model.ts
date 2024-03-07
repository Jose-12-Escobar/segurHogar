export interface RegisterIn {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterOut {
  username: string;
  email: string;
  roles: string;
  name: string;
  lastname: string;
}
