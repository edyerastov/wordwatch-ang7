import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfileSelectComponent } from './search-profile-select.component';

describe('SearchProfileSelectComponent', () => {
  let component: SearchProfileSelectComponent;
  let fixture: ComponentFixture<SearchProfileSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchProfileSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProfileSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
