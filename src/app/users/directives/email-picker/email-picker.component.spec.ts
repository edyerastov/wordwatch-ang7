import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPickerComponent } from './email-picker.component';

describe('EmailPickerComponent', () => {
  let component: EmailPickerComponent;
  let fixture: ComponentFixture<EmailPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
