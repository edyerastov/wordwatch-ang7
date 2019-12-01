import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LocationsService } from '@app/storage-locations/services/locations.service';
import { StorageRulesService } from '@app/storage-rules/services/storage-rules.service';

@Component({
  selector: 'app-storage-rule-new',
  templateUrl: './storage-rule-new.component.html',
  styleUrls: ['./storage-rule-new.component.scss']
})
export class StorageRuleNewComponent implements OnInit {
  public devices: Array<any> = [];
  public users: Array<any> = [];
  public groups: Array<any> = [];
  public targets = {
    devices: Array(0),
    users: Array(0),
    groups: Array(0)
  };
  public ruleNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public locationDetails: any = {};
  public locationsId: Array<any> = [];
  public locations: Array<any> = [];

  public ruleSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Location',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public shellService: Shell,
    private ruleService: StorageRulesService,
    private locationsService: LocationsService
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.ruleNewForm = this.fb.group({
      ruleName: [null, [Validators.maxLength(32), Validators.required]],
      location: null,
      locationSearch: null,
      devices: null,
      deviceSearch: null,
      groups: null,
      groupSearch: null,
      user: null,
      userSearch: null
    });
  }

  onRuleCreate() {
    this.locationDetails = {
      locations: this.locationsId,
      name: this.ruleNewForm.value.ruleName,
      targets: {
        devices: this.targets.devices,
        groups: this.targets.groups,
        users: this.targets.users
      }
    };

    this.ruleService.newRule(this.locationDetails).subscribe(
      (data: any) => {
        this.router.navigate(['../storage'], {
          replaceUrl: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  onLocationChange(e: any) {
    this.locationsService
      .getLocationDetails(e.id)
      .pipe(
        tap((data: any) => {
          this.locationsId.push(data.id);
          this.locations.push(data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  deleteLocation(index: number) {
    this.locations.splice(index, 1);
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
    if (this.router.url === '/newDevice') {
      if (this.ruleNewForm.value.ruleName !== null || this.ruleNewForm.value.location !== null) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/storage');
      }
    }
  }
}
