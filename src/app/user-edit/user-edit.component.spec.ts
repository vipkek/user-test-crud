import { UserEditComponent } from './user-edit.component';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { UserService } from '@services';
import { of } from 'rxjs';
import { ApiResponse, UserModel } from '@interfaces';

const mockUser: UserModel = {
  id: '1',
  username: 'grisha',
  email: 'grisha@asdajhjkas.asd',
  additionalEmails: ['fdgdf@sdfd.com', 'dfgdfg@sdfsd.com'],
};

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let userService: jasmine.SpyObj<UserService>;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', [
      'updateUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), UserEditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addEmail', () => {
    it('should add a new email form control', () => {
      const initialLength = component.emails.length;
      component.addEmail();
      fixture.detectChanges();

      expect(component.emails.length).toBe(initialLength + 1);
    });
  });

  describe('removeEmail', () => {
    it('should remove the specified email form control', () => {
      component.setEmails(['alik1@asdjaksds.asd', 'grisha@dfghjsadas.asd']);
      fixture.detectChanges();
      const initialLength = component.emails.length;

      component.removeEmail(0);
      fixture.detectChanges();

      expect(component.emails.length).toBe(initialLength - 1);
    });
  });

  describe('submit', () => {
    it('should call updateUser on submit', fakeAsync(() => {
      const mockApiResponse: ApiResponse<UserModel> = {
        data: mockUser,
        meta: { code: 200, message: 'Success' },
      };

      userService.updateUser.and.returnValue(of(mockApiResponse));
      component.form.get('username')?.setValue('UpdatedUser');
      component.form.get('email')?.setValue('updated@sdfsd.com');
      component.submit();

      tick();

      expect(userService.updateUser).toHaveBeenCalledWith(
        jasmine.objectContaining({
          username: 'UpdatedUser',
          email: 'updated@sdfsd.com',
        }),
      );
      tick(4000);
    }));
  });
});
