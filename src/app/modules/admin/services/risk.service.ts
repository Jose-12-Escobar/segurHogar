import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Risk } from '../models/risk-model';



@Injectable({
  providedIn: 'root'
})
export class RiskService {

  baseUrl !: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8070/risk';
    //this.baseUrl = 'http://192.168.1.39:8070/risk';
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



