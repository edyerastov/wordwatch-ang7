import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceUserComponent } from './device-user.component';

describe('DeviceUserComponent', () => {
  let component: DeviceUserComponent;
  let fixture: ComponentFixture<DeviceUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceUserComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
