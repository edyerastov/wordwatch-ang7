import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionDetailsComponent } from './retention-details.component';

describe('RetentionDetailsComponent', () => {
  let component: RetentionDetailsComponent;
  let fixture: ComponentFixture<RetentionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
