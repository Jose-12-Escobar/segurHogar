import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { ValidatorDate } from '../validator/validatorDate';
import { ValidatorCuentaBancaria } from '../validator/validatorCuentaBancaria';
import { PolicyService } from '../services/policy.service';
import { ClientService } from '../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Policy } from '../models/policy-model';
import { Client } from '../models/client-model';
import { Risk } from '../models/risk-model';
import { RiskService } from '../services/risk.service';

@Component({
  selector: 'app-new-policy',
  templateUrl: './new-policy.component.html',
  styleUrls: ['./new-policy.component.css']
})
export class NewPolicyComponent implements OnInit {

  formGroupNewPolicy !: FormGroup;
  formGroupSearch !: FormGroup;
  policy !: Policy;
  client !: Client;
  risk !: Risk;
  autoComplete : boolean = true;
  state: { state: string, key: number }[] = [
    { state: 'Vigente', key: 1 },
    { state: 'Cancelada', key: 2 },
    { state: 'En impago', key: 3 }
  ];

  modalidad: { tipo: string, key: number }[] = [
    { tipo: 'Basica', key: 1 },
    { tipo: 'Intermedia', key: 2 },
    { tipo: 'Completa', key: 3 },
  ];

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _policyService: PolicyService,
    private _clientService: ClientService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.initFormNewPolicy();
    this.initFormSearch();
    this.formGroupNewPolicy.disable();
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      documentoId: [null, [Validators.required, ValidatorDocuemntId.validDucumentId, Validators.maxLength(9)]],
    })

  }
  initFormNewPolicy() {
    this.formGroupNewPolicy = this._fb.group({
      fe_inicioPoliza: [null, [Validators.required, ValidatorDate.DateLowerCurrent]],
      fe_finPoliza: [null, [Validators.required, this.dateEndOlderStart.bind(this)]],
      estado: [null, [Validators.required]],
      modalidad: [null, [Validators.required]],
      prima: [null, [Validators.required]],
      nuPoliza: [null, [Validators.required, Validators.pattern(/^[sS][hH]\d{2}$/)]],
      numeroCuenta: [null, [Validators.required, Validators.maxLength(24), ValidatorCuentaBancaria.validIban]],
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

  isValid(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid;
  }

  getMensaje(campo: string, formGroup: FormGroup): string {
    const error = formGroup.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
    else if (error?.['maxlength']) {
      msg = {
        documentoId: "El máximo de caracteres válido es 9",
        numeroCuenta: "El máximo de caracteres válido es 24",
      }[campo] || '';
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
    else if (error?.['fechaSuperiorActual']) {
      msg = 'La fecha de inicio no puede ser superior a la fecha actual.'
    }
    else if (error?.['fechaInferiorActual']) {
      msg = 'La fecha de inicio no puede ser inferior a la fecha actual.'
    }
    else if (error?.['dateEndYoungerStart']) {
      msg = 'La fecha de vencimiento no puede ser inferior a la fecha de inicio.'
    }
    else if (error?.['pattern']) {
      msg = 'El número de poliza debe estar compuesto por las dos letras "SH" y dos números Ej: SH04'
    }
    else if (error?.['ibanInvalido']) {
      msg = 'Número de cuenta invalido.'
    }
    else if (error?.['ibanInvalidoLength']) {
      msg = 'El número de cuenta debe tener 24 caracteres.'
    }
    else if (error?.['ibanInvalidoLetra']) {
      msg = 'El número de cuenta debe comenzar por la letra ES.'
    }
    return msg;
  }

  dateEndOlderStart(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaInicio = this.formGroupNewPolicy?.get('fe_inicioPoliza')?.value;
    const fechaFin = control.value;

    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (fechaInicioDate > fechaFinDate) {
        return { 'dateEndYoungerStart': true };
      }
    }

    return null;
  }

  existDni(campo: string) {
    if (this.formGroupSearch.controls[campo].dirty && this.formGroupSearch.controls[campo].valid) {
      this._clientService.getClientByDni(this.formGroupSearch.get(campo)?.value).subscribe(
        (res) => {
           this.client = res;
           this.formGroupNewPolicy.enable();
           this.formGroupNewPolicy.get('fe_finPoliza')?.disable();
           },
        () => {
          this.formGroupSearch.get(campo)?.setErrors({ 'documentoInvalido': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No existe una cuenta asociada a este documento de identificación' });
        }
      )
    }
  }

  guardarDatos() {
    if (this.formGroupNewPolicy.invalid) {
      this.formGroupNewPolicy.markAllAsTouched();
    } else {
      this.risk = {
        "idRiesgo": 0,
        "tipoCalle": this.formGroupNewPolicy.get('tipoCalle')?.value,
        "noCalle": this.formGroupNewPolicy.get('noCalle')?.value,
        "numero": this.formGroupNewPolicy.get('numero')?.value,
        "piso": this.formGroupNewPolicy.get('piso')?.value,
        "puerta": this.formGroupNewPolicy.get('puerta')?.value,
        "coPostal": this.formGroupNewPolicy.get('coPostal')?.value,
        "localidad": this.formGroupNewPolicy.get('localidad')?.value,
        "provincia": this.formGroupNewPolicy.get('provincia')?.value,
      }
      this.policy = {
        "idPoliza": 0,
        "idCliente": this.client.idCliente,
        "feInicio": this.formGroupNewPolicy.get('fe_inicioPoliza')?.value,
        "feVencimiento": this.formGroupNewPolicy.get('fe_finPoliza')?.value,
        "idSituacionPoliza": { "idEstado": this.formGroupNewPolicy.get('estado')?.value.key },
        "idModalidad": { "idModalidad": this.formGroupNewPolicy.get('modalidad')?.value.key },
        "prima": this.formGroupNewPolicy.get('prima')?.value,
        "nuCuenta": this.formGroupNewPolicy.get('numeroCuenta')?.value,
        "nuPoliza": this.formGroupNewPolicy.get('nuPoliza')?.value,
        "riesgos": [this.risk]
      }

      this._policyService.postNewPolicy(this.policy).subscribe(
        () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Poliza y riesgo creada con exito' });
          this.formGroupNewPolicy.reset();
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la poliza y el reisgo' });
        }
      )
    }

  }

  confirmAddress(event: Event) {
    if (this.autoComplete) {
      this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea utilizar la dirección de contacto como diección para el reisgo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.formGroupNewPolicy.controls['tipoCalle'].setValue(this.client.tipoCalle);
        this.formGroupNewPolicy.controls['noCalle'].setValue(this.client.calle);
        this.formGroupNewPolicy.controls['numero'].setValue(this.client.numero);
        this.formGroupNewPolicy.controls['piso'].setValue(this.client.piso);
        this.formGroupNewPolicy.controls['puerta'].setValue(this.client.puerta);
        this.formGroupNewPolicy.controls['coPostal'].setValue(this.client.codPostal);
        this.formGroupNewPolicy.controls['localidad'].setValue(this.client.localidad);
        this.formGroupNewPolicy.controls['provincia'].setValue(this.client.provincia);
        this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Se ha establecido la dirección de contacto como el riego' });
      },
    });
    this.autoComplete = false;
    }

  }

  existNumPolicy(campo: string) {
    if (this.formGroupNewPolicy.controls[campo].dirty && this.formGroupNewPolicy.controls[campo].valid) {
      this._policyService.getPolicyByNum(this.formGroupNewPolicy.get(campo)?.value).subscribe(
        () => {
          this.formGroupNewPolicy.get(campo)?.setErrors({ 'numPolicyInvalid': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ya existe una poliza con este número' });
        }
      )
    }
  }

  setDateFechaFin() {
    if (this.formGroupNewPolicy.controls['fe_inicioPoliza'].valid) {
      const fechaInicio = new Date(this.formGroupNewPolicy.get('fe_inicioPoliza')?.value)
      const fechaFin = new Date(fechaInicio.setFullYear(fechaInicio.getFullYear()+1))
     this.formGroupNewPolicy.controls['fe_finPoliza'].setValue(fechaFin)

    }
  }

  clearForm() {
    this.formGroupNewPolicy.reset();
  }

}
