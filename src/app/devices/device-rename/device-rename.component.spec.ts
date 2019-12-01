import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRenameComponent } from './device-rename.component';

describe('DeviceRenameComponent', () => {
  let component: DeviceRenameComponent;
  let fixture: ComponentFixture<DeviceRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceRenameComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
