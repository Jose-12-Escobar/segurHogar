import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/Services/sidebar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroupLogin !: FormGroup;

  constructor( public _showSB: SidebarService, private _fb : FormBuilder, private _router: Router){
    _showSB.changeShowSidebar(false)
  }

  ngOnInit(): void {
    this.initFormLogin();
  }

  initFormLogin() {
    this.formGroupLogin = this._fb.group({
      email: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  noEsValido(campo: string) {
    return this.formGroupLogin.controls[campo].touched && this.formGroupLogin.controls[campo].invalid;
  }

  getMensaje(campo: string): string {
    const error = this.formGroupLogin.get(campo)?.errors;
    let msg:string="";

    if (error?.['required']) {
      msg='El campo es obligatorio';
    }
    else if(error?.['minlength']){
      msg= {
        password:"El mínimo de caracteres válido es 8",
        }[campo]|| '';
    }
    else if(error?.['pattern']){
      msg= 'No cumple el patron estandar';
    }

    return msg;
  }

  login(){
    if (this.formGroupLogin.invalid) {
          this.formGroupLogin.markAllAsTouched();
        }else{
          this._router.navigate(['/admin/newClient']);
        }
}
}
