import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';

import { UserModel } from '@interfaces';
import { UserService } from '@services';
import { LoaderComponent } from '@components';

import { AddUserModalComponent } from './add-user-modal';
import { UserItemComponent } from './user-item';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [AddUserModalComponent, UserItemComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  isAddUserModalOpen = new Subject<boolean>();

  isLoading = false;

  users: UserModel[] | null = [];
  isSuccessMessage = false;
  errorMessage = '';

  private isDestroyedSubject = new Subject<void>();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  openAddUserModal(): void {
    this.isAddUserModalOpen.next(true);
  }

  private loadUsers(): void {
    this.isLoading = true;

    this.userService
      .getUsers()
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.errorMessage = e.message;
          this.cdr.markForCheck();
          return throwError(() => e);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
        takeUntil(this.isDestroyedSubject),
      )
      .subscribe(({ data }) => {
        this.users = data;
        this.cdr.markForCheck();
      });
  }

  addUser(data: UserModel | null): void {
    if (!data) {
      return;
    }

    this.users?.unshift(data);
  }

  deleteUser(userId: string): void {
    this.userService
      .deleteUser(userId)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.errorMessage = e.message;
          this.cdr.markForCheck();
          return throwError(() => e);
        }),
        takeUntil(this.isDestroyedSubject),
      )
      .subscribe(() => {
        this.users =
          this.users === null ?
            []
          : this.users.filter((u: UserModel) => u.id != userId);
        this.isSuccessMessage = true;
        this.cdr.markForCheck();

        this.timeoutId = setTimeout(() => {
          this.isSuccessMessage = false;
          this.cdr.markForCheck();
        }, 3000);
      });
  }
}
