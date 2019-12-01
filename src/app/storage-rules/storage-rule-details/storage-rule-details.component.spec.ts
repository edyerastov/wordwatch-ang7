import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleDetailsComponent } from './storage-rule-details.component';

describe('StorageRuleDetailsComponent', () => {
  let component: StorageRuleDetailsComponent;
  let fixture: ComponentFixture<StorageRuleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
