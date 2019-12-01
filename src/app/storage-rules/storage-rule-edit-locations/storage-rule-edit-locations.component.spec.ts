import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageRuleEditLocationsComponent } from './storage-rule-edit-locations.component';

describe('StorageRuleEditLocationsComponent', () => {
  let component: StorageRuleEditLocationsComponent;
  let fixture: ComponentFixture<StorageRuleEditLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StorageRuleEditLocationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageRuleEditLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
