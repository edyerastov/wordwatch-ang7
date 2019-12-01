import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSizePickerComponent } from './page-size-picker.component';

describe('PageSizePickerComponent', () => {
  let component: PageSizePickerComponent;
  let fixture: ComponentFixture<PageSizePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageSizePickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSizePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
