import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { PageHomeMenuComponentClient } from './page-home-menu/page-home-menu.component';
import { DataClientComponent } from './data-client/data-client.component';

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
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { DataSinisterComponent } from './data-sinister/data-sinister.component';

@NgModule({
  declarations: [
    PageHomeMenuComponentClient,
    DataClientComponent,
    DataPolicyComponent,
    DataSinisterComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
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
  providers: [MessageService,
    ConfirmationService],
})
export class ClientModule { }
