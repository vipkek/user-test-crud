import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[validationError]',
  standalone: true
})
export class ValidationErrorDirective implements OnInit {
  @Input()
  controlName: string | undefined;

  @Input()
  formGroup: FormGroup | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName) as AbstractControl;
      if (control) {
        control.statusChanges.subscribe(() => this.showErrorMessages(control));
      }
    }
  }

  private showErrorMessages(control: AbstractControl) {
    const errorMessages: string[] = [];

    if (control.errors) {
      if (control.errors['required']) {
        errorMessages.push('This field is required.');
      }
      if (control.errors['minlength']) {
        errorMessages.push(`Minimum length is ${control.errors['minlength'].requiredLength} characters.`);
      }
      if (control.errors['invalidCharacters']) {
        errorMessages.push('This characters is not allowed.');
      }
      if (control.errors['email']) {
        errorMessages.push('This email is invalid.');
      }
    }

    this.el.nativeElement.innerHTML = errorMessages.join('<br>');
    this.el.nativeElement.style.fontSize = '12px';
    this.el.nativeElement.style.color = 'red';
  }
}
