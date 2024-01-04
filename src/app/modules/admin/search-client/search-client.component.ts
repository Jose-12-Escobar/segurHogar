import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client-model';
import { Policy } from '../models/policy-model';
import { Risk } from '../models/risk-model';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.css']
})
export class SearchClientComponent implements OnInit {

  formGroupSearch !: FormGroup;
  formGroupClient !: FormGroup;
  formGroupRisk !: FormGroup;
  client !: Client;
  policies !: Policy[];
  showTable : boolean = false;

  constructor(public _show: SidebarService,
              private _fb: FormBuilder,
              private _messageService: MessageService,
              private _clientService: ClientService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.initFormSearch();
    this.initFormClient();
    this.initFormRisk()
    this.formGroupClient.disable();
    this.formGroupRisk.disable();
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      id_documento: [null, [ValidatorDocuemntId.validDucumentId, Validators.minLength(9), Validators.maxLength(9)]],
      telefono: [null, [Validators.minLength(9), Validators.maxLength(20)]],
      mail: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
    });
  }

  initFormClient() {
    this.formGroupClient = this._fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidoUno: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidoDos: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      mail: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      telefono: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(20)]],
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

  initFormRisk() {
    this.formGroupRisk = this._fb.group({
      tipoCalle: [null, [Validators.required]],
      noCalle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      piso: [null, [Validators.required]],
      puerta: [null, [Validators.required]],
      coPostal: [null, [Validators.required]],
      localidad: [null, [Validators.required]],
      provincia: [null, [Validators.required]],
    });
  }

  isValid(campo: string) {
    return this.formGroupSearch.controls[campo].touched && this.formGroupSearch.controls[campo].invalid
  }

  getMensaje(campo: string): string {
    const error = this.formGroupSearch.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
     return msg;
  }

  searchClient() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      if (this.formGroupSearch.value.id_documento) {
        this.searchByDocumentoID();
      }
      else if (this.formGroupSearch.value.telefono) {
        this.searchByPhone();
      }
      else if (this.formGroupSearch.value.mail) {
        this.searchByEmail();
      }
      else {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'Debe introducir algun valor para realizar la busqueda'});
      }
    }
  }

  searchByDocumentoID(){
    this._clientService.getClientByDni(this.formGroupSearch.value.id_documento).subscribe(
      (res) => {
        this.client = res;
        this.policies = res.polizas;
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el docuemnto de idnetidad'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese documento de identidad'});
      }
    )
  }

  searchByPhone(){
    this._clientService.getClientByPhone(this.formGroupSearch.value.telefono).subscribe(
      (res) => {
        this.client = res;
        this.policies = res.polizas;
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el número de teléfono'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese número de teléfono'});
      }
    )
  }

  searchByEmail(){
    this._clientService.getClientByEmail(this.formGroupSearch.value.mail).subscribe(
      (res) => {
        this.client = res;
        this.policies = res.polizas;
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el email'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese email'});
      }
    )
  }

 showClientInformation(client: Client) {

    this.formGroupRisk.reset();
    this.client.polizas.length > 0 ? this.showTable = true : this.showTable = false;

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

 showRisktInformation( risk: Risk) {

    this.formGroupRisk.controls['tipoCalle'].setValue(risk.tipoCalle);
    this.formGroupRisk.controls['noCalle'].setValue(risk.noCalle);
    this.formGroupRisk.controls['numero'].setValue(risk.numero);
    this.formGroupRisk.controls['piso'].setValue(risk.piso);
    this.formGroupRisk.controls['puerta'].setValue(risk.puerta);
    this.formGroupRisk.controls['coPostal'].setValue(risk.coPostal);
    this.formGroupRisk.controls['localidad'].setValue(risk.localidad);
    this.formGroupRisk.controls['provincia'].setValue(risk.provincia);

  }
}
