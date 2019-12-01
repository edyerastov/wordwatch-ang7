import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleEditTargetsComponent } from './storage-rule-edit-targets.component';

describe('StorageRuleEditTargetsComponent', () => {
  let component: StorageRuleEditTargetsComponent;
  let fixture: ComponentFixture<StorageRuleEditTargetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleEditTargetsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleEditTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
