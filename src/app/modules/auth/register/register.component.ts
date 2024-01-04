import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/Services/sidebar.service';
import { passwordMatchValidator } from '../validator/validatorPassword';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroupRegister !: FormGroup;

  constructor( public _show: SidebarService, private _fb: FormBuilder, private _router: Router){
    _show.changeShowSidebar(false)
  }

  ngOnInit(): void {
    this.initFormRegister();
  }

  initFormRegister() {
    this.formGroupRegister = this._fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      apellidos: [null, [Validators.required,  Validators.minLength(10), Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      password: [null, [Validators.required, Validators.minLength(8)]],
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
        apellidos:"El mínimo de caracteres válido es 10",
        password:"El mínimo de caracteres válido es 8",
        }[campo]|| '';
    }
    else if(error?.['maxlength']){
      msg= 'Exede el maximo de caracteres';
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
          this._router.navigate(['/auth/login']);
        }
}

}
