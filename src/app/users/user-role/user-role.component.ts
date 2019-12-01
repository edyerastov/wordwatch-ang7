import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { RoleService } from '@app/roles/services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Shell } from '@app/shell/shell.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  public userDetails: any = {};
  public showCancelConfirmation = false;
  public subscription: Subscription;

  public userRoleForm: FormGroup;
  public rolePermissions: any = [];
  public roleId: any;
  public roleName: any;

  public defaultRole: any;

  public roleSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };
  private userId = '';
  private routerSubscriber: any;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private shellService: Shell,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.userId = params['id'];
      this.userDetails = {};
      if (this.userId !== undefined) {
        this.getUserDetails();
      }
      this.subscription = this.shellService.getConfirmation().subscribe(message => {
        this.showCancelConfirmation = message;
      });
    });
  }

  ngOnInit() {
    this.userRoleForm = this.fb.group({
      roles: null,
      rolesSearch: null
    });
  }

  onRoleChange(e: any) {
    this.roleService
      .getRoleDetails(e.id)
      .pipe(
        tap((data: any) => {
          this.rolePermissions = data.permissions;
          this.roleId = data.id;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onRoleClear(e: Event) {
    console.log('clear');
  }

  onUserUpdate() {
    this.userService.updateUserRole(this.userDetails.id, this.roleId).subscribe((data: any) => {
      this.userService.sendUpdate({ state: true, roleName: this.userRoleForm.controls.roles.value });
      this.router.navigate(['/users/selected/' + this.userId + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }

  // To get user details based on id
  getUserDetails(): void {
    this.userService
      .getUserDetails(this.userId)
      .pipe(
        tap((data: any) => {
          this.userDetails = data;
          this.roleId = this.userDetails._embedded.role.id;
          this.roleName = this.userDetails._embedded.role.name;
          this.rolePermissions = this.userDetails._embedded.role.permissions;
          this.defaultRole = this.userDetails._embedded.role.id;
          this.userRoleForm.controls.roles.setValue({ id: this.roleId, label: this.roleName });
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onCancel() {
    if (this.router.url === `/users/selected/${this.userDetails.id}/role`) {
      if (this.defaultRole === this.roleId) {
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
}
