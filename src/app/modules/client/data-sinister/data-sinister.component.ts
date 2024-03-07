import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { LocalStorageService } from '../../admin/services/local-storage.service';
import { LoadClientService } from '../Services/loadCliente.service';
import { Policy } from '../../admin/models/policy-model';
import { Client } from '../../admin/models/client-model';
import { IdEstado, Sinister } from '../../admin/models/sinister-model';

@Component({
  selector: 'app-data-sinister',
  templateUrl: './data-sinister.component.html',
  styleUrls: ['./data-sinister.component.css']
})
export class DataSinisterComponent implements OnInit {

  policies !: Policy[];
  showTable : boolean = false;
  dni !: string;
  sinistersByClient : Sinister[] = [];

  state: IdEstado[] = [
    { "idEstado": 1, "descripcion": 'Tramitado' },
    { "idEstado": 2, "descripcion": 'En proceso' },
    { "idEstado": 3, "descripcion": 'Finalizado' }
  ];

  constructor(private _fb: FormBuilder,
    public _show: SidebarService,
    private _localStorage: LocalStorageService,
    private _loadClient: LoadClientService) {
      this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.dni = this._localStorage.getItem('dni');
    if (this.dni) {
      this._loadClient.getClientByDni(this.dni).subscribe({
        next: (res: Client) => {
          this.policies = res.polizas;
          this.policies.forEach( policy => {
            policy.riesgos[0].siniestros?.forEach( sinister => {
              sinister.numPoliza = policy.nuPoliza;
              this.sinistersByClient.push(sinister)
            })
          })
          this.sinistersByClient.length > 0 ? this.showTable = true : this.showTable = false;
        },
        error: () => {
          this.showTable = false
        }
      })
    }
  }

}
