import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-delete',
  templateUrl: './retention-delete.component.html',
  styleUrls: ['./retention-delete.component.scss']
})
export class RetentionDeleteComponent implements OnDestroy {
  public retentionID = '';
  public retentionName: any = '';
  public routerSubscriber: any;

  constructor(private route: ActivatedRoute, private retentionService: RetentionService, public router: Router) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.retentionID = params['id'];
      if (this.retentionID !== undefined) {
        this.getRetentionName();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

  getRetentionName(): void {
    this.retentionService
      .getRetentionDetails(this.retentionID)
      .pipe(
        tap((data: any) => {
          this.retentionName = data.name;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onRetentionDelete(): void {
    if (this.retentionID) {
      this.retentionService
        .deleteRetention(this.retentionID)
        .pipe(
          tap((data: any) => {
            this.retentionService.sendUpdate({ state: true, deleted: true });
            this.router.navigate(['/retention'], { relativeTo: this.route, skipLocationChange: true });
          }),
          finalize(() => {})
        )
        .subscribe();
    }
  }

  onCancel(): void {
    this.router.navigate(['/retention/selected/' + this.retentionID + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
