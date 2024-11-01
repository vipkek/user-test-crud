import { Directive, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ControlName } from '@enums';
import { MAX_NAME_LENGTH } from '@consts';

@Directive({
  selector: '[validationError]',
  standalone: true,
})
export class ValidationErrorDirective implements OnInit, OnDestroy {
  @Input()
  controlName: ControlName | undefined;

  @Input()
  formGroup: FormGroup | undefined;

  private isDestroyedSubject = new Subject<void>();

  constructor(private el: ElementRef<HTMLDivElement>) {}

  ngOnInit() {
    if (this.formGroup && this.controlName) {
      const control = <AbstractControl<string>>(
        this.formGroup.get(this.controlName)
      );
      control.statusChanges
        .pipe(takeUntil(this.isDestroyedSubject))
        .subscribe(() => {
          this.showErrorMessages(control);
        });
    }
  }

  ngOnDestroy() {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
  }

  private showErrorMessages(control: AbstractControl) {
    const errorMessages: string[] = [];
    const element = this.el.nativeElement;

    if (!control.errors) {
      element.innerHTML = '';
      return;
    }

    if (control.errors['required']) {
      errorMessages.push('This field is required.');
    }
    if (control.errors['maxLength']) {
      errorMessages.push(
        `Maximum length is ${String(MAX_NAME_LENGTH)} characters.`,
      );
    }
    if (control.errors['invalidCharacters']) {
      errorMessages.push('This characters is not allowed.');
    }
    if (control.errors['email']) {
      errorMessages.push('This email is invalid.');
    }

    element.innerHTML = errorMessages.join('<br>');
    element.style.fontSize = '12px';
    element.style.color = 'red';
  }
}
