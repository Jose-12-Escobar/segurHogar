import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Risk } from '../models/risk-model';
import { ApiService } from 'src/app/Services/api.service';



@Injectable({
  providedIn: 'root'
})
export class RiskService {

  baseUrl !: string;

  constructor(private http: HttpClient, private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}/risk`;
  }

  getAllRisk(): Observable<Risk[]> {
    return this.http.get<Risk[]>(`${this.baseUrl}`)
  }

  postNewRisk(risk: Risk): Observable<Risk> {
    return this.http.post<Risk>(this.baseUrl, risk)
  }

  getRiskById(id: string): Observable<Risk> {
    return this.http.get<Risk>(`${this.baseUrl}/${id}`)
  }

  updateRisk(risk: Risk): Observable<Risk> {
    return this.http.put<Risk>(this.baseUrl, risk)
  }

}



