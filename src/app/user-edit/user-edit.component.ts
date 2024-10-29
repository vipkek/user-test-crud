import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';
import { UserService } from '../core/services/user.service';
import { ApiResponse } from '../core/interface/api';
import { UserModel } from '../core/interface/user';
import { nameValidator } from '../core/validators/name-validator';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { ValidationErrorDirective } from '../shared/directives/validation-error.directive';

@Component({
  selector: 'user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
    ValidationErrorDirective
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit, OnDestroy {
  userId = '';

  isLoading = false;
  isSuccessMessage = false;

  form = new FormGroup({
    username: new FormControl<string>(
      '', [Validators.required, nameValidator()]
    ),
    email: new FormControl<string>(
      '', [Validators.required, Validators.email]
    )
  });

  emailForm: FormGroup = this.fb.group({
    emails: this.fb.array([this.createEmail()])
  });

  private isDestroyedSubject = new Subject<void>();
  private timeoutId: ReturnType<typeof setTimeout> = 0;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private location: Location,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.userId) {
      return;
    }

    this.isLoading = true;

    this.userService.getUser(this.userId)
      .pipe(
        catchError((e) => {
          this.isLoading = false;
          return throwError(e);
        }),
        finalize(() => this.isLoading = false),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((response: ApiResponse<UserModel>) => {
        if (response?.data) {
          this.initFormValues(response.data);
        }
      })
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
    clearTimeout(this.timeoutId);
  }

  createEmail(email?: string): FormGroup {
    return this.fb.group({
      email: [email || '', [Validators.required, Validators.email]]
    });
  }

  addEmail() {
    this.emails.push(this.createEmail());
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  get emails(): FormArray {
    return this.emailForm?.get('emails') as FormArray;
  }

  initFormValues(data: UserModel) {
    this.form.setValue({
      username: data.username,
      email: data.email
    });

    if (data.additionalEmails?.length) {
      this.setEmails(data.additionalEmails);
    }
  }

  setEmails(emails: string[]) {
    const emailFormArray = this.emailForm.get('emails') as FormArray;
    emailFormArray.clear();

    emails.forEach(email => {
      emailFormArray.push(this.createEmail(email));
    });
  }

  submit(): void {
    if (!this.form.valid || !this.emailForm.valid) {
      return;
    }

    this.isLoading = true;

    const formValues = this.emailForm.value;
    const additionalEmails = formValues.emails.map((item: { email: string }) => item.email);

    const data = <UserModel>{
      id: this.userId,
      additionalEmails: additionalEmails,
      ...this.form.value
    } ;

    this.userService.updateUser(data)
      .pipe(
        catchError((e) => {
          this.isLoading = false;
          return throwError(e);
        }),
        finalize(() => this.isLoading = false),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((response: ApiResponse<UserModel>) => {
        this.isSuccessMessage = true;

        this.timeoutId = setTimeout(() => {
          this.isSuccessMessage = false;
        }, 4000);
      })
  }

  navigationBack(): void {
    this.location.back();
  }
}
