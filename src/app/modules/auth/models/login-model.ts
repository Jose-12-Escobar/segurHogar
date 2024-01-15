export interface LoginOut {
  username: string;
  email: string;
  roles: string;
  name: string;
  lastname: string;
  token: string;
}

export interface LoginIn {
  usernameOrEmail: string;
  password: string;
}
