import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Policy } from '../models/policy-model';
import { ApiService } from 'src/app/Services/api.service';



@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  baseUrl !: string;

  constructor(private http: HttpClient, private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}/policies`;
  }

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.baseUrl)
  }

  getPoliciesById(id: string): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/${id}`)
  }

  getPolicyByNum(numPoliza: string): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/num-poliza/${numPoliza}`)
  }

  postNewPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.baseUrl, policy)
  }

  updatePolicy(policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(this.baseUrl, policy)
  }

  deletePolicyById(id: number): Observable<Policy> {
    return this.http.delete<Policy>(`${this.baseUrl}/${id}`)
  }


}



