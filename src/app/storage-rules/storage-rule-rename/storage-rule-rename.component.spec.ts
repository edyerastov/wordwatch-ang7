import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleRenameComponent } from './storage-rule-rename.component';

describe('StorageRuleRenameComponent', () => {
  let component: StorageRuleRenameComponent;
  let fixture: ComponentFixture<StorageRuleRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleRenameComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
