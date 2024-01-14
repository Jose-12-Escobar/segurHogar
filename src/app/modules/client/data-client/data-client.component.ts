import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Client } from '../../admin/models/client-model';
import { LoadClientService } from '../Services/loadCliente.service';
import { Policy } from '../../admin/models/policy-model';
import { Risk } from '../../admin/models/risk-model';
import { LocalStorageService } from '../../admin/services/local-storage.service';

@Component({
  selector: 'app-data-client',
  templateUrl: './data-client.component.html',
  styleUrls: ['./data-client.component.css']
})
export class DataClientComponent implements OnInit {

  formGroupClient !: FormGroup;
  show : boolean = false;
  dni !: string;
  client !: Client;

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _loadClient: LoadClientService,
    private _localStorage: LocalStorageService) {
    this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.dni = this._localStorage.getItem('dni');
    if (this.dni) {
      this.initFormClient();
      this.formGroupClient.disable();
      this._loadClient.getClientByDni(this.dni).subscribe({
        next: (res: Client) => {
          this.client = res;
          this.showClientInformation(this.client);
          this.show = true;
          //this.policies = res.polizas;
        },
        error: () => {
          this.show = false;
        }
      })
    }

  }

  initFormClient() {
    this.formGroupClient = this._fb.group({
      id_documento: [null, [Validators.required]],
      telefono: [null, [Validators.required]],
      mail: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      apellidoUno: [null, [Validators.required]],
      apellidoDos: [null, [Validators.required]],
      piso: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      codigoPostal: [null, [Validators.required]],
      localidad: [null, [Validators.required]],
      calle: [null, [Validators.required]],
      provincia: [null, [Validators.required]],
      puerta: [null, [Validators.required]],
      tipoCalle: [null, [Validators.required]],
    });
  }


  showClientInformation(client: Client) {

    this.formGroupClient.controls['id_documento'].setValue(client.documento);
    this.formGroupClient.controls['nombre'].setValue(client.nombre);
    this.formGroupClient.controls['apellidoUno'].setValue(client.primerApellido);
    this.formGroupClient.controls['apellidoDos'].setValue(client.segundoApellido);
    this.formGroupClient.controls['mail'].setValue(client.mail);
    this.formGroupClient.controls['telefono'].setValue(client.telefono);
    this.formGroupClient.controls['piso'].setValue(client.piso);
    this.formGroupClient.controls['numero'].setValue(client.numero);
    this.formGroupClient.controls['codigoPostal'].setValue(client.codPostal);
    this.formGroupClient.controls['localidad'].setValue(client.localidad);
    this.formGroupClient.controls['calle'].setValue(client.calle);
    this.formGroupClient.controls['tipoCalle'].setValue(client.tipoCalle);
    this.formGroupClient.controls['puerta'].setValue(client.puerta);
    this.formGroupClient.controls['provincia'].setValue(client.provincia);

  }


}
