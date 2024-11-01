import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserModel } from '@interfaces';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const mockUser: UserModel = {
    id: '1',
    username: 'alik',
    email: 'asdkasl@asdas.das',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add user modal', () => {
    spyOn(component.isAddUserModalOpen, 'next');

    component.openAddUserModal();

    expect(component.isAddUserModalOpen.next).toHaveBeenCalledWith(true);
  });

  it('should add user to the users list', () => {
    component.users = [mockUser];

    const newUser: UserModel = {
      id: '2',
      username: 'grisha',
      email: 'sdkfsdl@sadasd.asds',
    };
    component.addUser(newUser);

    expect(component.users).toEqual([newUser, mockUser]);
  });
});
