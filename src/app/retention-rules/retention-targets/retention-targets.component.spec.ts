import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionTargetsComponent } from './retention-targets.component';

describe('RetentionTargetsComponent', () => {
  let component: RetentionTargetsComponent;
  let fixture: ComponentFixture<RetentionTargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionTargetsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
