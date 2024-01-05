import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sinister } from '../models/sinister-model';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/Services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SinisterService {

  private baseUrl !: string;

  constructor(private http: HttpClient, private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}/sinisters`;
  }

  getAllSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(this.baseUrl)
  }

}
