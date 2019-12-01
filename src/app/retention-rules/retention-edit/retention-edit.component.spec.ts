import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionEditComponent } from './retention-edit.component';

describe('RetentionEditComponent', () => {
  let component: RetentionEditComponent;
  let fixture: ComponentFixture<RetentionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
