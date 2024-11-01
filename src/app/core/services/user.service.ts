import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse, UserModel } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<UserModel[]>> {
    return this.http.get<ApiResponse<UserModel[]>>('api/users');
  }

  getUser(id: string): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>('api/user', {
      params: { id },
    });
  }

  createUser(body: UserModel): Observable<ApiResponse<UserModel>> {
    return this.http.post<ApiResponse<UserModel>>('api/createUser', body);
  }

  deleteUser(id: string): Observable<string> {
    return this.http.delete<string>('api/deleteUser', { params: { id } });
  }

  updateUser(body: UserModel): Observable<ApiResponse<UserModel>> {
    return this.http.put<ApiResponse<UserModel>>('api/updateUser', body);
  }
}
