import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserModalComponent } from './add-user-modal.component';

describe('UserAddModalComponent', () => {
  let component: AddUserModalComponent;
  let fixture: ComponentFixture<AddUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
