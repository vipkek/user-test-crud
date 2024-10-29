import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';
import { UserModel } from '../core/interface/user';
import { UserAddModalComponent } from './user-add-modal/user-add-modal.component';
import { UserItemComponent } from './user-item/user-item.component';
import { UserService } from '../core/services/user.service';
import { ApiResponse } from '../core/interface/api';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserAddModalComponent,
    UserItemComponent,
    LoaderComponent
  ],
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(UserAddModalComponent)
  modalComponent: UserAddModalComponent | undefined;

  isLoading = false;

  users: UserModel[] | null = [];
  isSuccessMessage = false;

  private isDestroyedSubject = new Subject<void>();
  private timeoutId: ReturnType<typeof setTimeout> = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.isDestroyedSubject.next();
    this.isDestroyedSubject.complete();
    clearTimeout(this.timeoutId);
  }

  openAddUserModel(): void {
    this.modalComponent?.openModal();
  }

  private loadUsers(): void {
    this.isLoading = true;

    this.userService.getUsers()
      .pipe(
        catchError((e) => {
          this.isLoading = false;
          return throwError(e);
        }),
        finalize(() => this.isLoading = false),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe((response: ApiResponse<UserModel[]>) => {
        this.users = response.data;
      })
  }

  addUser(data: UserModel | null): void {
    if (!data) {
      return;
    }

    this.users?.unshift(data);
  }

  deleteUser(userId: string, index: number): void {
    this.userService.deleteUser(userId)
      .pipe(
        catchError((e) => {
          return throwError(e);
        }),
        takeUntil(this.isDestroyedSubject)
      )
      .subscribe(() => {
        this.users?.splice(index, 1);
        this.isSuccessMessage = true;
        this.timeoutId = setTimeout(() => {
          this.isSuccessMessage = false;
        }, 3000);
      })
  }
}
