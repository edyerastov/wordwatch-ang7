import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@app/users/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Shell } from '@app/shell/shell.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy, DoCheck {
  public userEditForm: FormGroup;
  public userDetails: any = {};
  private userId: string = '';
  private routerSubscriber: any;

  public showCancelConfirmation = false;
  public subscription: Subscription;
  public defaultFullName: string;
  public defaultUserName: string;
  public defaultEmail: string;
  public defaultChangePass: boolean;
  public defaultActive: boolean;
  public formValid: boolean = true;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private shellService: Shell
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
    this.userEditForm = this.fb.group(
      {
        fullname: [null, [Validators.required, Validators.maxLength(32)]],
        username: [null, [Validators.required, Validators.maxLength(32)]],
        email: [null, Validators.required],
        active: [false],
        changePass: [null],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmation: [null, Validators.required]
      },
      { validator: this.confirmPassword('password', 'confirmation') }
    );

    this.getUserDetails();

    setTimeout(() => {
      this.defaultFullName = this.userEditForm.value.fullname;
      this.defaultUserName = this.userEditForm.value.username;
      this.defaultEmail = this.userEditForm.value.email;
      this.defaultChangePass = this.userEditForm.value.changePass;
      this.defaultActive = this.userEditForm.value.active;
    }, 300);
  }

  ngDoCheck(): void {
    this.onActiveCheckbox();

    if (
      this.defaultFullName !== this.userEditForm.value.fullname ||
      this.defaultUserName !== this.userEditForm.value.username ||
      this.defaultEmail !== this.userEditForm.value.email ||
      this.defaultChangePass !== this.userEditForm.value.changePass ||
      this.defaultActive !== this.userEditForm.value.active
    ) {
      this.formValid = false;
    } else if (
      this.defaultFullName === this.userEditForm.value.fullname ||
      this.defaultUserName === this.userEditForm.value.username ||
      this.defaultEmail === this.userEditForm.value.email ||
      this.defaultChangePass === this.userEditForm.value.changePass ||
      this.defaultActive === this.userEditForm.value.active
    ) {
      this.formValid = true;
    }
  }

  show() {
    console.log(this.defaultFullName, this.userEditForm.value.fullname);
    console.log(this.defaultUserName, this.userEditForm.value.username);
    console.log(this.defaultEmail, this.userEditForm.value.email);
    console.log(this.defaultChangePass, this.userEditForm.value.changePass);
    console.log(this.defaultActive, this.userEditForm.value.active);
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (
      this.router.url.includes('/users/selected/') &&
      (this.router.url.includes('/edit') || this.router.url.includes('/delete'))
    ) {
      return;
    }
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

  // To get user details based on id
  getUserDetails(): void {
    this.userService
      .getUserDetails(this.userId)
      .pipe(
        tap((data: any) => {
          this.userDetails = data;
          this.userEditForm.controls.fullname.setValue(data.fullName);
          this.userEditForm.controls.email.setValue(data.email);
          this.userEditForm.controls.changePass.setValue(data.forceChangePassword);
          this.userEditForm.controls.username.setValue(data.userName);
          this.userEditForm.controls.active.setValue(data.adUser);
          if (this.defaultFullName === null || this.defaultUserName === null || this.defaultEmail === null) {
            this.defaultFullName = data.fullname;
            this.defaultUserName = data.username;
            this.defaultEmail = data.email;
            this.defaultChangePass = data.forceChangePassword;
            this.defaultActive = data.adUser;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onActiveCheckbox() {
    if (this.userEditForm.value.active === true) {
      this.userEditForm.controls.password.disable();
      this.userEditForm.controls.confirmation.disable();
      this.userEditForm.controls.changePass.disable();
    } else {
      this.userEditForm.controls.password.enable();
      this.userEditForm.controls.confirmation.enable();
      this.userEditForm.controls.changePass.enable();
    }
  }

  onUserUpdate() {
    this.userDetails.fullName = this.userEditForm.value.fullname;
    this.userDetails.userName = this.userEditForm.value.username;
    this.userDetails.forceChangePassword = this.userEditForm.value.changePass;
    this.userDetails.email = this.userEditForm.value.email;
    this.userDetails.adUser = this.userEditForm.value.active;

    if (this.userEditForm.controls.password.valid && this.userEditForm.controls.confirmation.valid) {
      this.userDetails.password = this.userEditForm.value.password;
    }
    this.userService.updateUserDetails(this.userDetails.id, this.userDetails).subscribe((data: any) => {
      this.userService.sendUpdate({
        state: true,
        fullName: this.userDetails.fullName,
        userName: this.userDetails.userName,
        email: this.userDetails.email
      });
      this.router.navigate(['/users/selected/' + this.userId + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }

  onCancel() {
    if (this.router.url === `/users/selected/${this.userDetails.id}/edit`) {
      if (
        this.userDetails.fullName === this.defaultFullName &&
        this.userDetails.userName === this.defaultUserName &&
        this.userDetails.forceChangePassword === this.defaultChangePass &&
        this.userDetails.email === this.defaultEmail
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

  back() {
    this.shellService.changeState(true);
    this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
  }
}
