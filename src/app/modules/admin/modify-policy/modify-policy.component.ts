import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { ValidatorDate } from '../validator/validatorDate';
import { ValidatorCuentaBancaria } from '../validator/validatorCuentaBancaria';
import { PolicyService } from '../services/policy.service';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Policy } from '../models/policy-model';
import { Client } from '../models/client-model';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-modify-policy',
  templateUrl: './modify-policy.component.html',
  styleUrls: ['./modify-policy.component.css']
})
export class ModifyPolicyComponent implements OnInit {

  formGroupModifyPolicy !: FormGroup;
  formGroupSearch !: FormGroup;
  policies !: Policy[];
  policy !: Policy;
  idClient !: number;
  idPolicyLocalStorage !: string | null;
  policyModify !: Policy;
  showTable: boolean = false;
  state !: { state: string, key: number }[];
  modalidad !: { tipo: string, key: number }[];
  numPolicy !: string;

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _policyService: PolicyService,
    private _clientService: ClientService,
    private _messageService: MessageService,
    private _localStorageService: LocalStorageService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.idPolicyLocalStorage = this._localStorageService.getItem('idPolicy');
    this.initFormSearch();
    this.initFormModifyPolicy();
    this.formGroupModifyPolicy.disable();
    if (this.idPolicyLocalStorage) {
      this._policyService.getPoliciesById(this.idPolicyLocalStorage).subscribe({
        next: (res: Policy) => {
          this.showPolicyInformation(res);
          this.formGroupModifyPolicy.enable();
          this.formGroupSearch.disable();
          localStorage.removeItem('idPolicy');
        }
      })
    }

    this.state = [
      { state: 'Vigente', key: 1 },
      { state: 'Cancelada', key: 2 },
      { state: 'En impago', key: 3 }
    ]

    this.modalidad = [
      { tipo: 'Basica', key: 1 },
      { tipo: 'Intermedia', key: 2 },
      { tipo: 'Completa', key: 3 },
    ]

  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      documentoId: [null, [ValidatorDocuemntId.validDucumentId, Validators.maxLength(9)]],
      nuPoliza: [null],
    });
  }

  initFormModifyPolicy() {
    this.formGroupModifyPolicy = this._fb.group({
      fe_inicioPoliza: [null, [Validators.required, ValidatorDate.DateLowerCurrent]],
      fe_finPoliza: [null, [Validators.required, this.dateEndOlderStart.bind(this)]],
      estado: [null, [Validators.required]],
      modalidad: [null, [Validators.required]],
      prima: [null, [Validators.required]],
      numeroCuenta: [null, [Validators.required, Validators.maxLength(24), ValidatorCuentaBancaria.validIban]],
    });
  }

  isValid(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid
  }

  showPolicyInformation(policy: Policy) {
    this.idClient = policy.idCliente;
    this.policyModify = policy;
    this.numPolicy = policy.nuPoliza

    this.formGroupModifyPolicy.controls['fe_inicioPoliza'].setValue(new Date(policy.feInicio));
    this.formGroupModifyPolicy.controls['fe_finPoliza'].setValue(new Date(policy.feVencimiento));
    this.formGroupModifyPolicy.controls['estado'].setValue({ key: policy.idSituacionPoliza?.idEstado, state: policy.idSituacionPoliza?.descripcion });
    this.formGroupModifyPolicy.controls['modalidad'].setValue({ key: policy.idModalidad?.idModalidad, tipo: policy.idModalidad?.descripcion });
    this.formGroupModifyPolicy.controls['prima'].setValue(policy.prima);
    this.formGroupModifyPolicy.controls['numeroCuenta'].setValue(policy.nuCuenta);

    this.formGroupModifyPolicy.enable();
    this.formGroupModifyPolicy.get('nuPoliza')?.disable();
    this.formGroupModifyPolicy.get('fe_finPoliza')?.disable();
  }

  guardarDatos() {
    if (this.formGroupModifyPolicy.invalid) {
      this.formGroupModifyPolicy.markAllAsTouched();
    } else {
      this.policy = {
        "idPoliza": this.policyModify.idPoliza,
        "feInicio": this.formGroupModifyPolicy.get('fe_inicioPoliza')?.value,
        "feVencimiento": this.formGroupModifyPolicy.get('fe_finPoliza')?.value,
        "idCliente": this.idClient,
        "prima": this.formGroupModifyPolicy.get('prima')?.value,
        "idSituacionPoliza": { "idEstado": this.formGroupModifyPolicy.get('estado')?.value.key },
        "nuCuenta": this.formGroupModifyPolicy.get('numeroCuenta')?.value,
        "idModalidad": { "idModalidad": this.formGroupModifyPolicy.get('modalidad')?.value.key },
        "nuPoliza": this.formGroupModifyPolicy.get('nuPoliza')?.value,
        "riesgos": this.policyModify.riesgos
      }
      this._policyService.updatePolicy(this.policy).subscribe(
        () => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Poliza modificada con exito' });
          this.formGroupModifyPolicy.reset();
          this.formGroupModifyPolicy.disable();
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar la poliza' });
        }
      )
    }
  }

  clearForm() {
    this.formGroupModifyPolicy.reset();
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
    else if (error?.['dateEndYoungerStart']) {
      msg = 'La fecha de vencimiento no puede ser inferior a la fecha de inicio.'
    }
    else if (error?.['ibanInvalido']) {
      msg = 'Número de cuenta invalido.'
    }
    else if (error?.['fechaInferiorActual']) {
      msg = 'La fecha de inicio no puede ser inferior a la fecha actual.'
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
    const fechaInicio = this.formGroupModifyPolicy?.get('fe_inicioPoliza')?.value;
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

  searchPolicy() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      if (this.formGroupSearch.value.documentoId) {
        this.searchPolicyByDni();
      }
      else if (this.formGroupSearch.value.nuPoliza) {
        this.searchPolicyByNum();
      }
      else {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'Debe introducir algun valor para realizar la busqueda'});
      }
    }
  }

  searchPolicyByDni() {
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

  searchPolicyByNum() {
    this._policyService.getPolicyByNum(this.formGroupSearch.get('nuPoliza')?.value).subscribe(
      (res) => {
        this.showPolicyInformation(res);
        this.showTable = false;
      },
      () => {
        this.showTable = false;
        this.formGroupSearch.get('nuPoliza')?.setErrors({ 'numPolicyInvalid': true })
        this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No existe niguna poliza con este número' });
      }
    )
  }

  getPolicy(client: Client) {
    if (client.polizas?.length !== 0) {
      this.policies = client.polizas;
      this.showTable = true;
    } else {
      this.showTable = false;
      this.formGroupModifyPolicy.reset();
      this.formGroupModifyPolicy.disable();
      this._messageService.add({ severity: 'info', summary: 'Info', detail: `No se encuentran polizas pra el cliente ${client.documento}` });
    }
  }

  setDateFechaFin() {
    this.formGroupModifyPolicy.get('fe_finPoliza')?.reset();
    if (this.formGroupModifyPolicy.controls['fe_inicioPoliza'].valid) {
      const fechaInicio = new Date(this.formGroupModifyPolicy.get('fe_inicioPoliza')?.value)
      const fechaFin = new Date(fechaInicio.setFullYear(fechaInicio.getFullYear()+1))
     this.formGroupModifyPolicy.controls['fe_finPoliza'].setValue(fechaFin)
    }
  }


}
