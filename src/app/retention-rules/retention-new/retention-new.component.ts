import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-new',
  templateUrl: './retention-new.component.html',
  styleUrls: ['./retention-new.component.scss']
})
export class RetentionNewComponent implements OnInit {
  public devices: Array<any> = [];
  public users: Array<any> = [];
  public groups: Array<any> = [];
  public targets = {
    devices: Array(0),
    users: Array(0),
    groups: Array(0)
  };
  public retentionNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public retentionDetails: any = [];

  constructor(
    private router: Router,
    private retentionService: RetentionService,
    private fb: FormBuilder,
    public shellService: Shell
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.retentionNewForm = this.fb.group({
      retentionName: [null, [Validators.maxLength(32), Validators.required]],
      retentionPeriod: null,
      devices: null,
      deviceSearch: null,
      groups: null,
      groupSearch: null,
      user: null,
      userSearch: null
    });
  }

  onRetentionCreate() {
    this.retentionDetails = {
      days: this.retentionNewForm.value.retentionPeriod,
      name: this.retentionNewForm.value.retentionName,
      targets: {
        devices: this.targets.devices,
        groups: this.targets.groups,
        users: this.targets.users
      }
    };

    this.retentionService.newRetention(this.retentionDetails).subscribe(
      (data: any) => {
        this.router.navigate(['../retention'], {
          replaceUrl: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  onAddDevice(data: any): void {
    this.devices.push(data);
    this.targets.devices.push(data.id);
  }

  onAddGroup(data: any): void {
    this.groups.push(data);
    this.targets.groups.push(data.id);
  }

  onAddUser(data: any): void {
    this.users.push(data);
    this.targets.users.push(data.id);
  }

  deleteDevice(index: number) {
    this.devices.splice(index, 1);
    this.targets.devices.splice(index, 1);
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.targets.users.splice(index, 1);
  }

  deleteGroup(index: number) {
    this.groups.splice(index, 1);
    this.targets.groups.splice(index, 1);
  }

  confirm() {
    if (this.shellService.isPrevRoute) {
      this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/storage');
    }
    this.shellService.setConfirmation(false, '/home');
  }

  onCancel() {
    if (this.router.url === '/newRetentionRule') {
      if (this.retentionNewForm.value.retentionName !== null || this.retentionNewForm.value.retentionPeriod !== null) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/retention');
      }
    }
  }
}
