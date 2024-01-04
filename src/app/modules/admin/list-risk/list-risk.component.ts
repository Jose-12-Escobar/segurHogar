import { Component, OnInit } from '@angular/core';
import { RiskService } from '../services/risk.service';
import { Risk } from '../models/risk-model';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { LocalStorageService } from '../services/local-storage.service';
import { PolicyService } from '../services/policy.service';
import { Policy } from '../models/policy-model';

@Component({
  selector: 'app-list-risk',
  templateUrl: './list-risk.component.html',
  styleUrls: ['./list-risk.component.css']
})
export class ListRiskComponent implements OnInit {

  risks !: Risk[];
  policies !: Policy[];
  risksShow : Risk[] = [];

  constructor(private _riskService: RiskService,
              private _policyService: PolicyService,
              public _show: SidebarService,
              private _localStorageService: LocalStorageService){
    _show.changeShowSidebar(true);
  }

  ngOnInit(): void {
      this._riskService.getAllRisk().subscribe({
        next: (res: Risk[]) => {
          this.risks = res;
        }
      })

      this._policyService.getAllPolicies().subscribe({
        next: (res: Policy[]) => {
          this.policies = res;
          this.generateRisksShow();
        }
      })
  }

  editRisk(idRisk: Risk) {
    this._localStorageService.setItem('idRisk', idRisk);
  }

  generateRisksShow() {
    this.risks.forEach( risk => {
      this.policies.forEach((policy) => {
        if (risk.idRiesgo === policy.riesgos[0].idRiesgo) {
          risk.nuPoliza = policy.nuPoliza;
          this.risksShow.push(risk)
        }
      });
    });
  }
}

