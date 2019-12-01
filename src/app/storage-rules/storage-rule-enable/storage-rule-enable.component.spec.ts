import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleEnableComponent } from './storage-rule-enable.component';

describe('StorageRuleEnableComponent', () => {
  let component: StorageRuleEnableComponent;
  let fixture: ComponentFixture<StorageRuleEnableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleEnableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
