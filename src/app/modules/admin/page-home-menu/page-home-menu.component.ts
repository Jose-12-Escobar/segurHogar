import { Component } from '@angular/core';
import { SidebarService } from 'src/app/Services/sidebar.service';

@Component({
  selector: 'app-page-home-menu',
  templateUrl: './page-home-menu.component.html',
  styleUrls: ['./page-home-menu.component.css']
})
export class PageHomeMenuComponentAdmin {

  constructor(public _show: SidebarService) {
      this._show.changeShowSidebar(true)
  }
}
