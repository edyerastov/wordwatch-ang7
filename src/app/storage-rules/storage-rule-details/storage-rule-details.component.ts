import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageRulesService } from '../services/storage-rules.service';
import { tap, finalize } from 'rxjs/operators';
import { IStorageRuleDetailsResponse, IDevice, IGroup, IUser } from '../storage-rules.model';
import { STORAGE_LOCATIONS_TYPES } from '@app/storage-locations/locations.model';

@Component({
  selector: 'app-storage-rule-details',
  templateUrl: './storage-rule-details.component.html',
  styleUrls: ['./storage-rule-details.component.scss']
})
export class StorageRuleDetailsComponent implements OnDestroy {
  public locations: Array<any> = [];
  public devices: IDevice[] = [];
  public groups: IGroup[] = [];
  public users: IUser[] = [];
  public isDefault = true;
  public locationsTypes = STORAGE_LOCATIONS_TYPES;
  private locationId = '';
  private routerSubscriber: any;

  constructor(private route: ActivatedRoute, private storageRulesService: StorageRulesService) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.getLocationRuleDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscriber.unsubscribe();
  }

  getLocationRuleDetails(): void {
    this.storageRulesService
      .getRuleDetails(this.locationId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.locations = data._embedded.locations;
          if (!data.isDefault) {
            this.isDefault = false;
            this.devices = data._embedded.targets._embedded.devices;
            this.groups = data._embedded.targets._embedded.groups;
            this.users = data._embedded.targets._embedded.users;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
