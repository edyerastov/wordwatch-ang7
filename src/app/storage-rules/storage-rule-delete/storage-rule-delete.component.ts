import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageRulesService } from '../services/storage-rules.service';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-storage-rule-delete',
  templateUrl: './storage-rule-delete.component.html',
  styleUrls: ['./storage-rule-delete.component.scss']
})
export class StorageRuleDeleteComponent implements OnDestroy {
  public locationRuleID = '';
  public ruleName: any = '';
  public routerSubscriber: any;

  constructor(private route: ActivatedRoute, private storageRulesService: StorageRulesService, public router: Router) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.locationRuleID = params['id'];
      if (this.locationRuleID !== undefined) {
        this.getLocationRuleName();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

  getLocationRuleName(): void {
    this.storageRulesService
      .getRuleDetails(this.locationRuleID)
      .pipe(
        tap((data: any) => {
          this.ruleName = data.name;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onLocationRuleDelete(): void {
    if (this.locationRuleID) {
      this.storageRulesService
        .deleteStorageRule(this.locationRuleID)
        .pipe(
          tap((data: any) => {
            this.storageRulesService.sendUpdate({ state: true, deleted: true });
            this.router.navigate(['/storage'], { relativeTo: this.route, skipLocationChange: true });
          }),
          finalize(() => {})
        )
        .subscribe();
    }
  }

  onCancel(): void {
    this.router.navigate(['/storage/selected/' + this.locationRuleID + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
