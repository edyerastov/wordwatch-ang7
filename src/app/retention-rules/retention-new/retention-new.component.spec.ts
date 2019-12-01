import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionNewComponent } from './retention-new.component';

describe('RetentionNewComponent', () => {
  let component: RetentionNewComponent;
  let fixture: ComponentFixture<RetentionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetentionNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
