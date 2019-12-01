import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '@app/devices/services/device.service';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { UserService } from '@app/users/services/user.service';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
  styles: [
    `
      .angle-hided {
        display: none;
      }
    `
  ]
})
export class DevicesListComponent implements OnInit, OnDestroy {
  public list = new BehaviorSubject({ selected: null });
  public deviceListForm: FormGroup;
  public deviceList: Array<any> = [];
  public unsubscribe$ = new Subject<void>();
  public deviceItemSelected: any = null;
  public selectedUser: any = {};
  public selectedDevice: any = {};
  public deviceAllocated: boolean;
  public reverseUserList: boolean = false;
  public selectedRowId: string;

  public subscription: Subscription;

  public paginationInfo = new PaginationInfo();

  public userSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  public headers = [
    {
      name: 'DEVICE_NAME',
      sort: false,
      reverseUserList: false,
      orderBy: 'UserFullName'
    },
    {
      name: 'OWNER',
      sort: false,
      reverseUserList: false,
      orderBy: 'UserName'
    },
    {
      name: 'ALLOCATED',
      sort: false,
      reverseUserList: false,
      orderBy: 'Email'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.subscription = deviceService.getUpdate().subscribe(device => {
      if (device.state) {
        if (device.name !== undefined) {
          this.deviceItemSelected.name = device.name;
        }
        if (device.user !== undefined) {
          this.deviceItemSelected.isAllocated = device.user;
        }
        if (device.userFullName !== undefined) {
          this.deviceItemSelected.userFullName = device.userFullName;
        }
      }
    });
  }

  ngOnInit() {
    this.deviceListForm = this.fb.group({
      user: null,
      userSearch: null,
      devices: null,
      deviceSearch: null,
      allocated: null
    });

    this.getDevicesByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.deviceItemSelected = null;
      } else {
        this.deviceItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  add() {
    this.router.navigate(['/newDevice'], { replaceUrl: true });
  }

  // To handle name selection change event
  onUserNameChange(obj: any): void {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedUser = obj;
    this.getDevicesByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onUserNameClear(): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedUser = {};
    this.getDevicesByPrm(this.getFilteredObj());
  }

  // To handle name selection change event
  onDeviceNameChange(obj: any): void {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedDevice = obj;
    this.getDevicesByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onDeviceNameClear(): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedDevice = {};
    this.getDevicesByPrm(this.getFilteredObj());
  }

  onStatusChange(obj: any): void {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    this.getDevicesByPrm(this.getFilteredObj());
  }

  onSearch() {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    if (this.selectedUser) {
      this.onUserNameChange(this.selectedUser);
    }
    if (this.selectedDevice) {
      this.onDeviceNameChange(this.selectedDevice);
    }
    if (this.deviceListForm.value.allocated !== null) {
      this.getDevicesByPrm(this.getFilteredObj());
    }
  }

  clear() {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    this.deviceListForm.reset();
    this.onUserNameClear();
    this.onDeviceNameClear();
    this.userService.sendUpdate({ clearSearch: true });
  }

  // To get users list based on prm
  getDevicesByPrm(obj: any): void {
    this.deviceService
      .getDevicesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.paginationInfo = (({ pageNumber, pageSize, totalPages, totalResults }) => ({
            pageNumber,
            pageSize,
            totalPages,
            totalResults
          }))(data);
        }),
        takeUntil(this.unsubscribe$),
        finalize(() => {})
      )
      .subscribe(data => (this.deviceList = data['_embedded']['collection']));
  }

  // To set filtered object data
  getFilteredObj(): Object {
    setTimeout(() => {
      this.deviceItemSelected = null;
    }, 0);
    const obj: any = {};
    obj.ascending = this.reverseUserList === false;
    if (this.selectedUser.id) {
      obj.userId = this.selectedUser.id;
    }
    if (this.selectedDevice.id) {
      obj.deviceId = this.selectedDevice.id;
    }
    if (this.deviceListForm.value.allocated !== null) {
      obj.deviceAllocated = this.deviceListForm.value.allocated;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  // TO handle row click event
  onRowSelect(item: any) {
    this.selectedRowId = item.id;
    if (this.deviceItemSelected === item) {
      setTimeout(() => {
        this.deviceItemSelected = null;
      }, 0);
    } else {
      this.deviceItemSelected = null;
      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/devices/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
    console.log(this.list);
  }

  // To handle pagination page change event(next and previous)
  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }
    this.getDevicesByPrm(this.getFilteredObj());
  }

  // To handle page number change event
  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;
    this.getDevicesByPrm(this.getFilteredObj());
  }

  downloadCsv() {
    FileSaver.saveAs('/api/devices.csv', 'users.csv');
  }
}
