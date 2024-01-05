import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/Services/api.service';
import { Login } from '../models/login-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl !: string;

  constructor(private http: HttpClient, private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}`;
  }

  login(dataClient: Login): Observable<{}[]> {
    return this.http.post<{}[]>(this.baseUrl, dataClient)
  }

}
