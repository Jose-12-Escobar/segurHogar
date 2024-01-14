import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { Policy } from '../../admin/models/policy-model';
import { Risk } from '../../admin/models/risk-model';
import { LocalStorageService } from '../../admin/services/local-storage.service';
import { LoadClientService } from '../Services/loadCliente.service';
import { Client } from '../../admin/models/client-model';

@Component({
  selector: 'app-data-policy',
  templateUrl: './data-policy.component.html',
  styleUrls: ['./data-policy.component.css']
})
export class DataPolicyComponent implements OnInit {

  formGroupRisk !: FormGroup;
  policies !: Policy[];
  showTable: boolean = false;
  numPoliza !: string | undefined;
  dni !: string;

  constructor(private _fb: FormBuilder,
    public _show: SidebarService,
    private _localStorage: LocalStorageService,
    private _loadClient: LoadClientService) {
      this._show.changeShowSidebar(true);
  }

  ngOnInit(): void {
    this.dni = this._localStorage.getItem('dni');
    if (this.dni) {
      this.initFormRisk();
      this.formGroupRisk.disable();
      this._loadClient.getClientByDni(this.dni).subscribe({
        next: (res: Client) => {
          this.policies = res.polizas;
          this.policies.length > 0 ? this.showTable = true : this.showTable = false;

        },
        error: () => {
          this.showTable = false
        }
      })
    }
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

  showRisktInformation(risk: Risk, numPolicy: string) {

    this.numPoliza = numPolicy;

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
