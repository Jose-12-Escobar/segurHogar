import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/Services/api.service';
import { Client } from '../../admin/models/client-model';



@Injectable({
  providedIn: 'root'
})
export class LoadClientService {

  baseUrl !: string;

  constructor(private http: HttpClient,  private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}/client`;
  }


  getClientByDni(dni: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/dni/${dni}`)
  }



}



