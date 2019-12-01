import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ɵunv } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '@app/devices/services/device.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-device-picker',
  templateUrl: './device-picker.component.html',
  styleUrls: ['./device-picker.component.scss']
})
export class DevicePickerComponent implements OnInit, OnChanges {
  @Input() devices: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChangeDevices: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearDevices: EventEmitter<any> = new EventEmitter<any>();

  public deviceList: Array<any> = [];
  public searchStr = '';
  public deviceStr: any = null;
  public onInputSearch: Subject<string> = new Subject();

  public deviceListBuffer: Array<any[]> = [];
  public deviceListObserve: Subject<Array<any[]>> = new Subject();
  public loading = false;
  public page = 0;

  constructor(router: Router, route: ActivatedRoute, private deviceService: DeviceService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.deviceListBuffer = [];
      this.getDevices({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  onDeviceSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus' && this.deviceListBuffer.length === 0) {
        setTimeout(() => {
          this.getDevices({ query: this.searchStr, page: this.page, _: 1558087664383 });
        }, 400);
      } else {
        if (data.name && data.id) {
          this.onChangeDevices.emit(data);
          this.searchStr = '';
        }
      }
    }
    this.deviceStr = null;
  }

  onDeviceClear(event: any) {
    this.onClearDevices.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.deviceList.length < 25) {
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.getDevices({ query: this.searchStr, page: this.page, _: 1558087664383 });
    }, 0);
  }

  getDevices(obj: any): void {
    this.loading = true;
    this.deviceService
      .getDevicesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.deviceList = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              isAllocated: item.isAllocated,
              userFullName: item.userFullName,
              userId: item.userId
            };
          });
          this.deviceListBuffer = this.deviceListBuffer.concat(this.deviceList);
          this.deviceListObserve.next(this.deviceListBuffer);
          this.loading = false;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
