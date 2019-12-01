import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocationsService } from '@app/storage-locations/services/locations.service';
import { STORAGE_LOCATIONS_TYPES } from '@app/storage-locations/locations.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Input() locations: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() group: FormGroup;
  @Input() options: any = null;
  @Output() changeLocations: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearLocations: EventEmitter<any> = new EventEmitter<any>();

  public locationsList: Array<any> = [];
  public searchStr = '';
  public onInputSearch: Subject<string> = new Subject();
  public locationsListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;
  public STORAGE_LOCATIONS_TYPES = STORAGE_LOCATIONS_TYPES;

  constructor(private locationsService: LocationsService) {}

  ngOnInit(): void {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(() => {
      this.locationsListBuffer = [];
      this.getLocations({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  onLocationSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.locationsListBuffer = [];
          this.getLocations({ query: this.searchStr, page: 0, _: 1558087664383 });
        }, 0);
      } else {
        if (data.name && data.id) {
          this.locationsService.sendUpdate({ state: true });
          this.changeLocations.emit(data);
          this.searchStr = '';
        }
      }
    }
  }

  onLocationClear() {
    this.clearLocations.emit();
  }

  onScrollToEnd() {
    if (this.loading || this.locationsList.length < 25) {
      return;
    }

    this.page++;
    this.getLocations({ query: this.searchStr, page: this.page, _: 1558087664383 });
  }

  getLocations(obj: any): void {
    this.loading = true;
    this.locationsService
      .getLocationsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.locationsList = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              type: item.type
            };
          });
          this.locationsListBuffer = this.locationsListBuffer.concat(this.locationsList);
          this.loading = false;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
