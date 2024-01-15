import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AdminRoutingModule } from './admin-routing.module';
import { ListClientComponent } from './list-client/list-client.component';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ListPolicyComponent } from './list-policy/list-policy.component';
import { ListSinisterComponent } from './list-sinister/list-sinister.component';
import { ListRiskComponent } from './list-risk/list-risk.component';
import { NewSinisterComponent } from './new-sinister/new-sinister.component';
import { NewPolicyComponent } from './new-policy/new-policy.component';
import { ModifyPolicyComponent } from './modify-policy/modify-policy.component';
import { ModifyClientComponent } from './modify-client/modify-client.component';
import { ModifySinisterComponent } from './modify-sinister/modify-sinister.component';
import { ModifyRiskComponent } from './modify-risk/modify-risk.component';
import { SearchClientComponent } from './search-client/search-client.component';
import { PageHomeMenuComponentAdmin } from './page-home-menu/page-home-menu.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


/* Importaciones PrimeNG */
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    NuevoClienteComponent,
    ModifyClientComponent,
    ListClientComponent,
    NewSinisterComponent,
    NewPolicyComponent,
    ListPolicyComponent,
    ModifyPolicyComponent,
    ListRiskComponent,
    ModifyRiskComponent,
    SearchClientComponent,
    ListSinisterComponent,
    ModifySinisterComponent,
    PageHomeMenuComponentAdmin
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    CardModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    TooltipModule,
    ToastModule,
    InputMaskModule,
    ConfirmDialogModule,
    InputTextareaModule
  ],
  providers: [
    MessageService,
    ConfirmationService],
})
export class AdminModule { }
