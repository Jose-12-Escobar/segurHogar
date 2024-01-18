import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { SinisterService } from '../services/sinister.service';
import { Sinister } from '../models/sinister-model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-list-sinister',
  templateUrl: './list-sinister.component.html',
  styleUrls: ['./list-sinister.component.css']
})
export class ListSinisterComponent implements OnInit {

  sinisters !: Sinister[];

  constructor( public _show: SidebarService,
               private _sinisterService: SinisterService,
               private _messageService: MessageService,
               private _localStorageService: LocalStorageService,
               private _confirmationService: ConfirmationService) {
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

  editPolicy( idSinister: string ) {
    this._localStorageService.setItem('idSinister', idSinister);
  }

  deleteSinister( sinister: Sinister ) {

    if(sinister.idEstado?.idEstado === 3) {
      this._sinisterService.deleteSinisterById(sinister.idSiniestro).subscribe({
        next: () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Siniestro eliminado con exito' });
          this.loadingSinisters();
        },
        error: () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el siniestro' });
        }
      })
    }else {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar un siniestro que no está en estado finalizado' });

    }

  }

  confirmDelete(event: Event, sinister: Sinister) {

    this._confirmationService.confirm({
    target: event.target as EventTarget,
    message: '¿Está seguro que desea eliminar el siniestro?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: "none",
    rejectIcon: "none",
    rejectButtonStyleClass: "p-button-text",
    accept: () => {
      this.deleteSinister(sinister);
    },
  });
}


}
