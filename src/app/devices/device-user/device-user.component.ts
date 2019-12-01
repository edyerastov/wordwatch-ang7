import { Component, Input, OnInit } from '@angular/core';
import { DeviceService } from '@app/devices/services/device.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '@app/users/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-device-user',
  templateUrl: './device-user.component.html',
  styleUrls: ['./device-user.component.scss']
})
export class DeviceUserComponent implements OnInit {
  public user: any;
  private deviceId: string = '';
  private routerSubscriber: any;
  public readonly: boolean = false;
  public showUser: boolean = false;
  public addUserForm: FormGroup;

  public userSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.deviceId = params['id'];
      this.getUser(this.deviceId);
    });
  }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      user: null,
      userSearch: null
    });
  }

  onUserNameChange(obj: any): void {
    this.deviceService.addUser(this.deviceId, obj.id).subscribe(data => {
      this.user = obj;
      this.showUser = true;
      this.deviceService.sendUpdate({ state: true, user: true, userFullName: this.user.fullName });
    });
  }

  getUser(obj: any): void {
    this.deviceService
      .getDeviceDetails(this.deviceId)
      .pipe(
        tap((data: any) => {
          this.user = data._embedded.user;
          if (this.user !== null) {
            this.showUser = true;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  deleteUser() {
    this.userService
      .deleteUserDevice(this.deviceId)
      .pipe(
        tap((data: any) => {
          this.user = null;
          this.showUser = false;
        }),
        finalize(() => {})
      )
      .subscribe(data => {
        this.deviceService.sendUpdate({ state: true, user: false, userFullName: null });
      });
  }
}
