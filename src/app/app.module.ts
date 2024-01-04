import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './share/footer/footer.component';
import { HeaderComponent } from './share/header/header.component';
import { TarifaComponent } from './pages/tarifa/tarifa.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { NuevoClienteComponent } from './modules/admin/nuevo-cliente/nuevo-cliente.component';

/* Importaciones PrimeNG */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule} from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './share/sidbar/sidbar.component';
import { ModifyClientComponent } from './modules/admin/modify-client/modify-client.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    TarifaComponent,
    LoginComponent,
    RegisterComponent,
    NuevoClienteComponent,
    SidebarComponent,
    ModifyClientComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    ButtonModule,
    SidebarModule,
    MenuModule,
    ReactiveFormsModule,
    PasswordModule,
    KeyFilterModule,
    HttpClientModule,
    ToastModule,
    CalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
