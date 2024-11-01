import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { ApiResponse } from '@interfaces/api';
import { UserModel } from '@interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users (getUsers)', () => {
    const mockResponse: ApiResponse<UserModel[]> = {
      data: [
        { id: '1', username: 'borya', email: 'baskla@sadsa.asd' },
        { id: '2', username: 'alik', email: 'edsfds@sadsa.asd' },
      ],
      meta: {
        code: 200,
        message: 'Fetched successfully',
      },
    };

    service.getUsers().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.data?.length).toBe(2);
    });

    const req = httpMock.expectOne('api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a single user (getUser)', () => {
    const mockResponse: ApiResponse<UserModel> = {
      data: { id: '1', username: 'borya', email: 'baskla@sadsa.asd' },
      meta: {
        code: 200,
        message: 'User fetched',
      },
    };

    service.getUser('1').subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.data?.id).toBe('1');
    });

    const req = httpMock.expectOne('api/user?id=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a user (createUser)', () => {
    const user: UserModel = {
      id: '2',
      username: 'alik',
      email: 'edsfds@sadsa.asd',
    };
    const mockResponse: ApiResponse<UserModel> = {
      data: user,
      meta: {
        code: 201,
        message: 'User created',
      },
    };

    service.createUser(user).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.data?.username).toBe('alik');
    });

    const req = httpMock.expectOne('api/createUser');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(mockResponse);
  });

  it('should delete a user (deleteUser)', () => {
    const userId = '1';
    const mockResponse = 'User deleted successfully';

    service.deleteUser(userId).subscribe((response) => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne('api/deleteUser?id=1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should update a user (updateUser)', () => {
    const user: UserModel = {
      id: '2',
      username: 'alik',
      email: 'edsfds@sadsa.asd',
      additionalEmails: ['alik.alt@sdsds.com'],
    };
    const mockResponse: ApiResponse<UserModel> = {
      data: user,
      meta: {
        code: 200,
        message: 'User updated',
      },
    };

    service.updateUser(user).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(response.data?.additionalEmails).toContain('alik.alt@sdsds.com');
    });

    const req = httpMock.expectOne('api/updateUser');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(user);
    req.flush(mockResponse);
  });
});
