import { Component,  } from '@angular/core';
import { HeaderService } from 'src/app/Services/header.service';
import { SidebarService } from 'src/app/Services/sidebar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {



  constructor( public _showSB: SidebarService, public _showHD: HeaderService){
    _showSB.changeShowSidebar(false)
  }

  scrollYes(): void {

    if( window.scrollY === 0){
      this._showHD.changeShowHeader(false)
    }else{
      this._showHD.changeShowHeader(true)
    }
  }

}
