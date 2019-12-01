import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSelectedComponent } from './device-selected.component';

describe('DeviceSelectedComponent', () => {
  let component: DeviceSelectedComponent;
  let fixture: ComponentFixture<DeviceSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceSelectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
