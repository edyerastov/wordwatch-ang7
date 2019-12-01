import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectedComponent } from './location-selected.component';

describe('LocationSelectedComponent', () => {
  let component: LocationSelectedComponent;
  let fixture: ComponentFixture<LocationSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSelectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
