import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { SinisterService } from '../services/sinister.service';
import { IdEstado, Sinister } from '../models/sinister-model';
import { ValidatorDate } from '../validator/validatorDate';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-modify-sinister',
  templateUrl: './modify-sinister.component.html',
  styleUrls: ['./modify-sinister.component.css']
})
export class ModifySinisterComponent implements OnInit {

  formGroupSearch !: FormGroup;
  formGroupModifySinister !: FormGroup;
  sinisterModify !: Sinister;
  sinister !: Sinister;
  idSinisterLocalStorage !: number;
  refSinister !: string | undefined;
  state: IdEstado[] = [
    { "idEstado": 1, "descripcion": 'Tramitado' },
    { "idEstado": 2, "descripcion": 'En proceso' },
    { "idEstado": 3, "descripcion": 'Finalizado' }
  ];

  constructor(public _show: SidebarService,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _sinisterService: SinisterService,
    private _localStorageService: LocalStorageService) {
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.idSinisterLocalStorage = this._localStorageService.getItem('idSinister');
    this.initFormSearch();
    this.initFormModifySinister();
    this.formGroupModifySinister.disable();

    if (this.idSinisterLocalStorage) {
      this._sinisterService.getSinisterById(this.idSinisterLocalStorage).subscribe({
        next: (res: Sinister) => {
          this.sinisterModify = res
          this.formGroupModifySinister.enable();
          this.showRiskInformation(res);
          this.formGroupSearch.disable();
          localStorage.removeItem('idSinister');
        }
      })
    }
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      refSinister: [null, [Validators.required]],
    });
  }

  initFormModifySinister() {
    this.formGroupModifySinister = this._fb.group({

      fe_siniestro: [null, [Validators.required, ValidatorDate.DateTopCurrent]],
      state: [null, [Validators.required]],
      descripcion: [null, [Validators.maxLength(255)]],
      fe_inicio_rep: [null, [Validators.required, this.dateStartOlderDamage.bind(this)]],
      fe_fin_rep: [null, [this.dateEndOlderStart.bind(this)]],
      coste: [null, [Validators.required]],
      peritado: [null, [Validators.required]],
    });
  }

  noEsValido(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid;
  }

  getMensaje(campo: string, formGroup: FormGroup): string {
    const error = formGroup.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    } else if (error?.['fechaSuperiorActual']) {
      msg = 'La fecha del daño no puede ser superior a la fecha actual.'
    }
    else if (error?.['dateStartOlderDamage']) {
      msg = 'La fecha de inicio de reparacion no puede ser antes que la fecha del daño.'
    }
    else if (error?.['dateEndOlderStart']) {
      msg = 'La fecha de fin de reparacion no puede ser antes que la fecha de inicio de reparación.'
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
    else if (error?.['requiredDateStart']) {
      msg = 'Debe añadir primero la fecha de inicio'
    }
    else if (error?.['maxlength']) {
      msg = {
        descripcion: "El máximo de caracteres es 255"
      }[campo] || '';
    }

    return msg;
  }

  searchSinisterByRef() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      this._sinisterService.getSinisterByRef(this.formGroupSearch.get('refSinister')?.value).subscribe({
        next: (res: Sinister) => {
          this.sinisterModify = res;
          this.showRiskInformation(this.sinisterModify)
        },
        error: () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'No existe siniestro con esta referencia' });
          this.formGroupModifySinister.disable();
        }
      })
    }
  }

  showRiskInformation(sinister: Sinister) {

    this.refSinister = sinister.refSiniestro

    this.formGroupModifySinister.controls['fe_siniestro'].setValue(new Date(sinister.feSiniestro));
    this.formGroupModifySinister.controls['state'].setValue({ idEstado: sinister.idEstado?.idEstado, descripcion: sinister.idEstado?.descripcion });
    this.formGroupModifySinister.controls['descripcion'].setValue(sinister.description);
    this.formGroupModifySinister.controls['coste'].setValue(sinister.importeSiniestro);
    this.formGroupModifySinister.controls['peritado'].setValue(sinister.peritado);

    if (sinister.feInicioReparacion) {
      this.formGroupModifySinister.controls['fe_inicio_rep'].setValue(new Date(sinister.feInicioReparacion));
    } else {
      this.formGroupModifySinister.controls['fe_inicio_rep'].reset();
    }
    if (sinister.feFinReparacion) {
      this.formGroupModifySinister.controls['fe_fin_rep'].setValue(new Date(sinister.feFinReparacion));
    } else {
      this.formGroupModifySinister.controls['fe_fin_rep'].reset();
    }

    this.formGroupModifySinister.get('fe_siniestro')?.enable();
    this.formGroupModifySinister.get('state')?.enable();
    this.formGroupModifySinister.get('descripcion')?.enable();
    this.formGroupModifySinister.get('peritado')?.enable();
    //this.formGroupModifySinister.get('fe_siniestro')?.disable();
  }

  guardarDatos() {
    if (this.formGroupModifySinister.invalid) {
      this.formGroupModifySinister.markAllAsTouched();
    } else {
      this.sinister = {
        "idSiniestro": this.sinisterModify.idSiniestro,
        "idRiesgo": this.sinisterModify.idRiesgo,
        "feSiniestro": this.formGroupModifySinister.get('fe_siniestro')?.value,
        "importeSiniestro": this.formGroupModifySinister.get('coste')?.value,
        "feInicioReparacion": this.formGroupModifySinister.get('fe_inicio_rep')?.value,
        "feFinReparacion": this.formGroupModifySinister.get('fe_fin_rep')?.value,
        "peritado": this.formGroupModifySinister.get('peritado')?.value,
        "idEstado": { "idEstado": this.formGroupModifySinister.get('state')?.value.idEstado },
        "description": this.formGroupModifySinister.get('descripcion')?.value,
        "refSiniestro": this.sinisterModify.refSiniestro
      }

      this._sinisterService.updateSinister(this.sinister).subscribe(
        (res) => {
          this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Siniestro modificado con exito' });
          this.formGroupModifySinister.reset();
          this.formGroupModifySinister.disable();
        },
        () => {
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al modificar el siniestro' });
        }
      )
    }
  }

  clearForm() {
    this.formGroupModifySinister.reset();
    this.formGroupSearch.enable();
  }

  enableInputFechaInicio() {
    if (!this.formGroupModifySinister.controls['fe_siniestro']) {
      this.formGroupModifySinister.get('fe_inicio_rep')?.disable();
    }
  }

  dateStartOlderDamage(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaDano = this.formGroupModifySinister?.get('fe_siniestro')?.value;
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

  dateEndOlderStart(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaInicio = this.formGroupModifySinister?.get('fe_inicio_rep')?.value;
    const fechaFin = control.value;

    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (fechaFinDate < fechaInicioDate) {
        return { 'dateEndOlderStart': true };
      }
    }
    if (!fechaInicio) {
      return { 'requiredDateStart': true };
    }


    return null;
  }

  resetFechaFinReparacion() {
    let error = this.formGroupModifySinister.get('fe_fin_rep')?.errors
    let fcnFechaInicio = this.formGroupModifySinister.get('fe_inicio_rep')
    if (error?.['requiredDateStart'] && fcnFechaInicio?.valid) {
      this.formGroupModifySinister.get('fe_fin_rep')?.reset();
    }
  }

  isPeritado(){
    if (!this.formGroupModifySinister.get('peritado')?.value) {
      this.formGroupModifySinister.get('fe_inicio_rep')?.disable();
      this.formGroupModifySinister.get('fe_fin_rep')?.disable();
      this.formGroupModifySinister.get('coste')?.disable();
      this.formGroupModifySinister.get('fe_inicio_rep')?.reset();
      this.formGroupModifySinister.get('fe_fin_rep')?.reset();
      this.formGroupModifySinister.get('coste')?.reset();
    }else if (this.formGroupModifySinister.get('peritado')?.value) {
      this.formGroupModifySinister.get('fe_inicio_rep')?.enable();
      this.formGroupModifySinister.get('fe_fin_rep')?.enable();
      this.formGroupModifySinister.get('coste')?.enable();
    }
  }
}
