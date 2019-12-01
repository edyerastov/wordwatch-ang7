import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionSelectedComponent } from './retention-selected.component';

describe('RetentionSelectedComponent', () => {
  let component: RetentionSelectedComponent;
  let fixture: ComponentFixture<RetentionSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionSelectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
