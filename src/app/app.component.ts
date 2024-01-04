import { Component, OnInit, Renderer2 } from '@angular/core';
import { SidebarService } from './Services/sidebar.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'SegurHogar';
  public show !: boolean;
  inAdmin : boolean = false;

   constructor( public _show: SidebarService, private _router: Router, private renderer : Renderer2  ){

    this._show.showSidebar.subscribe(res => { this.show = res});
   }

  ngOnInit(): void {

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const splitPath = this._router.url.split('/');

        if(splitPath[1] === "admin"){
          this.inAdmin = true;
          this.renderer.addClass(document.body, 'bgBody');
        }else{
          this.inAdmin = false;
          this.renderer.removeClass(document.body, 'bgBody');
        }
      }
    })

  }

}
