import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionPickerComponent } from './permission-picker.component';

describe('PermissionPickerComponent', () => {
  let component: PermissionPickerComponent;
  let fixture: ComponentFixture<PermissionPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
