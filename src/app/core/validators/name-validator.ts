import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { MAX_NAME_LENGTH } from '@consts';

export const nameValidator = (): ValidatorFn => {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;

    if (value && value.length > MAX_NAME_LENGTH) {
      return { maxLength: true };
    }

    const regex = /^[A-Za-z0-9 ]*$/;
    if (value && !regex.test(value)) {
      return { invalidCharacters: true };
    }

    return null;
  };
};
