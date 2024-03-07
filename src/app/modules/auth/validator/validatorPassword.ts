import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(controlName)?.value;
    const confirmPassword = control.get(matchingControlName)?.value;

    return password === confirmPassword ? null : { 'passwordMismatch': true };
  };
}
