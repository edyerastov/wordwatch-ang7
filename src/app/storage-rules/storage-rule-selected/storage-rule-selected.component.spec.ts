import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleSelectedComponent } from './storage-rule-selected.component';

describe('StorageRuleSelectedComponent', () => {
  let component: StorageRuleSelectedComponent;
  let fixture: ComponentFixture<StorageRuleSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleSelectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
