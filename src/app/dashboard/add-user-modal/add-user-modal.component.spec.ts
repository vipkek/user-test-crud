import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AddUserModalComponent } from './add-user-modal.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

describe('UserAddModalComponent', () => {
  let component: AddUserModalComponent;
  let fixture: ComponentFixture<AddUserModalComponent>;
  let modalElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserModalComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserModalComponent);
    component = fixture.componentInstance;
    modalElement = fixture.debugElement.query(By.css('.modal'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have modal title "Add new user"', () => {
    const title = <HTMLDivElement>(
      modalElement.query(By.css('.modal-title')).nativeElement
    );
    expect(title.textContent).toContain('Add new user');
  });

  it('should initialize form controls for username and email', () => {
    expect(component.form.contains('username')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
  });

  it('should display validation error messages when form is dirty', fakeAsync(() => {
    const usernameInput = component.form.controls.username;
    usernameInput.markAsDirty();
    usernameInput.setErrors({ required: true });
    fixture.detectChanges();
    tick();

    const validationError = modalElement.query(By.css('div[validationError]'));
    expect(validationError).toBeTruthy();
  }));
});
