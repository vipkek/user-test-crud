import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserModel } from '../interface/user';
import { UserCacheService } from '../services/cache.service';
import { ApiResponse } from '../interface/api';
import { generateRandDebounceTime } from '../utils/common';

export const mockBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {

  switch (true) {
    case req.url.endsWith('/api/users') && req.method === 'GET':
      return handleGetUsers();

    case req.url.endsWith('/api/user') && req.method === 'GET':
      return handleGetUser(req);

    case req.url.endsWith('/api/createUser') && req.method === 'POST':
      return handleCreateUser(req);

    case req.url.endsWith('/api/deleteUser') && req.method === 'DELETE':
      return handleDeleteUser(req);

    case req.url.endsWith('/api/updateUser') && req.method === 'PUT':
      return handleUpdateUser(req);

    default:
      return of(new HttpResponse({ status: 404, body: { result: 'You are using the wrong endpoint' } }));
  }
};

const handleGetUsers = (): Observable<HttpResponse<ApiResponse<UserModel[]>>> => {
  const users = inject(UserCacheService).getUsers();

  const usersResponse: ApiResponse<UserModel[]> = {
    meta: {
      code: 200,
      message: 'Success'
    },
    data: users
  };

  const response = new HttpResponse<ApiResponse<UserModel[]>>({
    status: 200,
    body: usersResponse
  });

  return of(response).pipe(
    delay(generateRandDebounceTime(800, 1500)),
    tap(() => console.log('created users response'))
  );
};

const handleGetUser = (req: HttpRequest<unknown>): Observable<HttpResponse<ApiResponse<UserModel>>> => {
  const id = req.params.get('id');

  if (!id) {
    return of();
  }

  const user = inject(UserCacheService).getUser(id);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: 200,
      message: 'Success'
    },
    data: <UserModel>user
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: 200,
    body: userResponse
  });

  return of(response).pipe(
    delay(generateRandDebounceTime(600, 1200)),
    tap(() => console.log('get user response'))
  );
};

const handleCreateUser = (req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> => {
  const user = <UserModel>req.body;
  inject(UserCacheService).setUser(user);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: 200,
      message: 'Success'
    },
    data: user
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: 200,
    body: userResponse
  });

  return of(response).pipe(
    delay(generateRandDebounceTime(1000, 2000)),
    tap(() => console.log('create user response'))
  );
};

const handleDeleteUser = (req: HttpRequest<unknown>): Observable<HttpResponse<ApiResponse<void>>> => {

  const id = req.params.get('id');

  if (id) {
    inject(UserCacheService).removeUser(id);
  }

  const userResponse: ApiResponse<void> = {
    meta: {
      code: 200,
      message: 'Successfully deletion'
    },
    data: null
  };

  const response = new HttpResponse<ApiResponse<void>>({
    status: 200,
    body: userResponse
  });

  return of(response).pipe(
    delay(generateRandDebounceTime(500, 1000)),
    tap(() => console.log('delete response'))
  );
};

const handleUpdateUser = (req: HttpRequest<unknown>): Observable<HttpResponse<ApiResponse<UserModel>>> => {
  const user = <UserModel>req.body;
  inject(UserCacheService).setUser(user);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: 200,
      message: 'Success'
    },
    data: user
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: 200,
    body: userResponse
  });

  return of(response).pipe(
    delay(generateRandDebounceTime(1000, 2000)),
    tap(() => console.log('update user response'))
  );
};
