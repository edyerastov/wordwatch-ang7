import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionDeleteComponent } from './retention-delete.component';

describe('RetentionDeleteComponent', () => {
  let component: RetentionDeleteComponent;
  let fixture: ComponentFixture<RetentionDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
