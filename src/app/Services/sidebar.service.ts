import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public showSidebar : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public changeShowSidebar(show : boolean) {
    this.showSidebar.next(show);
  }

  constructor() { }
}
