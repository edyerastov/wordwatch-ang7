import * as FileSaver from 'file-saver';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LocationsService } from '../services/locations.service';
import { tap, finalize } from 'rxjs/operators';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_LOCATIONS_TYPES } from '../locations.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent implements OnInit {
  public locationsListForm: FormGroup;
  public list = new BehaviorSubject({ selected: null });
  public locationsList: Array<any> = [];
  public paginationInfo = new PaginationInfo();
  public reverseLocationsListByName = false;
  public selectedLocation: any = {};
  public locationItemSelected: any = null;
  public sort = false;
  public STORAGE_LOCATIONS_TYPES = STORAGE_LOCATIONS_TYPES;
  public locationsTypesSelectOptions = {
    multiple: false,
    closeOnSelect: true,
    width: '100%',
    minimumResultsForSearch: -1
  };

  constructor(private router: Router, private locationsService: LocationsService, private fb: FormBuilder) {}

  ngOnInit() {
    this.locationsListForm = this.fb.group({
      locations: null,
      locationSearch: null,
      locationType: null
    });

    this.getLocationsByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.locationItemSelected = null;
      } else {
        this.locationItemSelected = this.list.getValue();
      }
    });
  }

  getLocationsByPrm(obj: any): void {
    this.locationsService
      .getLocationsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.locationsList = data['_embedded']['collection'];
          this.paginationInfo = (({ pageNumber, pageSize, totalPages, totalResults }) => ({
            pageNumber,
            pageSize,
            totalPages,
            totalResults
          }))(data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  getFilteredObj() {
    setTimeout(() => {
      this.locationItemSelected = null;
    }, 0);
    const obj: any = {};
    obj.ascending = this.reverseLocationsListByName === false;
    obj.orderBy = 'Name';
    if (this.selectedLocation.type) {
      obj.locationType = this.selectedLocation.type;
    }
    if (this.selectedLocation.id) {
      obj.locationId = this.selectedLocation.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  add() {
    this.router.navigate(['/newLocation'], { replaceUrl: true });
  }

  downloadCsv() {
    FileSaver.saveAs('/api/locations.csv', 'locations.csv');
  }

  clear() {
    setTimeout(() => {
      this.locationItemSelected = null;
    }, 0);
    this.locationsListForm.controls.locationSearch.reset();
    this.locationsListForm.controls.locationType.reset();
    this.locationsListForm.controls.locations.reset();
    this.sort = false;
    this.onLocationPickerClear();
  }

  onLocationPickerClear(): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedLocation = {};

    this.getLocationsByPrm(this.getFilteredObj());
  }

  onLocationsNameSelect(obj: any): void {
    setTimeout(() => {
      this.locationItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedLocation.id = obj.id;
    this.getLocationsByPrm(this.getFilteredObj());
  }

  onLocationsTypeSelect(obj: any): void {
    for (const type in STORAGE_LOCATIONS_TYPES) {
      if (STORAGE_LOCATIONS_TYPES[type] === obj) {
        setTimeout(() => {
          this.locationItemSelected = null;
        }, 0);
        this.paginationInfo.pageNumber = 0;
        this.selectedLocation.type = type;
        this.getLocationsByPrm(this.getFilteredObj());
        return;
      }
    }
  }

  onSearch() {
    setTimeout(() => {
      this.locationItemSelected = null;
    }, 0);

    this.getLocationsByPrm(this.getFilteredObj());
  }

  invertLocationsList() {
    if (this.sort === false) {
      this.sort = true;
      return;
    }
    this.reverseLocationsListByName = !this.reverseLocationsListByName;
    this.getLocationsByPrm(this.getFilteredObj());
  }

  onRowSelect(item: any) {
    if (this.locationItemSelected === item) {
      setTimeout(() => {
        this.locationItemSelected = null;
      }, 0);
    } else {
      this.locationItemSelected = null;

      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/locations/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true,
          queryParams: {
            type: item.type
          }
        });
      }, 0);
    }
  }

  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }

    this.getLocationsByPrm(this.getFilteredObj());
  }

  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;

    this.getLocationsByPrm(this.getFilteredObj());
  }
}
