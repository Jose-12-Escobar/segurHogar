import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderService } from 'src/app/Services/header.service';
import { SidebarService } from 'src/app/Services/sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  scroll!: boolean;
  show:boolean = false;
  inAdmin : boolean = false;

  constructor( private _showHD: HeaderService, private _router: Router, public _showSB: SidebarService) {
    this._showHD.showHeader.subscribe( res => { this.scroll = res});
  }

  toggleCollapse(): void {
    this.show = !this.show
  }

  ngOnInit(): void {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const splitPath = this._router.url.split('/');
        if (splitPath[1] != "home") {
          this._showHD.changeShowHeader(true)
          if (splitPath[1] === "admin") {
            this.inAdmin = true;
          }else{
            this.inAdmin = false;
          }
        }else{
          this._showHD.changeShowHeader(false);
          this.inAdmin = false;
        }
      }
    });
  }

  hiddenSidebar() {
    this._showSB.changeShowSidebar(!this._showSB.showSidebar.value);
  }
}
