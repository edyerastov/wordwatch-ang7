import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { UserService } from '@app/users/services/user.service';
import { DeviceService } from '@app/devices/services/device.service';
import { GroupService } from '@app/groups/services/group.service';
import { tap, finalize } from 'rxjs/operators';
import { RetentionService } from '@app/retention-rules/services/retention.service';
import { IStorageRuleDetailsResponse } from '@app/storage-rules/storage-rules.model';

@Component({
  selector: 'app-retention-targets',
  templateUrl: './retention-targets.component.html',
  styleUrls: ['./retention-targets.component.scss']
})
export class RetentionTargetsComponent implements OnInit {
  public deviceList: Array<any> = [];
  public userList: Array<any> = [];
  public groupList: Array<any> = [];
  public deviceListId: Array<any> = [];
  public userListId: Array<any> = [];
  public groupListId: Array<any> = [];

  public subscription: Subscription;
  public userSubscription: Subscription;
  public deviceSubscription: Subscription;
  public groupsSubscription: Subscription;

  public state = false;
  public showCancelConfirmation = false;
  public retentionForm: FormGroup;

  private retentionId = '';
  private routerSubscriber: any;
  private retentionDetails: any = [];

  constructor(
    private route: ActivatedRoute,
    private retentionService: RetentionService,
    private router: Router,
    private shellService: Shell,
    private userService: UserService,
    private deviceService: DeviceService,
    private groupsService: GroupService,
    private fb: FormBuilder
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.retentionId = params['id'];
      this.retentionDetails = {};
      if (this.retentionId !== undefined) {
        this.getRetentionDetails();
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
    this.retentionForm = this.fb.group({
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
    this.deviceListId.push(data.id);
    this.deviceList.push(data);
  }

  onAddGroup(data: any): void {
    this.groupsService.sendUpdate({ state: true });
    this.groupListId.push(data.id);
    this.groupList.push(data);
  }

  onAddUser(data: any): void {
    this.userService.sendUpdate({ state: true });
    this.userListId.push(data.id);
    this.userList.push(data);
  }

  deleteDevice(index: number) {
    this.deviceList.splice(index, 1);
    this.deviceListId.splice(index, 1);
  }

  deleteUser(index: number) {
    this.userList.splice(index, 1);
    this.userListId.splice(index, 1);
  }

  deleteGroup(index: number) {
    this.groupList.splice(index, 1);
    this.groupListId.splice(index, 1);
  }

  onCancel() {
    if (this.router.url === `/retention/selected/${this.retentionId}/edit-targets`) {
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

  getRetentionDetails(): void {
    this.retentionService
      .getRetentionDetails(this.retentionId)
      .pipe(
        tap((data: IStorageRuleDetailsResponse) => {
          this.retentionDetails = data;
          const embeddedData = data._embedded.targets._embedded;
          this.deviceList = embeddedData.devices;
          this.userList = embeddedData.users;
          this.groupList = embeddedData.groups;
          this.deviceList.forEach(device => {
            this.deviceListId.push(device.id);
          });
          this.userList.forEach(user => {
            this.userListId.push(user.id);
          });
          this.groupList.forEach(group => {
            this.groupListId.push(group.id);
          });
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onRetentionUpdate(): void {
    const details = {
      name: this.retentionDetails.name,
      days: this.retentionDetails.days,
      targets: {
        devices: this.deviceListId,
        groups: this.groupListId,
        users: this.userListId
      }
    };
    this.retentionService.updateRetentionDetails(this.retentionId, details).subscribe((data: any) => {
      this.retentionService.sendUpdate({ state: true });
      this.router.navigate(['/retention/selected/' + this.retentionId + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }
}
