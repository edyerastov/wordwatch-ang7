import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeviceService } from '@app/devices/services/device.service';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { Subject } from 'rxjs';
import { UserService } from '@app/users/services/user.service';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-search-profile-select',
  templateUrl: './search-profile-select.component.html',
  styleUrls: ['./search-profile-select.component.scss']
})
export class SearchProfileSelectComponent implements OnInit {
  @Input() options: any = null;
  @Input() deviceIdList: Array<any> = [];
  @Input() userIdList: Array<any> = [];
  @Input() groupIdList: Array<any> = [];
  @Input() devices: Array<any> = [];
  @Input() users: Array<any> = [];
  @Input() groups: Array<any> = [];
  @Input() group: FormGroup;
  public onInputSearch: Subject<string> = new Subject();
  public searchStr: string = '';
  public deviceList: Array<any> = [];
  public userList: Array<any> = [];
  public groupList: Array<any> = [];
  public device: any;
  public roleNewPicker: FormGroup;

  public readonly: boolean = false;
  public paginationInfo = new PaginationInfo();

  public nameSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    router: Router,
    route: ActivatedRoute,
    private deviceService: DeviceService,
    private userService: UserService,
    private groupService: GroupService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.roleNewPicker = this.fb.group({
      devices: [null],
      groups: [null],
      user: [null],
      userSearch: null,
      deviceSearch: null,
      groupSearch: null
    });
  }

  onAddDevice(data: any): void {
    this.deviceService.sendUpdate({ state: true });
    this.devices.push(data);
    this.deviceIdList.push(data.id);
  }

  onAddGroup(data: any): void {
    this.groupService.sendUpdate({ state: true });
    this.groups.push(data);
    this.groupIdList.push(data.id);
  }

  onAddUser(data: any): void {
    this.userService.sendUpdate({ state: true });
    this.users.push(data);
    this.userIdList.push(data.id);
  }

  deleteDevice(index: number) {
    this.devices.splice(index, 1);
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
  }

  deleteGroup(index: number) {
    this.groups.splice(index, 1);
  }
}
