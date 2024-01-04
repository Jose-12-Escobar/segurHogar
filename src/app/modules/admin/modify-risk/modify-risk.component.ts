import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, isFormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Risk } from '../models/risk-model';
import { LocalStorageService } from '../services/local-storage.service';
import { RiskService } from '../services/risk.service';
import { PolicyService } from '../services/policy.service';
import { Policy } from '../models/policy-model';

@Component({
  selector: 'app-modify-risk',
  templateUrl: './modify-risk.component.html',
  styleUrls: ['./modify-risk.component.css']
})
export class ModifyRiskComponent implements OnInit {

  formGroupSearch !: FormGroup;
  formGroupModifyRisk !: FormGroup;
  idRiskLocalStorage !: string;
  risk !: Risk;
  riskModify !: Risk;
  policy !: Policy;

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _localStorageService: LocalStorageService,
    private _riskService: RiskService,
    private _policyService: PolicyService) {
    this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.idRiskLocalStorage = this._localStorageService.getItem('idRisk');
    this.initFormModifyRisk();
    this.initFormSearch();
    this.formGroupModifyRisk.disable();

    if (this.idRiskLocalStorage) {
      this._riskService.getRiskById(this.idRiskLocalStorage).subscribe({
        next: (res: Risk) => {
          this.showRiskInformation(res);
          this.formGroupModifyRisk.enable();
          this.formGroupSearch.disable();
          localStorage.removeItem('idRisk');
        }
      })
    }
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      numPoliza: [null, [Validators.required]],
    });
  }

  initFormModifyRisk() {
    this.formGroupModifyRisk = this._fb.group({
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

  searchRiskByNumPoliza() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      console.log('numero de poliza: ', this.formGroupSearch.get('numPoliza')?.value)
      this._policyService.getPolicyByNum(this.formGroupSearch.get('numPoliza')?.value).subscribe({
        next: (res: Policy) => {
          this.policy = res;
          this.showRiskInformation(res.riesgos[0])
        },
        error: () => {
          this._messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No existe una poliza con este número' });
          this.formGroupModifyRisk.disable();
        }
      })
    }
  }

  showRiskInformation(risk: Risk) {
    this.riskModify = risk;

    this.formGroupModifyRisk.controls['tipoCalle'].setValue(risk.tipoCalle);
    this.formGroupModifyRisk.controls['noCalle'].setValue(risk.noCalle);
    this.formGroupModifyRisk.controls['numero'].setValue(risk.numero);
    this.formGroupModifyRisk.controls['piso'].setValue(risk.piso);
    this.formGroupModifyRisk.controls['puerta'].setValue(risk.puerta);
    this.formGroupModifyRisk.controls['coPostal'].setValue(risk.coPostal);
    this.formGroupModifyRisk.controls['localidad'].setValue(risk.localidad);
    this.formGroupModifyRisk.controls['provincia'].setValue(risk.provincia);

    this.formGroupModifyRisk.enable();
  }

  guardarDatos() {
    if (this.formGroupModifyRisk.invalid) {
      this.formGroupModifyRisk.markAllAsTouched();
    } else {
      this.risk = {
        "idRiesgo": this.riskModify.idRiesgo,
        "idPoliza": this.riskModify.idPoliza,
        "tipoCalle": this.formGroupModifyRisk.get('tipoCalle')?.value,
        "noCalle": this.formGroupModifyRisk.get('noCalle')?.value,
        "numero": this.formGroupModifyRisk.get('numero')?.value,
        "piso": this.formGroupModifyRisk.get('piso')?.value,
        "puerta": this.formGroupModifyRisk.get('puerta')?.value,
        "coPostal": this.formGroupModifyRisk.get('coPostal')?.value,
        "localidad": this.formGroupModifyRisk.get('localidad')?.value,
        "provincia": this.formGroupModifyRisk.get('provincia')?.value,
        "siniestros": this.riskModify.siniestros
      }
      this._riskService.updateRisk(this.risk).subscribe(
        (res) => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Riesgo modificada con exito' });
          this.formGroupModifyRisk.reset();
          this.formGroupModifyRisk.disable();
          console.log('dentro de guradar: ', res)
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar el riesgo' });
        }
      )
    }
  }

  clearForm() {
    this.formGroupModifyRisk.reset();
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
    return msg;
  }

}
