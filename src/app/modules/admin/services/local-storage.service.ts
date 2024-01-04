import { Injectable } from '@angular/core';
import { Client } from '../models/client-model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  index !: string;
  client !: Client[];

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.index = key;
  }

  getItem(key: string): any {

    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  getItemId(key: string): Client[] | any {

    let value = localStorage.getItem('clientes')
    if (value) {
      const clientes : Client[] = JSON.parse(value)
      this.client = clientes.filter((cliente) =>  cliente.documento === key )
      if (this.client[0]) {
        return this.client;
      }else{
        return null;
      }
    }
  }
}
