import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleDeleteComponent } from './storage-rule-delete.component';

describe('StorageRuleDeleteComponent', () => {
  let component: StorageRuleDeleteComponent;
  let fixture: ComponentFixture<StorageRuleDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
