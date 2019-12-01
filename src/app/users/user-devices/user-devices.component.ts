import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-devices',
  templateUrl: './user-devices.component.html',
  styleUrls: ['./user-devices.component.scss']
})
export class UserDevicesComponent implements OnInit {
  @Input() deviceIdList: Array<any> = [];
  @Input() devices: Array<any> = [];

  private userId: string = '';
  private routerSubscriber: any;
  public userDevicesForm: FormGroup;
  public readonly: boolean = false;
  public userDevicesList: Array<any> = [];

  public userSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(private userService: UserService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.userId = params['id'];
      this.getUserDevices(this.userId);
    });
  }

  ngOnInit() {
    this.userDevicesForm = this.fb.group({
      userDevices: null,
      userDevicesSearch: null
    });
  }

  onAddDevice(device: any): void {
    this.userService
      .putUserDevice(device.id, this.userId)
      .pipe(
        tap((data: any) => {
          this.devices.push(device);
          this.deviceIdList.push(device.id);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  deleteDevice(index: number, id: string) {
    this.userService
      .deleteUserDevice(id)
      .pipe(
        tap((data: any) => {
          this.devices.splice(index, 1);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  getUserDevices(obj: any): void {
    this.userService
      .getUserDevices(this.userId)
      .pipe(
        tap((data: any) => {
          this.devices = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              name: item.name
            };
          });
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
