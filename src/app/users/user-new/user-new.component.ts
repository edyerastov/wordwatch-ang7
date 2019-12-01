import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { RoleService } from '@app/roles/services/role.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit {
  public userNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public userDetails: any = {};
  public rolePermissions: any = [];
  public roleId: any;

  public roleSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    private userService: UserService,
    public shellService: Shell,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.userNewForm = this.fb.group(
      {
        fullname: [null, [Validators.required, Validators.maxLength(32)]],
        username: [null, [Validators.required, Validators.maxLength(32)]],
        email: [null, Validators.required],
        active: [false],
        changePass: [false],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmation: [null, Validators.required],
        roles: null,
        rolesSearch: null
      },
      { validator: this.confirmPassword('password', 'confirmation') }
    );
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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

  onRoleClear(e: Event) {}

  onActiveCheckbox() {
    if (this.userNewForm.value.active === true) {
      this.userNewForm.controls.password.disable();
      this.userNewForm.controls.confirmation.disable();
      this.userNewForm.controls.changePass.disable();
    } else {
      this.userNewForm.controls.password.enable();
      this.userNewForm.controls.confirmation.enable();
      this.userNewForm.controls.changePass.enable();
    }
  }

  confirm() {
    if (this.shellService.isPrevRoute) {
      this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/users');
    }
    this.shellService.setConfirmation(false, '/home');
  }

  onCancel() {
    if (this.router.url === '/newUser') {
      if (
        this.userNewForm.value.fullname !== null ||
        this.userNewForm.value.username !== null ||
        this.userNewForm.value.email
      ) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/users');
      }
    }
  }

  onUserCreate() {
    this.userDetails = {
      fullName: this.userNewForm.value.fullname,
      userName: this.userNewForm.value.username,
      email: this.userNewForm.value.email,
      adUser: false,
      forceChangePassword: this.userNewForm.value.changePass,
      password: this.userNewForm.value.password,
      roleId: this.roleId
    };

    this.userService.newUser(this.userDetails).subscribe(
      (data: any) => {
        this.router.navigate(['../users'], {
          replaceUrl: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }
}
