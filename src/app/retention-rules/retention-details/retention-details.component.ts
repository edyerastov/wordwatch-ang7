import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDevice, IGroup, IStorageRuleDetailsResponse, IUser } from '@app/storage-rules/storage-rules.model';
import { finalize, tap } from 'rxjs/operators';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-details',
  templateUrl: './retention-details.component.html',
  styleUrls: ['./retention-details.component.scss']
})
export class RetentionDetailsComponent implements OnDestroy {
  public devices: IDevice[] = [];
  public groups: IGroup[] = [];
  public users: IUser[] = [];
  public isDefault = true;
  private retentionId = '';
  private routerSubscriber: any;

  constructor(private route: ActivatedRoute, private retentionService: RetentionService) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.retentionId = params['id'];
      if (this.retentionId) {
        this.getLocationRuleDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscriber.unsubscribe();
  }

  getLocationRuleDetails(): void {
    this.retentionService
      .getRetentionDetails(this.retentionId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
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
