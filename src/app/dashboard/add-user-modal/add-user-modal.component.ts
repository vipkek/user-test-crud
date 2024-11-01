import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  finalize,
  Observable,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { Modal } from 'bootstrap';

import { UserModel, ApiResponse } from '@interfaces';
import { ControlName } from '@enums';
import { UserService } from '@services';
import { nameValidator } from '@validators';
import { ValidationErrorDirective } from '@directives';

@Component({
  selector: 'add-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-user-modal.component.html',
})
export class AddUserModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: false })
  private modal: ElementRef<HTMLDivElement> | undefined;

  private modalInstance: Modal | null = null;

  @Input()
  isOpen: Observable<boolean> | null = null;

  @Output()
  addUser = new EventEmitter<UserModel | null>();

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      nameValidator(),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  isLoading = false;
  ControlName = ControlName;

  private isDestroyedSubject = new Subject<void>();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isOpen
      ?.pipe(takeUntil(this.isDestroyedSubject))
      .subscribe((isOpen: boolean) => {
        if (isOpen) {
          this.openModal();
        }
      });
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
  }

  openModal() {
    if (!this.modal) return;
    const modalElement = this.modal.nativeElement;
    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
    this.clearForm();
  }

  clearForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.cdr.markForCheck();
  }

  submit(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.userService
      .createUser(<UserModel>this.form.value)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => e);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
        takeUntil(this.isDestroyedSubject),
      )
      .subscribe((response: ApiResponse<UserModel>) => {
        this.addUser.emit(response.data);
        this.closeModal();
      });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}
