import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { LocalStorageService } from 'src/app/modules/admin/services/local-storage.service';
import { SessionStorageService } from 'src/app/modules/auth/services/session-storage.service';


@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.css']
})
export class TarifaComponent {

 constructor(public _showSB: SidebarService,
            private _sessionStorage: SessionStorageService,
            private _localStorage: LocalStorageService,
            private _router: Router,) {
  _showSB.changeShowSidebar(false)
 }

 clickContratalo(){
  if (this._sessionStorage.getItem('token')) {

    if (this._localStorage.getItem('role') === 'ROLE_ADMIN')
      this._router.navigate(['/admin/newPolicy']);

    if (this._localStorage.getItem('role') === 'ROLE_USER')
      this._router.navigate(['/client/homeMenu']);

  } else {
    this._router.navigate(['/auth/login']);
  }
 }
}
