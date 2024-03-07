import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Client } from '../models/client-model';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { ValidatorDate } from '../validator/validatorDate';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  formGroupNewClient !: FormGroup;
  tiposDocumentos !: { name: string }[];
  tiposVias !: { name: string }[];
  documentLabel: string = "Seleccione tipo de documento";
  cliente !: Client;

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _clientService: ClientService,
    private _messageService: MessageService) {
    _show.changeShowSidebar(true);
  }


  ngOnInit(): void {
    this.initFormNewClient();
    this.formGroupNewClient.get('documento')?.disable();
    this.tiposDocumentos = [
      { name: 'DNI' },
      { name: 'NIE' }
    ];
    this.tiposVias = [
      { name: 'Calle' },
      { name: 'Avenida' },
      { name: 'Carretera' },
      { name: 'Otros' }
    ]
  }


  initFormNewClient() {
    this.formGroupNewClient = this._fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidoUno: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellidoDos: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      fe_nacimiento: [null, [Validators.required, ValidatorDate.DateTopCurrent, ValidatorDate.DateTopAge]],
      tipo_documento: [null, [Validators.required]],
      documento: [null, [Validators.required, ValidatorDocuemntId.validDucumentId, Validators.maxLength(9)]],
      mail: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      telefono: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
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

  noEsValido(campo: string) {
    return this.formGroupNewClient.controls[campo].touched && this.formGroupNewClient.controls[campo].invalid;
  }

  getMensaje(campo: string): string {
    const error = this.formGroupNewClient.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
    else if (error?.['minlength']) {
      msg = {
        nombre: "El mínimo de caracteres válido es 3",
        direccion: "El mínimo de caracteres válido es 3",
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
    else if(error?.['dniInvalid']) {
      msg = 'El DNI no es valido.'
    }
    else if(error?.['documentInvalid']) {
      msg = 'Documento de identificacion invalido'
    }
    else if(error?.['nieInvalid']) {
      msg = 'El NIE no es valido'
    }
    else if(error?.['fechaSuperiorActual']){
      msg = 'La fecha de nacimiento no puede ser superior a la fecha actual.'
    }
    else if(error?.['menoriaEdad']){
          msg = 'Debe ser mayor de edad.'
        }
    return msg;
  }

  updateLabelDocument(): void {
    this.formGroupNewClient.get('documento')?.enable();
    this.documentLabel = this.formGroupNewClient.get('tipo_documento')?.value?.name;
    this.formGroupNewClient.get('documento')?.reset();
  }

  guardarDatos() {
    if (this.formGroupNewClient.invalid) {
      this.formGroupNewClient.markAllAsTouched();
    } else {

      this.cliente = {
        "idCliente": 0,
        "nombre": this.formGroupNewClient.get('nombre')?.value,
        "primerApellido": this.formGroupNewClient.get('apellidoUno')?.value,
        "segundoApellido": this.formGroupNewClient.get('apellidoDos')?.value,
        "documento": this.formGroupNewClient.get('documento')?.value,
        "fechaNacimiento": this.formGroupNewClient.get('fe_nacimiento')?.value,
        "mail": this.formGroupNewClient.get('mail')?.value,
        "telefono": this.formGroupNewClient.get('telefono')?.value,
        "calle":this.formGroupNewClient.get('calle')?.value,
        "numero":this.formGroupNewClient.get('numero')?.value,
        "piso": this.formGroupNewClient.get('piso')?.value,
        "codPostal": this.formGroupNewClient.get('codigoPostal')?.value,
        "localidad": this.formGroupNewClient.get('localidad')?.value,
        "tipoCalle": this.formGroupNewClient.get('tipoCalle')?.value,
        "puerta": this.formGroupNewClient.get('puerta')?.value,
        "provincia": this.formGroupNewClient.get('provincia')?.value,
        "polizas": []
      }
      this._clientService.postNewClient(this.cliente).subscribe(
        () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Cliente creado con exito' });
          this.formGroupNewClient.reset();
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear cliente' });
        }
      )
    }

  }


  clearForm() {
    this.formGroupNewClient.reset();

  }

  existDni(campo: string) {
    if (this.formGroupNewClient.controls[campo].dirty && this.formGroupNewClient.controls[campo].valid) {
      this._clientService.getClientByDni(this.formGroupNewClient.get(campo)?.value).subscribe(
        () => {
          this.formGroupNewClient.get(campo)?.setErrors({ 'documentoInvalido': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ya existe una cuenta asociada a este documento de identificación' });
        }
      )
    }
  }

  existEmail(campo: string) {
    if (this.formGroupNewClient.controls[campo].dirty && this.formGroupNewClient.controls[campo].valid) {
    this._clientService.getClientByEmail(this.formGroupNewClient.get(campo)?.value).subscribe(
      () => {
        this.formGroupNewClient.get(campo)?.setErrors({ 'emailInvalido': true })
        this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ya existe una cuenta asociada a esta dirección de correo' });
      }
    )
    }
  }

  existPhoneNumber(campo: string) {
    if (this.formGroupNewClient.controls[campo].dirty && this.formGroupNewClient.controls[campo].valid) {
    this._clientService.getClientByPhone(this.formGroupNewClient.get(campo)?.value).subscribe(
      () => {
        this.formGroupNewClient.get(campo)?.setErrors({ 'phoneInvalido': true })
        this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ya existe una cuenta asociada a este número de teléfono' });
      }
    )
  }
}

}

