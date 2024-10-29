import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value && value.length > 100) {
      return { maxLength: true };
    }

    const regex = /^[A-Za-z0-9 ]*$/;
    if (value && !regex.test(value)) {
      return { invalidCharacters: true };
    }

    return null;
  };
}
