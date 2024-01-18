import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Client } from '../models/client-model';
import { LocalStorageService } from '../services/local-storage.service';
import { ClientService } from '../services/client.service';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Policy } from '../models/policy-model';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit {

  subscription !: Subscription;
  clients !: Client[];
  policyVigor : Policy[] = [];

  constructor(public _show: SidebarService,
    private _localStorageService: LocalStorageService,
    private _clientService: ClientService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.loadingClient();
  }

  loadingClient() {
    this._clientService.getAllClients().subscribe({
      next: (res: Client[]) => {
        this.clients = res;
      }
    })
  }

  editClient(idClienteModificar: string) {
    this._localStorageService.setItem('idCliente', idClienteModificar);
  }

  deleteClient(client: Client) {

    if (client.polizas.length > 0) {
      this.policyVigor = client.polizas.filter((policy) =>
        policy.idSituacionPoliza?.idEstado === 1)
    }

    if (this.policyVigor.length === 0) {
      this._clientService.deleteClientById(client.idCliente).subscribe(
        () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Cliente eliminado con exito' });
          this.loadingClient();
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el cliente' });
        }
      )
    }else if (this.policyVigor.length > 0) {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar un cliente con una poliza en vigor' });
    }
  }

  confirmDelete(event: Event, client : Client) {

        this._confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Está seguro que desea eliminar el cliente?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this.deleteClient(client);
        },
      });
  }

}

