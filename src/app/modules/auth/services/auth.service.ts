import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/Services/api.service';
import { LoginIn, LoginOut } from '../models/login-model';
import { RegisterIn, RegisterOut } from '../models/register-model';
import { LocalStorageService } from '../../admin/services/local-storage.service';
import { skipApiKey } from '../http.contex';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl !: string;

  constructor(private http: HttpClient,
              private _baseUrl: ApiService,
              private _localStorageService: LocalStorageService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}`;
  }

  login(dataLogin: LoginIn): Observable<LoginOut> {
    return this.http.post<LoginOut>(`${this.baseUrl}/login`, dataLogin, { context: skipApiKey() })
  }

  register(dataRegister: RegisterIn ): Observable<RegisterOut> {
    return this.http.post<RegisterOut>(`${this.baseUrl}/signup`, dataRegister, { context: skipApiKey() })
  }

  isLogged(): boolean {
    return this._localStorageService.getItem('role') ? true : false;
  }
}
