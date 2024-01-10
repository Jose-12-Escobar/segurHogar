export interface LoginOut {
  username: string;
  email: string;
  roles: string;
  name: string;
  lastname: string;
}

export interface LoginIn {
  usernameOrEmail: string;
  password: string;
}
