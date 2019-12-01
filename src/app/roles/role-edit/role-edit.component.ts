import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { RoleService } from '../services/role.service';
import { SecutiryService } from '@app/shared/services/security.service';
import { Shell } from '@app/shell/shell.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '@app/users/services/user.service';
import { DeviceService } from '@app/devices/services/device.service';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit, OnDestroy, DoCheck {
  public showCancelConfirmation = false;
  public subscription: Subscription;
  public userSubscription: Subscription;
  public deviceSubscription: Subscription;
  public groupsSubscription: Subscription;
  public schPrType = false;
  public roleDetails: any = {};
  public roleEditForm: FormGroup;
  private roleId = '';
  private routerSubscriber: any;
  public showProfileSelect = false;

  public deviceList: Array<any> = [];
  public deviceIdList: Array<any> = [];
  public userList: Array<any> = [];
  public userIdList: Array<any> = [];
  public groupList: Array<any> = [];
  public groupIdList: Array<any> = [];

  public defaultRoleName: string;
  public defaultProfile: string;
  public defaultPermissions: Array<any>;
  public formValid: boolean = true;
  public state: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    public router: Router,
    public secutiryService: SecutiryService,
    public shellService: Shell,
    public userService: UserService,
    public deviceService: DeviceService,
    public groupsService: GroupService,
    private fb: FormBuilder
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.roleId = params['id'];
      this.roleDetails = {};
      if (this.roleId !== undefined) {
        this.getRoleDetails();
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
    this.roleEditForm = this.fb.group({
      roleName: [null, Validators.required],
      permissions: [null, Validators.required],
      profiles: [null, Validators.required]
    });
    this.getRoleDetails();
    setTimeout(() => {
      this.defaultRoleName = this.roleEditForm.controls.roleName.value;
      this.defaultPermissions = this.roleEditForm.controls.permissions.value;
      this.defaultProfile = this.roleEditForm.controls.profiles.value;
    }, 300);
  }

  ngDoCheck() {
    setTimeout(() => {
      this.showProfileSelect =
        this.roleEditForm.controls.profiles.value === 'WhiteList' ||
        this.roleEditForm.controls.profiles.value === 'BlackList';

      const arr1 = this.roleEditForm.value.permissions;
      const arr2 = this.defaultPermissions;
      let isSame;
      if (arr1 && arr2) {
        isSame =
          arr1.length === arr2.length &&
          arr1.every(function(element: any, index: number) {
            return element === arr2[index];
          });
      }
      if (
        this.defaultRoleName !== this.roleEditForm.controls.roleName.value ||
        !isSame ||
        this.defaultProfile !== this.roleEditForm.controls.profiles.value ||
        this.state === true
      ) {
        this.formValid = false;
      } else if (
        this.defaultRoleName === this.roleEditForm.controls.roleName.value ||
        (isSame && this.defaultProfile === this.roleEditForm.controls.profiles.value)
      ) {
        this.formValid = true;
      }
    }, 0);
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.deviceSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
    if (
      this.router.url.includes('/roles/selected/') &&
      (this.router.url.includes('/details') || this.router.url.includes('/delete'))
    ) {
      return;
    }
    this.router.navigate(['/roles']);
  }

  show() {
    console.log(this.roleEditForm.invalid);
    console.log(this.showCancelConfirmation);
    console.log(this.formValid);
  }

  onPermissionChange() {
    if (this.roleEditForm.value.permissions !== this.roleDetails.permissions) {
      this.shellService.changeState(false);
    } else {
      this.shellService.changeState(true);
    }
  }

  onChangeName() {
    if (this.roleEditForm.value.roleName === this.roleDetails.name) {
      this.shellService.changeState(false);
    } else {
      this.shellService.changeState(true);
    }
  }

  onCancel() {
    if (this.router.url === `/roles/selected/${this.roleDetails.id}/edit`) {
      const arr1 = this.roleDetails.permissions;
      const arr2 = this.defaultPermissions;
      const isSame =
        arr1.length === arr2.length &&
        arr1.every(function(element: any, index: number) {
          return element === arr2[index];
        });
      if (
        this.roleDetails.name === this.defaultRoleName &&
        isSame &&
        this.roleDetails.searchProfile.type === this.defaultProfile
      ) {
        this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
        return;
      } else {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
        return false;
      }
    }
  }

  propagating(e: Event) {
    e.stopPropagation();
  }

  back() {
    this.shellService.changeState(true);
    this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
  }

  // To get role details based on id
  getRoleDetails(): void {
    this.roleService
      .getRoleDetails(this.roleId)
      .pipe(
        tap((data: any) => {
          const searchProfile = data._embedded['search-profile'];
          this.roleDetails = data;
          if (searchProfile) {
            this.roleDetails.searchProfile = {};
            this.roleDetails.searchProfile.type = searchProfile.type;
            Object.keys(searchProfile['_embedded']).forEach(key => {
              this.roleDetails.searchProfile[key] = searchProfile['_embedded'][key];
            });
          }
          delete this.roleDetails['_embedded'];
          this.deviceList = this.roleDetails.searchProfile.devices;
          this.userList = this.roleDetails.searchProfile.users;
          this.groupList = this.roleDetails.searchProfile.groups;
          this.roleDetails.searchProfile.devices.forEach((item: any) => {
            this.deviceIdList.push(item.id);
          });
          this.roleDetails.searchProfile.users.forEach((item: any) => {
            this.userIdList.push(item.id);
          });
          this.roleDetails.searchProfile.groups.forEach((item: any) => {
            this.groupIdList.push(item.id);
          });
          if (
            this.roleDetails.searchProfile.type === 'WhiteList' ||
            this.roleDetails.searchProfile.type === 'BlackList'
          ) {
            this.showProfileSelect = true;
          }
          this.roleEditForm.controls.roleName.setValue(this.roleDetails.name);
          this.roleEditForm.controls.permissions.setValue(this.roleDetails.permissions);
          this.roleEditForm.controls.profiles.setValue(this.roleDetails.searchProfile.type);
          if (this.defaultRoleName === null || this.defaultPermissions === null || this.defaultProfile === null) {
            this.defaultRoleName = this.roleEditForm.controls.roleName.value;
            this.defaultPermissions = this.roleEditForm.controls.permissions.value;
            this.defaultProfile = this.roleEditForm.controls.profiles.value;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  // To handle update role event
  onRoleUpdate(): void {
    const obj = (({ name, permissions, searchProfile }) => ({ name, permissions, searchProfile }))(this.roleDetails);
    obj.searchProfile.devices = this.roleDetails.searchProfile.devices
      ? this.roleDetails.searchProfile.devices.map((device: any) => device.id)
      : [];
    obj.searchProfile.groups = this.roleDetails.searchProfile.devices
      ? this.roleDetails.searchProfile.groups.map((group: any) => group.id)
      : [];
    obj.searchProfile.users = this.roleDetails.searchProfile.devices
      ? this.roleDetails.searchProfile.users.map((user: any) => user.id)
      : [];
    this.roleService.updateRoleDetails(this.roleDetails.id, obj).subscribe((data: any) => {
      this.roleService.sendUpdate({
        state: true,
        name: this.roleDetails.name,
        searchProfileType: this.roleDetails.searchProfile.type
      });
      this.router.navigate(['/roles/selected/' + this.roleDetails.id + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }
}
