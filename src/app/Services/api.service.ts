// api.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://localhost:8070';
  //private baseUrl: string = 'http://192.168.1.39:8070';

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
