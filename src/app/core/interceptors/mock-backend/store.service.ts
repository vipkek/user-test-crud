import { Injectable } from '@angular/core';
import { UserModel } from '@interfaces';
import { INITIAL_USERS } from '@consts/mocks';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private userCache = new Map<string, UserModel>(INITIAL_USERS);

  getUser(id: string): UserModel | undefined {
    return this.userCache.get(id);
  }

  getUsers(): UserModel[] {
    return Array.from(this.userCache.values());
  }

  removeUser(id: string): void {
    this.userCache.delete(id);
  }

  setUser(user: UserModel): void {
    this.userCache.set(user.id, user);
  }
}
