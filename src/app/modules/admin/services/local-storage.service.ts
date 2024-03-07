import { Injectable } from '@angular/core';
import { Client } from '../models/client-model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  index !: string;

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

}
