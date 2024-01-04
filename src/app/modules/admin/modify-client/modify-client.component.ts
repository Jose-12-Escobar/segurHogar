import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Client } from '../models/client-model';
import { LocalStorageService } from '../services/local-storage.service';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { ValidatorDate } from '../validator/validatorDate';

@Component({
  selector: 'app-modify-client',
  templateUrl: './modify-client.component.html',
  styleUrls: ['./modify-client.component.css']
})
export class ModifyClientComponent implements OnInit {

  formGroupSearch !: FormGroup;
  formGroupClient !: FormGroup;
  codCliente !: string;
  client !: Client;
  clientUpdate !: Client;




  constructor(
    public _show: SidebarService,
    private fb: FormBuilder,
    private _localStorageService: LocalStorageService,
    private _clientService: ClientService,
    private _messageService: MessageService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {

    this.codCliente = this._localStorageService.getItem('idCliente');
    this.initFormSearch();
    this.initFormClient();
    this.formGroupClient.disable()
    if (this.codCliente) {
      this._clientService.getClientById(this.codCliente).subscribe({
        next: (res: Client) => {
          this.client = res;
          this.formGroupClient.enable();
          this.formGroupSearch.disable();
          this.showClientInformation(res)
          localStorage.removeItem('idCliente');
        }
      })
    } else {
      this.formGroupSearch.enable();
    }
  }

  initFormSearch() {
    this.formGroupSearch = this.fb.group({
      id_documento: [null, [ValidatorDocuemntId.validDucumentId, Validators.minLength(9), Validators.maxLength(9)]],
      telefono: [null, [Validators.minLength(9), Validators.maxLength(20)]],
      mail: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
    });
  }

  initFormClient() {
    this.formGroupClient = this.fb.group({
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

  isValid(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid
  }


  getMensaje(campo: string, formGroup: FormGroup): string {
    const error = formGroup.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
    else if (error?.['minlength']) {
      msg = {
        id_documento: "No cumple el mínimo de caracteres válido",
        nombre: "El mínimo de caracteres válido es 3",
        apellidoUno: "El mínimo de caracteres válido es 3",
        apellidoDos: "El mínimo de caracteres válido es 3",
        telefono: "El mínimo de caracteres válido es 9"
      }[campo] || '';
    }
    else if (error?.['maxlength']) {
      msg = 'Exede el maximo de caracteres';
    }
    else if (error?.['pattern']) {
      msg = 'No cumple el patron estandar';
    }
    else if (error?.['dniInvalid']) {
      msg = 'El DNI no es valido.'
    }
    else if (error?.['documentInvalid']) {
      msg = 'Documento de identificacion invalido'
    }
    else if (error?.['nieInvalid']) {
      msg = 'El NIE no es valido'
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

  showClientInformation(client: Client) {
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

  modifyClient() {
    if (this.formGroupClient.invalid) {
      this.formGroupClient.markAllAsTouched();
    }
    this.clientUpdate = {
      "idCliente": this.client.idCliente,
      "nombre": this.formGroupClient.get('nombre')?.value,
      "primerApellido": this.formGroupClient.get('apellidoUno')?.value,
      "segundoApellido": this.formGroupClient.get('apellidoDos')?.value,
      "documento": this.client.documento,
      "fechaNacimiento": this.client.fechaNacimiento,
      "mail": this.formGroupClient.get('mail')?.value,
      "telefono": this.formGroupClient.get('telefono')?.value,
      "calle": this.formGroupClient.get('calle')?.value,
      "numero": this.formGroupClient.get('numero')?.value,
      "piso": this.formGroupClient.get('piso')?.value,
      "codPostal": this.formGroupClient.get('codigoPostal')?.value,
      "localidad": this.formGroupClient.get('localidad')?.value,
      "tipoCalle": this.formGroupClient.get('tipoCalle')?.value,
      "puerta": this.formGroupClient.get('puerta')?.value,
      "provincia": this.formGroupClient.get('provincia')?.value,
      "polizas": this.client.polizas
    }
    this._clientService.updateClient(this.clientUpdate).subscribe(
      () => {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Cliente modificado exitosamente' });
        this.formGroupClient.reset();
      },
      () => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar el cliente' });
      }
    )

  }

  clearForm() {
    this.formGroupClient.reset();
    this.formGroupClient.disable();
    this._localStorageService.setItem('idCliente', null)
    this.formGroupSearch.enable();
  }

  existEmail(campo: string) {
    if (this.formGroupClient.controls[campo].dirty && this.formGroupClient.controls[campo].valid) {
      this._clientService.getClientByEmail(this.formGroupClient.get(campo)?.value).subscribe(
        () => {
          this.formGroupClient.get(campo)?.setErrors({ 'emailInvalido': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El correo electrónico nuveo no puede ser igual al anterior' });
        }
      )
    }
  }

  existPhoneNumber(campo: string) {
    if (this.formGroupClient.controls[campo].dirty && this.formGroupClient.controls[campo].valid) {
      this._clientService.getClientByPhone(this.formGroupClient.get(campo)?.value).subscribe(
        () => {
          this.formGroupClient.get(campo)?.setErrors({ 'phoneInvalido': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El número de teléfono nuveo no puede ser igual al anterior' });
        }
      )
    }
  }

  searchByDocumentoID(){
    this._clientService.getClientByDni(this.formGroupSearch.value.id_documento).subscribe(
      (res) => {
        this.client = res;
        this.formGroupClient.enable();
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el docuemnto de idnetidad'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese documento de identidad'});
        this.formGroupClient.disable();
      }
    )
  }

  searchByPhone(){
    this._clientService.getClientByPhone(this.formGroupSearch.value.telefono).subscribe(
      (res) => {
        this.client = res;
        this.formGroupClient.enable();
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el número de teléfono'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese número de teléfono'});
        this.formGroupClient.disable();
      }
    )
  }

  searchByEmail(){
    this._clientService.getClientByEmail(this.formGroupSearch.value.mail).subscribe(
      (res) => {
        this.client = res;
        this.formGroupClient.enable();
        this._messageService.add({severity: 'success', summary: 'Success', detail: 'Cliente encontrado por el email'});
        this.showClientInformation(this.client)
      }, () => {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'No hay nigun cliente asociado a ese email'});
        this.formGroupClient.disable();
      }
    )
  }
}
