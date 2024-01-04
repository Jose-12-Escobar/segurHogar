import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { SinisterService } from '../services/sinister.service';
import { Sinister } from '../models/sinister-model';

@Component({
  selector: 'app-list-sinister',
  templateUrl: './list-sinister.component.html',
  styleUrls: ['./list-sinister.component.css']
})
export class ListSinisterComponent implements OnInit {

  sinisters !: Sinister[];

  constructor( public _show: SidebarService,
               private _sinisterService: SinisterService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.loadingSinisters()
  }

  loadingSinisters(){
    this._sinisterService.getAllSinisters().subscribe({
      next: (res: Sinister[]) => {
        this.sinisters = res;
      }
    })
  }

}
