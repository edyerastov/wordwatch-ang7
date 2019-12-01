import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionPickerComponent } from './retention-picker.component';

describe('RetentionPickerComponent', () => {
  let component: RetentionPickerComponent;
  let fixture: ComponentFixture<RetentionPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
