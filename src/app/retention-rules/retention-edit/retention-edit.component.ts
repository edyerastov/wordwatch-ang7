import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { RetentionService } from '@app/retention-rules/services/retention.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-retention-edit',
  templateUrl: './retention-edit.component.html',
  styleUrls: ['./retention-edit.component.scss']
})
export class RetentionEditComponent implements OnInit, DoCheck, OnDestroy {
  public showCancelConfirmation = false;
  public subscription: Subscription;
  public editRetentionForm: FormGroup;
  public defaultRetentionName = '';
  public defaultRetentionPeriod = 1;
  public isFormValid = true;
  public retentionDetails: any = {};
  private retentionId = '';
  private routerSubscriber: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private shellService: Shell,
    private retentionService: RetentionService
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.retentionId = params['id'];
      if (this.retentionId !== undefined) {
        this.getRetentionDetails();
      }
      this.subscription = this.shellService.getConfirmation().subscribe(isShow => {
        this.showCancelConfirmation = isShow;
      });
    });
  }

  ngOnInit() {
    this.editRetentionForm = this.fb.group({
      retentionName: [null, [Validators.required]],
      retentionPeriod: 1
    });

    this.getRetentionDetails();

    setTimeout(() => {
      this.defaultRetentionName = this.editRetentionForm.value.retentionName;
      this.defaultRetentionPeriod = this.editRetentionForm.value.retentionPeriod;
    }, 300);
  }

  ngDoCheck(): void {
    if (
      this.defaultRetentionName !== this.editRetentionForm.value.retentionName ||
      this.defaultRetentionPeriod !== this.editRetentionForm.value.retentionPeriod
    ) {
      this.isFormValid = false;
    } else if (
      this.defaultRetentionName === this.editRetentionForm.value.retentionName &&
      this.defaultRetentionPeriod === this.editRetentionForm.value.retentionPeriod
    ) {
      this.isFormValid = true;
    }
  }

  ngOnDestroy(): void {
    this.routerSubscriber.unsubscribe();
    if (this.router.url.includes('/retention/selected/') && this.router.url.includes('/rename')) {
      return;
    }
  }

  getRetentionDetails(): void {
    this.retentionService
      .getRetentionDetails(this.retentionId)
      .pipe(
        tap(data => {
          this.retentionDetails = data;
          this.editRetentionForm.controls.retentionName.setValue(this.retentionDetails.name);
          this.editRetentionForm.controls.retentionPeriod.setValue(this.retentionDetails.days);
          if (this.defaultRetentionName === null) {
            this.defaultRetentionName = this.retentionDetails.name;
          }
          if (this.defaultRetentionPeriod === null) {
            this.defaultRetentionPeriod = this.retentionDetails.days;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onRetentionUpdate() {
    this.retentionService
      .updateRetentionDetails(this.retentionId, {
        name: this.editRetentionForm.value.retentionName,
        days: this.editRetentionForm.value.retentionPeriod,
        targets: this.retentionDetails._embedded.targets
      })
      .subscribe((data: any) => {
        this.retentionService.sendUpdate({
          state: true,
          name: this.retentionDetails.name,
          days: this.retentionDetails.days
        });
        this.router.navigate(['/retention/selected/' + this.retentionId + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }

  onCancel() {
    if (this.router.url === `/retention/selected/${this.retentionId}/edit`) {
      if (
        this.retentionDetails.name === this.defaultRetentionName &&
        this.retentionDetails.days === this.defaultRetentionPeriod
      ) {
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
