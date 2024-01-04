import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyClientComponent } from 'src/app/modules/admin/modify-client/modify-client.component';
import { NuevoClienteComponent } from 'src/app/modules/admin/nuevo-cliente/nuevo-cliente.component';
import { ListClientComponent } from './list-client/list-client.component';
import { NewSinisterComponent } from './new-sinister/new-sinister.component';
import { NewPolicyComponent } from './new-policy/new-policy.component';
import { ListPolicyComponent } from './list-policy/list-policy.component';
import { ModifyPolicyComponent } from './modify-policy/modify-policy.component';
import { ListRiskComponent } from './list-risk/list-risk.component';
import { ModifyRiskComponent } from './modify-risk/modify-risk.component';
import { SearchClientComponent } from './search-client/search-client.component';
import { ListSinisterComponent } from './list-sinister/list-sinister.component';
import { ModifySinisterComponent } from './modify-sinister/modify-sinister.component';

const routes: Routes = [
  { path: 'newClient', component: NuevoClienteComponent },
  { path: 'newPolicy', component: NewPolicyComponent },
  { path: 'newSinister', component: NewSinisterComponent },
  { path: 'listClient', component: ListClientComponent },
  { path: 'listPolicy', component: ListPolicyComponent },
  { path: 'listRisk', component: ListRiskComponent },
  { path: 'listSinister', component: ListSinisterComponent },
  { path: 'modifyClient', component: ModifyClientComponent },
  { path: 'modifyPolicy', component: ModifyPolicyComponent },
  { path: 'modifyRisk', component: ModifyRiskComponent },
  { path: 'modifySinister', component: ModifySinisterComponent },
  { path: 'searchClient', component: SearchClientComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
