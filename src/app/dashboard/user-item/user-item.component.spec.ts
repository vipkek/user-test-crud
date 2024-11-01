import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemComponent } from './user-item.component';
import { UserModel } from '@interfaces';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  const mockUser: UserModel = {
    id: '32878hajsd',
    username: 'alik',
    email: 'alik@asfds.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), UserItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username and email', () => {
    const usernameElement = <HTMLInputElement>(
      fixture.debugElement.query(By.css('[data-test-id="username"]'))
        .nativeElement
    );
    const emailElement = <HTMLInputElement>(
      fixture.debugElement.query(By.css('[data-test-id="email"]')).nativeElement
    );

    expect(usernameElement.textContent).toContain(mockUser.username);
    expect(emailElement.textContent).toContain(mockUser.email);
  });

  it('should have a RouterLink with the correct user id', () => {
    const usernameLink = fixture.debugElement.query(
      By.css('[data-test-id="username"]'),
    );
    const routerLink = usernameLink.attributes['ng-reflect-router-link'];

    expect(routerLink).toBe(`/user/${mockUser.id}`);
  });

  it('should emit deleteUser event when delete button is clicked', () => {
    spyOn(component.deleteUser, 'emit');

    const deleteButton = fixture.debugElement.query(By.css('.cross-btn'));
    deleteButton.triggerEventHandler('click', null);

    expect(component.deleteUser.emit).toHaveBeenCalled();
  });
});
