import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';

import { ControlName } from '@enums';
import { ApiResponse, UserModel } from '@interfaces';
import { UserService } from '@services';
import { nameValidator } from '@validators';
import { LoaderComponent } from '@components';
import { ValidationErrorDirective } from '@directives';

const EMAILS_FORM_KEY = 'emails';

@Component({
  selector: 'user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, ValidationErrorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent implements OnInit, OnDestroy {
  userId = '';

  isLoading = false;
  isSuccessMessage = false;
  ControlName = ControlName;

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      nameValidator(),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  emailForm: FormGroup<{
    emails: FormArray<
      FormGroup<{ [ControlName.Email]: FormControl<string | null> }>
    >;
  }>;

  private isDestroyedSubject = new Subject<void>();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.emailForm = this.fb.group({
      emails: this.fb.array([this.createEmail()]),
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.userId) {
      return;
    }

    this.isLoading = true;

    this.userService
      .getUser(this.userId)
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
        if (response.data) {
          this.initFormValues(response.data);
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  createEmail(email?: string) {
    return this.fb.group({
      [ControlName.Email]: [
        email ?? '',
        [Validators.required, Validators.email],
      ],
    });
  }

  addEmail() {
    this.emails.push(this.createEmail());
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  getFormGroup(control: AbstractControl) {
    return <FormGroup>control;
  }

  get emails(): FormArray {
    return <FormArray>this.emailForm.get(EMAILS_FORM_KEY);
  }

  initFormValues(data: UserModel) {
    this.form.setValue({
      username: data.username,
      email: data.email,
    });

    if (data.additionalEmails?.length) {
      this.setEmails(data.additionalEmails);
    }
  }

  setEmails(emails: string[]) {
    const emailFormArray = <FormArray>this.emailForm.get(EMAILS_FORM_KEY);
    emailFormArray.clear();

    emails.forEach((email) => {
      emailFormArray.push(this.createEmail(email));
    });
  }

  submit(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const data = <UserModel>{
      id: this.userId,
      additionalEmails: this.emailForm.value.emails?.map(
        (item: Partial<{ email: string | null }>) => item.email,
      ),
      ...this.form.value,
    };

    this.userService
      .updateUser(data)
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
      .subscribe(() => {
        this.isSuccessMessage = true;
        this.cdr.markForCheck();

        this.timeoutId = setTimeout(() => {
          this.isSuccessMessage = false;
          this.cdr.markForCheck();
        }, 4000);
      });
  }

  navigationBack(): void {
    this.location.back();
  }
}
