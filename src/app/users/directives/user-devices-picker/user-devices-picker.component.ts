import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeviceService } from '@app/devices/services/device.service';

@Component({
  selector: 'app-user-devices-picker',
  templateUrl: './user-devices-picker.component.html',
  styleUrls: ['./user-devices-picker.component.scss']
})
export class UserDevicesPickerComponent implements OnInit, OnChanges {
  @Input() userDevices: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChangeUserDevices: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearUserDevices: EventEmitter<any> = new EventEmitter<any>();

  public userDevicesList: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public userDevicesListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(router: Router, route: ActivatedRoute, private deviceService: DeviceService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.userDevicesListBuffer = [];
      this.getUserDevices({ query: this.searchStr, page: 0, allocated: false });
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  onUserChange(data: any): void {
    if (data !== undefined) {
      this.onChangeUserDevices.emit(data);
    }
  }

  onUserSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.getUserDevices({ query: this.searchStr, page: 0, allocated: false });
        }, 0);
      } else {
        if (data.userName && data.id) {
          this.onChangeUserDevices.emit(data);
        }
      }
    }
  }

  onUserClear(event: any) {
    this.onClearUserDevices.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.userDevicesList.length < 25) {
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    setTimeout(() => {
      this.getUserDevices({ query: this.searchStr, allocated: false, page: this.page });
      this.loading = false;
    }, 400);
  }

  getUserDevices(obj: any): void {
    this.deviceService
      .getDevicesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.userDevicesList = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              name: item.name
            };
          });
          console.log(this.userDevicesList);
          this.userDevicesListBuffer = this.userDevicesListBuffer.concat(this.userDevicesList);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
