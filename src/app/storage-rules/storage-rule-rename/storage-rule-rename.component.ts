import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { StorageRulesService } from '../services/storage-rules.service';
import { tap, finalize } from 'rxjs/operators';
import { IStorageRuleDetailsResponse } from '../storage-rules.model';

@Component({
  selector: 'app-storage-rule-rename',
  templateUrl: './storage-rule-rename.component.html',
  styleUrls: ['./storage-rule-rename.component.scss']
})
export class StorageRuleRenameComponent implements OnInit, OnDestroy, DoCheck {
  public showCancelConfirmation = false;
  public subscription: Subscription;
  public renameStorageRuleForm: FormGroup;
  public defaultstorageRuleName = '';
  public isFormValid = true;
  public storageRuleDetails: IStorageRuleDetailsResponse = {};
  private storageRuleId = '';
  private routerSubscriber: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storageRulesService: StorageRulesService,
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
  }

  ngOnInit() {
    this.renameStorageRuleForm = this.fb.group({
      storageRuleName: [null, [Validators.required]]
    });

    this.getStorageRuleDetails();

    setTimeout(() => {
      this.defaultstorageRuleName = this.renameStorageRuleForm.value.storageRuleName;
    }, 300);
  }

  ngDoCheck(): void {
    if (this.defaultstorageRuleName !== this.renameStorageRuleForm.value.storageRuleName) {
      this.isFormValid = false;
    } else if (this.defaultstorageRuleName === this.renameStorageRuleForm.value.storageRuleName) {
      this.isFormValid = true;
    }
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (this.router.url.includes('/storage/selected/') && this.router.url.includes('/rename')) {
      return;
    }
  }

  getStorageRuleDetails(): void {
    this.storageRulesService
      .getRuleDetails(this.storageRuleId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.storageRuleDetails = data;
          this.renameStorageRuleForm.controls.storageRuleName.setValue(data.name);
          if (this.defaultstorageRuleName === null) {
            this.defaultstorageRuleName = this.storageRuleDetails.name;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onStorageRuleUpdate() {
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
    if (this.router.url === `/storage/selected/${this.storageRuleId}/rename`) {
      if (this.storageRuleDetails.name === this.defaultstorageRuleName) {
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
}
