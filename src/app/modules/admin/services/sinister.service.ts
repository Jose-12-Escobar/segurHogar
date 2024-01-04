import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sinister } from '../models/sinister-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinisterService {

  baseUrl !: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8070/sinisters';
    //this.baseUrl = 'http://192.168.1.39:8070/sinisters';
  }

  getAllSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(`${this.baseUrl}`)
  }

}
