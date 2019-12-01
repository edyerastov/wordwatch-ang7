import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionEnableComponent } from './retention-enable.component';

describe('RetentionEnableComponent', () => {
  let component: RetentionEnableComponent;
  let fixture: ComponentFixture<RetentionEnableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionEnableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
