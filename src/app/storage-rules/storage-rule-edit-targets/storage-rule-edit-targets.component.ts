import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IStorageRuleDetailsResponse } from '../storage-rules.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageRulesService } from '../services/storage-rules.service';
import { Shell } from '@app/shell/shell.service';
import { UserService } from '@app/users/services/user.service';
import { DeviceService } from '@app/devices/services/device.service';
import { GroupService } from '@app/groups/services/group.service';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-storage-rule-edit-targets',
  templateUrl: './storage-rule-edit-targets.component.html',
  styleUrls: ['./storage-rule-edit-targets.component.scss']
})
export class StorageRuleEditTargetsComponent implements OnInit {
  public deviceList: Array<any> = [];
  public userList: Array<any> = [];
  public groupList: Array<any> = [];

  public subscription: Subscription;
  public userSubscription: Subscription;
  public deviceSubscription: Subscription;
  public groupsSubscription: Subscription;

  public state = false;
  public showCancelConfirmation = false;
  public storageRuleForm: FormGroup;

  private storageRuleId = '';
  private routerSubscriber: any;
  private storageRuleDetails: IStorageRuleDetailsResponse = {};

  constructor(
    private route: ActivatedRoute,
    private storageRulesService: StorageRulesService,
    private router: Router,
    private shellService: Shell,
    private userService: UserService,
    private deviceService: DeviceService,
    private groupsService: GroupService,
    private fb: FormBuilder
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.storageRuleId = params['id'];
      this.storageRuleDetails = {};
      if (this.storageRuleId !== undefined) {
        this.getStorageRuleDetails();
      }
    });
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
    this.userSubscription = userService.getUpdate().subscribe(user => {
      if (user.state) {
        this.state = true;
      }
    });
    this.deviceSubscription = deviceService.getUpdate().subscribe(device => {
      if (device.state) {
        this.state = true;
      }
    });
    this.groupsSubscription = groupsService.getUpdate().subscribe(group => {
      if (group.state) {
        this.state = true;
      }
    });
  }

  ngOnInit() {
    this.storageRuleForm = this.fb.group({
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
    this.deviceList.push(data);
  }

  onAddGroup(data: any): void {
    this.groupsService.sendUpdate({ state: true });
    this.groupList.push(data);
  }

  onAddUser(data: any): void {
    this.userService.sendUpdate({ state: true });
    this.userList.push(data);
  }

  deleteDevice(index: number) {
    this.deviceList.splice(index, 1);
  }

  deleteUser(index: number) {
    this.userList.splice(index, 1);
  }

  deleteGroup(index: number) {
    this.groupList.splice(index, 1);
  }

  onCancel() {
    if (this.router.url === `/storage/selected/${this.storageRuleId}/edit-targets`) {
      if (!this.state) {
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

  getStorageRuleDetails(): void {
    this.storageRulesService
      .getRuleDetails(this.storageRuleId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.storageRuleDetails = data;
          const embeddedData = data._embedded.targets._embedded;
          this.deviceList = embeddedData.devices;
          this.userList = embeddedData.users;
          this.groupList = embeddedData.groups;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onStorageRuleUpdate(): void {
    this.storageRulesService
      .updateStorageRuleDetails(this.storageRuleId, this.storageRulesService.generateToPutData(this.storageRuleDetails))
      .subscribe((data: any) => {
        this.storageRulesService.sendUpdate({ state: true });
        this.router.navigate(['/storage/selected/' + this.storageRuleId + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      });
  }
}
