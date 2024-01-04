import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { ValidatorDate } from '../validator/validatorDate';
import { ValidatorDocuemntId } from '../validator/validatorDI';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client-model';
import { Policy } from '../models/policy-model';

@Component({
  selector: 'app-new-sinister',
  templateUrl: './new-sinister.component.html',
  styleUrls: ['./new-sinister.component.css']
})
export class NewSinisterComponent implements OnInit {

  selectedCategory !: any;
  formGroupNewSinister !: FormGroup;
  formGroupSearch !: FormGroup;
  policies !: Policy[];
  showTable : boolean = false;

  state: { state: string, key: string }[] = [
    { state: 'Tramitado', key: '1' },
    { state: 'En proceso', key: '2' },
    { state: 'Finalizado', key: '3' }
  ];

  constructor(public _show: SidebarService,
              private _fb: FormBuilder,
              private _messageService: MessageService,
              private _clientService: ClientService) {
    this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.initFormSinister();
    this.initFormSearch();
  }

  initFormSearch() {
    this.formGroupSearch = this._fb.group({
      documentoId: [null, [ValidatorDocuemntId.validDucumentId, Validators.maxLength(9)]],
      nuPoliza: [null],
    });
  }
  initFormSinister() {
    this.formGroupNewSinister = this._fb.group({
      ref_sinister: [null, [Validators.required]],
      fe_dano: [null, [Validators.required, ValidatorDate.DateTopCurrent]],
      state: [null, [Validators.required]],
      fe_inicio_rep: [null, [Validators.required, this.dateStartOlderDamage.bind(this)]],
      coste: [null, [Validators.required]],
      peritado: [null, [Validators.required]],
      descripcion: [null, [Validators.maxLength(255)]]
    });
  }
  searchSinister() {
    if (this.formGroupSearch.invalid) {
      this.formGroupSearch.markAllAsTouched();
    } else {
      if (this.formGroupSearch.value.documentoId) {
        this.searchSinisterByDni();
      }
      /*else if (this.formGroupSearch.value.nuPoliza) {
        this.searchSinisterByNumPolicy();
      }*/
      else {
        this._messageService.add({severity: 'error', summary: 'Error', detail: 'Debe introducir algun valor para realizar la busqueda'});
      }
    }
  }

  searchSinisterByDni(){
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
      //this.formGroupModifyPolicy.reset();
      //this.formGroupModifyPolicy.disable();
      this._messageService.add({ severity: 'info', summary: 'Info', detail: `No se encuentran polizas pra el cliente ${client.documento}` });
    }
  }

  searchSinisterByNumPolicy() {

  }

  noEsValido(campo: string, formGroup: FormGroup) {
    return formGroup.controls[campo].touched && formGroup.controls[campo].invalid;
  }

  getMensaje(campo: string, formGroup: FormGroup): string {
    const error = formGroup.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }else if(error?.['fechaSuperiorActual']){
      msg = 'La fecha del daño no puede ser superior a la fecha actual.'
    }else if(error?.['dateStartOlderDamage']) {
      msg = 'La fecha de inicio de reparacion no puede ser antes que la fecha del daño.'
    }else if(error?.['dniInvalid']) {
      msg = 'El DNI no es valido.'
    }else if(error?.['documentInvalid']) {
      msg = 'Documento de identificacion invalido'
    }else if(error?.['nieInvalid']) {
      msg = 'El NIE no es valido'
    }else if (error?.['maxlength']) {
      msg = {
        descripcion: "El máximo de caracteres es 255"
      }[campo] || '';
    }

    return msg;
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

  /*

  guardarDatos() {
    if (this.formGroupNewSinister.invalid) {
      this.formGroupNewSinister.markAllAsTouched();
    }
  }



  */

}


