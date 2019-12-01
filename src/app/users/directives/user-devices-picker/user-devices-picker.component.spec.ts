import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDevicesPickerComponent } from './user-devices-picker.component';

describe('UserDevicesPickerComponent', () => {
  let component: UserDevicesPickerComponent;
  let fixture: ComponentFixture<UserDevicesPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDevicesPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDevicesPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
