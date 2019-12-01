import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfilePickerComponent } from './search-profile-picker.component';

describe('SearchProfilePickerComponent', () => {
  let component: SearchProfilePickerComponent;
  let fixture: ComponentFixture<SearchProfilePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchProfilePickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProfilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
