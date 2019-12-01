import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '@app/devices/services/device.service';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '@app/users/services/user.service';

@Component({
  selector: 'app-device-new',
  templateUrl: './device-new.component.html',
  styleUrls: ['./device-new.component.scss']
})
export class DeviceNewComponent implements OnInit {
  public deviceNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public deviceDetails: any = {};
  public userId: any;

  public roleSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Device Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private userService: UserService,
    public shellService: Shell
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.deviceNewForm = this.fb.group({
      deviceName: [null, [Validators.maxLength(32), Validators.required]],
      user: null,
      userSearch: null
    });
  }

  onUserChange(e: any) {
    this.userService
      .getUserDetails(e.id)
      .pipe(
        tap((data: any) => {
          this.userId = data.id;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onUserClear(e: Event) {}

  confirm() {
    if (this.shellService.isPrevRoute) {
      this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/devices');
    }
    this.shellService.setConfirmation(false, '/home');
  }

  onCancel() {
    if (this.router.url === '/newDevice') {
      if (this.deviceNewForm.value.deviceName !== null || this.deviceNewForm.value.user !== null) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/devices');
      }
    }
  }

  onDeviceCreate() {
    this.deviceDetails = {
      name: this.deviceNewForm.value.deviceName
    };

    this.deviceService.newDevice(this.deviceDetails).subscribe(
      (data: any) => {
        this.deviceService.addUser(data.id, this.userId).subscribe(
          (userData: any) => {
            this.router.navigate(['../devices'], {
              replaceUrl: true
            });
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }
}
