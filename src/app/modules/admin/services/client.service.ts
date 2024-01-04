import { Injectable } from '@angular/core';
import { Client } from '../models/client-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl !: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8070/client'
    //this.baseUrl = 'http://192.168.1.39:8070/client'
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}`)
  }

  getClientByDni(dni: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/dni/${dni}`)
  }

  getClientByEmail(mail: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/mail/${mail}`)
  }

  getClientByPhone(telefono: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/telefono/${telefono}`)
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`)
  }

  postNewClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client)
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(this.baseUrl, client)
  }

  deleteClientById(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.baseUrl}/${id}`)
  }

}



