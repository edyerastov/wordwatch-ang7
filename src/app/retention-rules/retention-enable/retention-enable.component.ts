import { Component } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { RetentionService } from '@app/retention-rules/services/retention.service';
import { IStorageRuleDetailsResponse } from '@app/storage-rules/storage-rules.model';

@Component({
  selector: 'app-retention-enable',
  templateUrl: './retention-enable.component.html',
  styleUrls: ['./retention-enable.component.scss']
})
export class RetentionEnableComponent {
  public retentionDetails: any = {};
  private retentionID = '';
  private routerSubscriber: any;

  constructor(private retentionService: RetentionService, private router: Router, private route: ActivatedRoute) {
    this.routerSubscriber = this.route.parent.params.subscribe((params: { [x: string]: string }) => {
      this.retentionID = params['id'];
      if (this.retentionID !== undefined) {
        this.getRetentionDetails();
      }
    });
  }

  getRetentionDetails(): void {
    this.retentionService
      .getRetentionDetails(this.retentionID)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.retentionDetails = data;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onRetentionUpdate(isActive: boolean): void {
    this.retentionDetails.active = isActive;
    this.retentionService
      .updateRetentionDetails(this.retentionID, this.retentionService.generateToPutData(this.retentionDetails))
      .subscribe((data: any) => {
        this.retentionService.sendUpdate({ state: true, active: isActive });
        this.router.navigate(['/retention/selected/' + this.retentionID + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }

  back() {
    this.router.navigate(['/retention/selected/' + this.retentionID + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
