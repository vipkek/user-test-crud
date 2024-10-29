import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';
import { nameValidator } from '../../core/validators/name-validator';
import { UserModel } from '../../core/interface/user';
import { UserService } from '../../core/services/user.service';
import { ApiResponse } from '../../core/interface/api';
import { generateRandID } from '../../core/utils/common';
import { ValidationErrorDirective } from '../../shared/directives/validation-error.directive';

@Component({
  selector: 'user-add-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorDirective
  ],
  templateUrl: './user-add-modal.component.html',
})

export class UserAddModalComponent implements OnDestroy {
  @ViewChild('modal', { static: false })
  modal: ElementRef | undefined;

  @Output()
  addUser = new EventEmitter<UserModel | null>();

  form = new FormGroup({
    username: new FormControl<string>(
      '', [Validators.required, nameValidator()]
    ),
    email: new FormControl<string>(
      '', [Validators.required, Validators.email]
    ),
  });

  isLoading = false;

  private isDestroyedSubject = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
  }

  openModal() {
    const modalElement = this.modal?.nativeElement;
    const modal = new Modal(modalElement);
    modal.show();
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
    this.form.markAsPristine();
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.enable();
      return;
    }

    this.isLoading = true;

    const data = <UserModel>{
      id: generateRandID(),
      ...this.form.value
    } ;

    this.userService.createUser(data)
      .pipe(
        catchError((e) => {
          this.isLoading = false;
          return throwError(e);
        }),
        finalize(() => this.isLoading = false),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((response: ApiResponse<UserModel>) => {
        this.addUser.emit(response.data)
        this.closeModal();
      })
  }

  closeModal() {
    const modalElement = this.modal?.nativeElement;
    const modal = Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}
