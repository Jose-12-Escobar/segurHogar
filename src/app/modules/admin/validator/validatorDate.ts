import { AbstractControl } from '@angular/forms';

export class ValidatorDate {

  static DateTopCurrent(control: AbstractControl): { [key: string]: boolean } | null {
  const fecha = control.value;

  if (fecha) {
    const fechaDate = new Date(fecha);
    const fechaActual = new Date();

    if (fechaDate > fechaActual) {
      return { 'fechaSuperiorActual': true}
    }
  }
  return null;
  };

  static DateTopAge(control: AbstractControl): { [key: string]: boolean } | null {
    const fecha = control.value;

    if (fecha) {
      const fechaDate = new Date(fecha);
      const fechaActual = new Date();
      const fechaLimite = new Date();

      fechaLimite.setFullYear(fechaActual.getFullYear() - 18)

      if (fechaDate > fechaLimite) {
        return { 'menoriaEdad': true}
      }
    }
    return null;
    };
}


