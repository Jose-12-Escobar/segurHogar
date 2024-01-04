import { AbstractControl } from '@angular/forms';

export class ValidatorCuentaBancaria {

  static validIban(control: AbstractControl): { [key: string]: boolean } | null {

    const value = control.value;

    // Eliminar espacios en blanco y convertir a mayúsculas
    if (value) {
      const iban = value.replace(/\s+/g, '').toUpperCase();
      // Verificar que el IBAN comience con "ES"
      if (!(iban.startsWith('ES'))) {
        return { 'ibanInvalidoLetra': true };
      }

      // Verificar longitud del IBAN específica para España (24 caracteres)
      if (iban.length !== 24) {
        return { 'ibanInvalidoLength': true };
      }

      // Reorganizar el IBAN moviendo los primeros cuatro caracteres al final
      const ibanReordenado = iban.slice(4) + iban.slice(0, 4);
      // Convertir letras a números según la tabla de conversión
      const numeros = ibanReordenado.replace(/[A-Z]/g, (letra: string) => {
        const codigo = letra.charCodeAt(0);
        return codigo >= 65 && codigo <= 90 ? (codigo - 55).toString() : letra;
      });
      // Verificar si el residuo de la división entre el número formado y 97 es igual a 1
      if (!(BigInt(numeros) % 97n === 1n)) {
        return { 'ibanInvalido': true };
      }
      return null;
    }

    return null;
  }
}
