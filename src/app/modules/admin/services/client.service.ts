import { Injectable } from '@angular/core';
import { Client } from '../models/client-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/Services/api.service';



@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl !: string;

  constructor(private http: HttpClient,  private _baseUrl: ApiService) {
    this.baseUrl = `${this._baseUrl.getBaseUrl()}/client`;
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl)
  }

  getClientByDni(dni: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/dni/${dni}`)
  }

  getClientByEmail(mail: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/mail/${mail}`)
  }

  getClientByPhone(telefono: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}telefono/${telefono}`)
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



