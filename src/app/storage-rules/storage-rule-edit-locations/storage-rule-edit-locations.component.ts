import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageRulesService } from '../services/storage-rules.service';
import { Shell } from '@app/shell/shell.service';
import { tap, finalize } from 'rxjs/operators';
import { IStorageRuleDetailsResponse } from '../storage-rules.model';
import { Subscription } from 'rxjs';
import { STORAGE_LOCATIONS_TYPES } from '@app/storage-locations/locations.model';
import { LocationsService } from '@app/storage-locations/services/locations.service';

@Component({
  selector: 'app-storage-rule-edit-locations',
  templateUrl: './storage-rule-edit-locations.component.html',
  styleUrls: ['./storage-rule-edit-locations.component.scss']
})
export class StorageRuleEditLocationsComponent implements OnInit, OnDestroy {
  public locationsListForm: FormGroup;
  public locations: Array<any>;
  public showCancelConfirmation = false;
  public state = false;
  public locationTypes = STORAGE_LOCATIONS_TYPES;
  private storageRuleId: string = null;
  private storageRuleDetails: IStorageRuleDetailsResponse = {};
  private routerSubscriber: any;
  private subscription: Subscription;
  private locationSubscription: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storageRulesService: StorageRulesService,
    private locationsServie: LocationsService,
    private shellService: Shell
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.storageRuleId = params['id'];
      if (this.storageRuleId !== undefined) {
        this.getStorageRuleDetails();
      }
      this.subscription = this.shellService.getConfirmation().subscribe(isShow => {
        this.showCancelConfirmation = isShow;
      });
    });
    this.locationSubscription = this.locationsServie.getUpdate().subscribe(user => {
      if (user.state) {
        this.state = user.state;
      }
    });
  }

  ngOnInit() {
    this.locationsListForm = this.fb.group({
      locationSearch: null,
      location: null
    });
  }

  ngOnDestroy(): void {
    this.routerSubscriber.unsubscribe();
    this.subscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }

  onLocationAdd(location: any): void {
    this.state = true;
    this.locations.push(location);
  }

  onLocationDelete(index: number): void {
    this.state = true;
    this.locations.splice(index, 1);
  }

  onStorageRuleUpdate(): void {
    this.storageRulesService
      .updateStorageRuleDetails(this.storageRuleId, this.storageRulesService.generateToPutData(this.storageRuleDetails))
      .subscribe((data: any) => {
        this.storageRulesService.sendUpdate({ state: true, name: this.storageRuleDetails.name });
        this.router.navigate(['/storage/selected/' + this.storageRuleId + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }

  onCancel() {
    if (this.router.url === `/storage/selected/${this.storageRuleId}/edit-locations`) {
      if (!this.state) {
        this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
        return;
      } else {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
        return false;
      }
    }
  }

  back() {
    this.shellService.changeState(true);
    this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
  }

  getStorageRuleDetails(): void {
    this.storageRulesService
      .getRuleDetails(this.storageRuleId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.storageRuleDetails = data;
          this.locations = data._embedded.locations;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
