import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ValidatorDate } from '../validator/validatorDate';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client-model';
import { Policy } from '../models/policy-model';
import { IdEstado, Sinister } from '../models/sinister-model';
import { SinisterService } from '../services/sinister.service';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-new-sinister',
  templateUrl: './new-sinister.component.html',
  styleUrls: ['./new-sinister.component.css']
})
export class NewSinisterComponent implements OnInit {

  selectedCategory !: any;
  formGroupNewSinister !: FormGroup;
  formGroupSearch !: FormGroup;
  policies : Policy[] = [];
  showTable: boolean = false;
  sinister !: Sinister;
  idRisk !: number;

  state: IdEstado[] = [
    { "idEstado": 1, "descripcion": 'Tramitado' },
    { "idEstado": 2, "descripcion": 'En proceso' },
    { "idEstado": 3, "descripcion": 'Finalizado' }
  ];

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _clientService: ClientService,
    private _sinisterService: SinisterService,
    private _policyService: PolicyService) {
    this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.initFormSinister();
    this.initFormSearch();
    this.formGroupNewSinister.disable();
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      documentoId: [null, [ValidatorDocuemntId.validDucumentId, Validators.maxLength(9)]],
      nuPoliza: [null],
    });
  }
  initFormSinister() {
    this.formGroupNewSinister = this._fb.group({
      ref_sinister: [null, [Validators.required, Validators.pattern(/^[sS][iI][tT]\d{2}$/)]],
      fe_dano: [null, [Validators.required, ValidatorDate.DateTopCurrent]],
      state: [null, [Validators.required]],
      descripcion: [null, [Validators.maxLength(255)]],
      //fe_inicio_rep: [null, [Validators.required, this.dateStartOlderDamage.bind(this)]],
      //coste: [null, [Validators.required]],
      //peritado: [null, [Validators.required]],
    });
  }
  searchRisk() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      this.idRisk = 0;
      if (this.formGroupSearch.value.documentoId) {
        this.searchSinisterByDni();
      }
      else if (this.formGroupSearch.value.nuPoliza) {
        this.searchSinisterByNumPolicy();
      }
      else {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe introducir algun valor para realizar la busqueda' });
      }
    }
  }

  searchSinisterByDni() {
    this._clientService.getClientByDni(this.formGroupSearch.get('documentoId')?.value).subscribe(
      (res) => {
        this.getPolicy(res);
      },
      () => {
        this.showTable = false;
        this.formGroupSearch.get('documentoId')?.setErrors({ 'documentoInvalido': true })
        this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No existe una cuenta asociada a este documento de identificación' });
      }
    )
  }

  getPolicy(client: Client) {
    if (client.polizas?.length !== 0) {
      this.policies = client.polizas;
      this.showTable = true;
    } else {
      this.showTable = false;
      this.formGroupNewSinister.reset();
      this.formGroupNewSinister.disable();
      this._messageService.add({ severity: 'info', summary: 'Info', detail: `No se encuentran polizas pra el cliente ${client.documento}` });
    }
  }

  searchSinisterByNumPolicy() {
    this._policyService.getPolicyByNum(this.formGroupSearch.get('nuPoliza')?.value).subscribe(
      (res) => {
        this.policies[0] = res;
        this.showTable = true;
      },
      () => {
        this.showTable = false;
        this.formGroupNewSinister.reset();
        this.formGroupNewSinister.disable();
        this.formGroupSearch.get('nuPoliza')?.setErrors({ 'numPolicyInvalid': true })
        this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No existe niguna poliza con este número' });
      }
    )
  }

  noEsValido(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid;
  }

  getMensaje(campo: string, formGroup: FormGroup): string {
    const error = formGroup.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
    else if (error?.['fechaSuperiorActual']) {
      msg = 'La fecha del daño no puede ser superior a la fecha actual.'
    }
    else if (error?.['dateStartOlderDamage']) {
      msg = 'La fecha de inicio de reparacion no puede ser antes que la fecha del daño.'
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
    else if (error?.['pattern']) {
      msg = 'El codigo de referencia debe estar compuesto por las tres letras "SIT" y dos números'
    }
    else if (error?.['maxlength']) {
      msg = {
        descripcion: "El máximo de caracteres es 255"
      }[campo] || '';
    }

    return msg;
  }

  sevaIdRisk(idRisk: number) {
    this.idRisk = idRisk;
    this.formGroupNewSinister.enable();
  }

  clearForm() {
    this.formGroupNewSinister.reset();
  }

  dateStartOlderDamage(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaDano = this.formGroupNewSinister?.get('fe_dano')?.value;
    const fechaInicio = control.value;

    if (fechaInicio && fechaDano) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaDanoDate = new Date(fechaDano);

      if (fechaDanoDate > fechaInicioDate) {
        return { 'dateStartOlderDamage': true };
      }
    }

    return null;
  }

  existRefSinister(campo: string) {
    if (this.formGroupNewSinister.controls[campo].dirty && this.formGroupNewSinister.controls[campo].valid) {
      this._sinisterService.getSinisterByRef(this.formGroupNewSinister.get(campo)?.value).subscribe(
        () => {
          this.formGroupNewSinister.get(campo)?.setErrors({ 'refSinisterInvslid': true })
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ya existe un siniestro con esa referencia' });
        }
      )
    }
  }

  guardarDatos() {
    if (this.formGroupNewSinister.invalid) {
      this.formGroupNewSinister.markAllAsTouched();
    } else {
      this.sinister = {
        "idSiniestro": 0,
        "idRiesgo": this.idRisk,
        "feSiniestro": this.formGroupNewSinister.get('fe_dano')?.value,
        "importeSiniestro": null ,
        "feInicioReparacion": null,
        "feFinReparacion": null,
        "peritado": false,
        "idEstado": { "idEstado": this.formGroupNewSinister.get('state')?.value.idEstado },
        "description": this.formGroupNewSinister.get('descripcion')?.value,
        "refSiniestro": this.formGroupNewSinister.get('ref_sinister')?.value
      }
console.log(this.sinister)
      this._sinisterService.postNewSinister(this.sinister).subscribe({
        next: () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Siniestro creado con exito' });
          this.formGroupNewSinister.reset();
        },
        error: () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el siniestro' });

        }
      }
      )
    }
  }

}


