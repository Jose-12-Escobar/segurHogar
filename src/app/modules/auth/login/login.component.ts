import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { AuthService } from '../services/auth.service';
import { LoginIn } from '../models/login-model';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../admin/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroupLogin !: FormGroup;
  dataClient !: LoginIn;
  emailOrDocumentoId: boolean = true;
  fcnEmailOrDocumentoId: string = 'email';

  constructor(public _showSB: SidebarService,
    private _fb: FormBuilder,
    private _router: Router,
    private _auth: AuthService,
    private _message: MessageService,
    private _localStorage: LocalStorageService) {
    _showSB.changeShowSidebar(false)
  }

  ngOnInit(): void {
    this.initFormLogin();
  }

  initFormLogin() {
    this.formGroupLogin = this._fb.group({
      email: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      documentoId: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  noEsValido(campo: string) {
    return this.formGroupLogin.controls[campo].touched && this.formGroupLogin.controls[campo].invalid;
  }

  getMensaje(campo: string): string {
    const error = this.formGroupLogin.get(campo)?.errors;
    let msg: string = "";

    if (error?.['required']) {
      msg = 'El campo es obligatorio';
    }
    else if (error?.['minlength']) {
      msg = {
        password: "El mínimo de caracteres válido es 8",
        documentoId: "El mínimo de caracteres válido es 9"
      }[campo] || '';
    } else if (error?.['maxlength']) {
      msg = {
        password: "El máximo de caracteres válido es 16",
        documentoId: "El máximo de caracteres válido es 9"
      }[campo] || '';
    }
    else if (error?.['pattern']) {
      msg = 'No cumple el patron estandar';
    }

    return msg;
  }

  login() {
    if (this.formGroupLogin.invalid) {
      this.formGroupLogin.markAllAsTouched();
    } else {

      this.dataClient = {
        "usernameOrEmail": this.emailOrDocumentoId ? this.formGroupLogin.get('email')?.value : this.formGroupLogin.get('documentoId')?.value,
        "password": this.formGroupLogin.get('password')?.value,
      }
      this._auth.login(this.dataClient).subscribe({
        next: (res) => {
          this._localStorage.setItem('role', res.roles);
          if (res.roles === 'ROLE_ADMIN') {
            this._router.navigate(['/admin/homeMenu'])
          }
          else if (res.roles === 'ROLE_USER') {
            this._localStorage.setItem('dni', res.username)
            this._router.navigate(['/client/homeMenu'])
          }
          else{
            this._message.add({ severity: 'error', summary: 'Error', detail: 'A ocurrido un error al iniciar sesión' });;
          }
        },
        error: () => {
          this._message.add({ severity: 'error', summary: 'Credenciales erróneas', detail: 'No existe ninguna cliente con los datos introducidos' });
        }
      })
    }
  }

  isEmail() {
    this.emailOrDocumentoId = true;
    this.fcnEmailOrDocumentoId = 'email';
    this.formGroupLogin.get('documentoId')?.reset();
  }

  isUsername() {
    this.emailOrDocumentoId = false;
    this.fcnEmailOrDocumentoId = 'documentoId';
    this.formGroupLogin.get('email')?.reset();
  }

}
