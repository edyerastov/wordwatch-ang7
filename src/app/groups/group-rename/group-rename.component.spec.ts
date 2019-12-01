import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRenameComponent } from './group-rename.component';

describe('GroupRenameComponent', () => {
  let component: GroupRenameComponent;
  let fixture: ComponentFixture<GroupRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRenameComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
