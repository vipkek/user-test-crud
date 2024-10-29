import { Injectable } from '@angular/core';
import { UserModel } from '../interface/user';

@Injectable({
  providedIn: 'root',
})

export class UserCacheService {
  private userCache: Map<string, UserModel> = new Map([
    ['hash130483', { id: 'hash130483', username: 'borya', email: 'baskla@sadsa.asd' }],
    ['hash130482', { id: 'hash130482', username: 'grisha', email: 'fkdfk@sadsa.asd' }],
    ['hash130438', { id: 'hash130438', username: 'alik', email: 'edsfds@sadsa.asd' }],
    ['hash130444', { id: 'hash130444', username: 'sasha', email: 'rdskfl@sadsa.asd' }]
  ]);

  constructor() {}

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
