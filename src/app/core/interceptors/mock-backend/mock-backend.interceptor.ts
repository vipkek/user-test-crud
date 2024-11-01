import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ApiResponse, UserModel } from '@interfaces';

import { StoreService } from './store.service';

export const mockBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
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
      return of(
        new HttpResponse({
          status: HttpStatusCode.NotFound,
          body: { result: 'You are using the wrong endpoint' },
        }),
      );
  }
};

const handleGetUsers = (): Observable<
  HttpResponse<ApiResponse<UserModel[]>>
> => {
  const users = inject(StoreService).getUsers();

  const usersResponse: ApiResponse<UserModel[]> = {
    meta: {
      code: HttpStatusCode.Ok,
      message: 'Success',
    },
    data: users,
  };

  const response = new HttpResponse<ApiResponse<UserModel[]>>({
    status: usersResponse.meta.code,
    body: usersResponse,
  });

  return of(response).pipe(delay(generateRandDebounceTime(800, 1500)));
};

const handleGetUser = (
  req: HttpRequest<unknown>,
): Observable<HttpResponse<ApiResponse<UserModel>>> => {
  const id = req.params.get('id');

  if (!id) {
    return of();
  }

  const user = inject(StoreService).getUser(id);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: HttpStatusCode.Ok,
      message: 'Success',
    },
    data: <UserModel>user,
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: userResponse.meta.code,
    body: userResponse,
  });

  return of(response).pipe(delay(generateRandDebounceTime(600, 1200)));
};

const handleCreateUser = (
  req: HttpRequest<unknown>,
): Observable<HttpResponse<unknown>> => {
  const user = <UserModel>req.body;
  user.id = generateRandID();

  inject(StoreService).setUser(user);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: HttpStatusCode.Ok,
      message: 'Success',
    },
    data: user,
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: userResponse.meta.code,
    body: userResponse,
  });

  return of(response).pipe(delay(generateRandDebounceTime(1000, 2000)));
};

const handleDeleteUser = (
  req: HttpRequest<unknown>,
): Observable<HttpResponse<ApiResponse<void>>> => {
  const id = req.params.get('id');

  if (id) {
    inject(StoreService).removeUser(id);
  }

  const userResponse: ApiResponse<void> = {
    meta: {
      code: HttpStatusCode.Ok,
      message: 'Successfully deletion',
    },
    data: null,
  };

  const response = new HttpResponse<ApiResponse<void>>({
    status: userResponse.meta.code,
    body: userResponse,
  });

  return of(response).pipe(delay(generateRandDebounceTime(500, 1000)));
};

const handleUpdateUser = (
  req: HttpRequest<unknown>,
): Observable<HttpResponse<ApiResponse<UserModel>>> => {
  const user = <UserModel>req.body;
  inject(StoreService).setUser(user);

  const userResponse: ApiResponse<UserModel> = {
    meta: {
      code: HttpStatusCode.Ok,
      message: 'Success',
    },
    data: user,
  };

  const response = new HttpResponse<ApiResponse<UserModel>>({
    status: userResponse.meta.code,
    body: userResponse,
  });

  return of(response).pipe(delay(generateRandDebounceTime(1000, 2000)));
};

const generateRandDebounceTime = (min: number, max: number): number => {
  if (min > max) {
    return 500;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandID = (): string => {
  return (
    'id-' +
    Math.random().toString(36).slice(2, 11) +
    '-' +
    Date.now().toString(36)
  );
};
