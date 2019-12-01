import { Component } from '@angular/core';
import { StorageRulesService } from '../services/storage-rules.service';
import { tap, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { IStorageRuleDetailsResponse } from '../storage-rules.model';

@Component({
  selector: 'app-storage-rule-enable',
  templateUrl: './storage-rule-enable.component.html',
  styleUrls: ['./storage-rule-enable.component.scss']
})
export class StorageRuleEnableComponent {
  public storageRuleDetails: any = {};
  private storageRuleID = '';
  private routerSubscriber: any;

  constructor(private storageRulesService: StorageRulesService, private router: Router, private route: ActivatedRoute) {
    this.routerSubscriber = this.route.parent.params.subscribe((params: { [x: string]: string }) => {
      this.storageRuleID = params['id'];
      if (this.storageRuleID !== undefined) {
        this.getStorageRuleDetails();
      }
    });
  }

  getStorageRuleDetails(): void {
    this.storageRulesService
      .getRuleDetails(this.storageRuleID)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.storageRuleDetails = data;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onStorageRuleUpdate(isActive: boolean): void {
    this.storageRuleDetails.active = isActive;
    this.storageRulesService
      .updateStorageRuleDetails(this.storageRuleID, this.storageRulesService.generateToPutData(this.storageRuleDetails))
      .subscribe((data: any) => {
        this.storageRulesService.sendUpdate({ state: true, active: isActive });
        this.router.navigate(['/storage/selected/' + this.storageRuleID + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }

  back() {
    this.router.navigate(['/storage/selected/' + this.storageRuleID + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
