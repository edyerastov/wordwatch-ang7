import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '@app/devices/services/device.service';
import { Subscription } from 'rxjs';
import { Shell } from '@app/shell/shell.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-device-rename',
  templateUrl: './device-rename.component.html',
  styleUrls: ['./device-rename.component.scss']
})
export class DeviceRenameComponent implements OnInit, OnDestroy, DoCheck {
  public showCancelConfirmation = false;
  public subscription: Subscription;

  public renameDeviceForm: FormGroup;
  public deviceName: string;
  public defaultDeviceName = '';
  private deviceId = '';
  private routerSubscriber: any;
  public formValid: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private shellService: Shell
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.deviceId = params['id'];
      this.deviceName = '';
      if (this.deviceId !== undefined) {
        this.getDeviceName();
      }
      this.subscription = this.shellService.getConfirmation().subscribe(message => {
        this.showCancelConfirmation = message;
      });
    });
  }

  ngOnInit() {
    this.renameDeviceForm = this.fb.group({
      deviceName: [null, [Validators.required]]
    });

    this.getDeviceName();

    setTimeout(() => {
      this.defaultDeviceName = this.renameDeviceForm.value.deviceName;
    }, 300);
  }

  ngDoCheck(): void {
    if (this.defaultDeviceName !== this.renameDeviceForm.value.deviceName) {
      this.formValid = false;
    } else if (this.defaultDeviceName === this.renameDeviceForm.value.deviceName) {
      this.formValid = true;
    }
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (this.router.url.includes('/devices/selected/') && this.router.url.includes('/rename')) {
      return;
    }
  }

  getDeviceName(): void {
    this.deviceService
      .getDeviceDetails(this.deviceId)
      .pipe(
        tap((data: any) => {
          this.deviceName = data.name;
          this.renameDeviceForm.controls.deviceName.setValue(data.name);
          if (this.defaultDeviceName === null) {
            this.defaultDeviceName = this.deviceName;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onUserUpdate() {
    this.deviceName = this.renameDeviceForm.value.deviceName;

    this.deviceService.updateDeviceDetails(this.deviceId, { name: this.deviceName }).subscribe((data: any) => {
      this.deviceService.sendUpdate({ state: true, name: this.deviceName });
      this.router.navigate(['/devices/selected/' + this.deviceId + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }

  onCancel() {
    if (this.router.url === `/devices/selected/${this.deviceId}/rename`) {
      console.log(this.deviceName + ' + ' + this.defaultDeviceName);
      if (this.deviceName === this.defaultDeviceName) {
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
