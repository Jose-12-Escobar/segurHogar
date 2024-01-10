import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { passwordMatchValidator } from '../validator/validatorPassword';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { RegisterIn } from '../models/register-model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroupRegister !: FormGroup;
  dataClient !: RegisterIn;

  constructor( public _show: SidebarService,
              private _fb: FormBuilder,
              private _router: Router,
              private _authService: AuthService,
              private _messageService: MessageService){
    _show.changeShowSidebar(false)
  }

  ngOnInit(): void {
    this.initFormRegister();
  }

  initFormRegister() {
    this.formGroupRegister = this._fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellidos: [null, [Validators.required,  Validators.minLength(3), Validators.maxLength(40)]],
      username:[null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: [null, [Validators.required]]
    },{
      validator: passwordMatchValidator('password', 'confirmPassword')
    }
    );
  }

  noEsValido(campo: string) {
    return this.formGroupRegister.controls[campo].touched && this.formGroupRegister.controls[campo].invalid;
  }

  getMensaje(campo: string): string {
    const error = this.formGroupRegister.get(campo)?.errors;
    let msg:string="";

    if (error?.['required']) {
      msg='El campo es obligatorio';
    }
    else if(error?.['minlength']){
      msg= {
        nombre:"El mínimo de caracteres válido es 3",
        apellidos:"El mínimo de caracteres válido es 3",
        password:"El mínimo de caracteres válido es 8",
        username:"El mínimo de caracteres válido es 3"
        }[campo]|| '';
    }
    else if(error?.['maxlength']){
      msg={
        nombre:"El máximo de caracteres válido es 30",
        apellidos:"El máximo de caracteres válido es 40",
        password:"El máximo de caracteres válido es 16",
        username:"El máximo de caracteres válido es 10"
      } [campo]|| '';
    }
    else if(error?.['pattern']){
      msg= 'No cumple el patron estandar';
    }

    return msg;
  }

  register(){
    if (this.formGroupRegister.invalid) {
          this.formGroupRegister.markAllAsTouched();

        }else{
          this.dataClient = {
            "name": this.formGroupRegister.get('nombre')?.value,
            "lastname": this.formGroupRegister.get('apellidos')?.value,
            "username": this.formGroupRegister.get('username')?.value,
            "email": this.formGroupRegister.get('email')?.value,
            "password": this.formGroupRegister.get('password')?.value
          }
          console.log(this.dataClient)
          this._authService.register(this.dataClient).subscribe({
            next: (res) => {
              console.log(res)
              this._messageService.add({ severity: 'success', summary: 'Genial', detail: 'Se ha realizado el registro correctamente' });
              this._router.navigate(['/auth/login']);
            },
            error: () => {
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Verifique los datos e intentelo de nuevo' });
            }
          })

        }
}

}
