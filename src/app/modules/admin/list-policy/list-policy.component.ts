import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { PolicyService } from '../services/policy.service';
import { Policy } from '../models/policy-model';
import { LocalStorageService } from '../services/local-storage.service';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-policy',
  templateUrl: './list-policy.component.html',
  styleUrls: ['./list-policy.component.css']
})
export class ListPolicyComponent implements OnInit {

  policies !: Policy[];

  constructor( public _show: SidebarService,
               private _policyService: PolicyService,
               private _messageService: MessageService,
               private _localStorageService: LocalStorageService
               ){
    _show.changeShowSidebar(true)
  }

  ngOnInit(): void {
    this.loadingPolicy();
  }

  loadingPolicy(){
    this._policyService.getAllPolicies().subscribe({
      next: (res: Policy[]) => {
        this.policies = res;
      }
    })
  }

  editPolicy( idPolicy: string ) {
    this._localStorageService.setItem('idPolicy', idPolicy);
  }

  deletePolicy( policy: Policy ) {

    if(policy.idSituacionPoliza?.idEstado === 1) {
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar una poliza en vigor' });
    }else {
      this._policyService.deletePolicyById(policy.idPoliza).subscribe({
        next: () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Poliza eliminado con exito' });
          this.loadingPolicy();
        },
        error: () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la poliza' });
        }
      })
    }

  }

}
