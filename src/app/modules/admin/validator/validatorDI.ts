import { AbstractControl } from '@angular/forms';

export class ValidatorDocuemntId {
  static validDucumentId(control: AbstractControl): { [key: string]: boolean } | null {

    const documentId = control.value;

    if (documentId) {

      const matchesDni = documentId.match(/^(\d{8})([A-Z])$/);
      const matchesNie = documentId.match(/^([A-Z])(\d{7})([A-Z])$/);

      if (matchesDni) {
        const numeroDNI = matchesDni[1];
        const letraDNI = matchesDni[2];

        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const indice = parseInt(numeroDNI, 10) % 23;
        const letraEsperada = letras.charAt(indice);

        if (letraDNI !== letraEsperada) {
          return { 'dniInvalid': true }
        }

      }
      if (matchesNie) {
        const primeraLetra = matchesNie[1];

        if (primeraLetra !== ('X') && primeraLetra !== ('Y') && primeraLetra !== ('Z')) {

          return { 'nieInvalid': true };
        }
      }
      if (!matchesDni && !matchesNie) {
        return { 'documentInvalid': true}
      }
    }
    return null;
  };
}



