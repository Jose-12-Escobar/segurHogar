import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeMenuComponentClient } from './page-home-menu/page-home-menu.component';
import { DataClientComponent } from './data-client/data-client.component';
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { DataSinisterComponent } from './data-sinister/data-sinister.component';

const routes: Routes = [
  { path: 'homeMenu', component: PageHomeMenuComponentClient },
  { path: 'dataClient', component: DataClientComponent },
  { path: 'dataPolicy', component: DataPolicyComponent },
  { path: 'dataSinister', component: DataSinisterComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
