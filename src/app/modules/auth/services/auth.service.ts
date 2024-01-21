import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/Services/api.service';
import { LoginIn, LoginOut } from '../models/login-model';
import { RegisterIn, RegisterOut } from '../models/register-model';
import { LocalStorageService } from '../../admin/services/local-storage.service';
import { skipApiKey } from '../http.contex';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl !: string;

  constructor(private http: HttpClient,
              private _baseUrl: ApiService,
              private _sessionService: SessionStorageService,
              private _localStorage: LocalStorageService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}`;
  }

  login(dataLogin: LoginIn): Observable<LoginOut> {
    return this.http.post<LoginOut>(`${this.baseUrl}/login`, dataLogin, { context: skipApiKey() })
  }

  register(dataRegister: RegisterIn ): Observable<RegisterOut> {
    return this.http.post<RegisterOut>(`${this.baseUrl}/signup`, dataRegister, { context: skipApiKey() })
  }

  isLogged(): boolean {
    return this._sessionService.getItem('token') ? true : false;
  }

  roleIsAdmin(): boolean {
    if (this._localStorage.getItem('role') === 'ROLE_ADMIN')
      return true;
    else
      return false;
  }
}
