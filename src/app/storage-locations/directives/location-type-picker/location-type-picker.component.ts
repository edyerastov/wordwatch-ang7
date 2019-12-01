import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { STORAGE_LOCATIONS_TYPES } from '@app/storage-locations/locations.model';

@Component({
  selector: 'app-location-type-picker',
  templateUrl: './location-type-picker.component.html',
  styleUrls: ['./location-type-picker.component.scss']
})
export class LocationTypePickerComponent {
  @Input() options: any = null;
  @Input() selected: any = null;
  @Input() locationTypes: FormGroup;
  @Output() locationTypeCange: EventEmitter<any> = new EventEmitter<any>();
  @Output() locationTypeCLear: EventEmitter<any> = new EventEmitter<any>();

  public locationsTypes: Array<any> = [];
  public searchStr = '';
  public onInputSearch: Subject<string> = new Subject();

  constructor() {
    this.locationsTypes = Object.values(STORAGE_LOCATIONS_TYPES);
    this.onInputSearch.pipe(debounceTime(500)).subscribe(value => {});
  }

  onItemSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
      } else {
        if (data && typeof data === 'string') {
          this.locationTypeCange.emit(data);
        }
      }
    }
  }

  onItemClear() {
    this.locationTypeCLear.emit();
  }
}
