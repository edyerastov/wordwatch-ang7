import { Component, OnDestroy } from '@angular/core';
import { LocationsService } from '../services/locations.service';
import { ActivatedRoute } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnDestroy {
  public locationDetails: any = {};
  public locationConfiguration: any = {};
  public baseLocationConfiguration: any = {
    username: '',
    rootPath: '',
    password: ''
  };
  private locationId = '';
  private routerSubscriber: any;

  constructor(private route: ActivatedRoute, private locationsService: LocationsService) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.getLocationDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscriber.unsubscribe();
  }

  getLocationDetails(): void {
    this.locationsService
      .getLocationDetails(this.locationId)
      .pipe(
        tap((data: any) => {
          this.locationDetails = data;
          this.locationConfiguration = Object.assign(this.baseLocationConfiguration, data.configuration);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
